import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Role,
  Product,
  Category,
  Supplier,
  StockTransaction,
  PurchaseOrder,
  Invoice,
  NotificationItem,
  ActivityLog,
  RolePermissions,
  TransactionType,
  InvoiceStatus,
  StockStatus,
} from '../types';
import {
  MOCK_USERS,
  MOCK_CATEGORIES,
  MOCK_SUPPLIERS,
  MOCK_PRODUCTS,
  MOCK_STOCK_TRANSACTIONS,
  MOCK_PURCHASE_ORDERS,
  MOCK_INVOICES,
  MOCK_NOTIFICATIONS,
  MOCK_ACTIVITIES,
  ROLE_PERMISSIONS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface InventoryContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (role: Role, email?: string) => void;
  logout: () => void;
  permissions: RolePermissions;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Data
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  stockTransactions: StockTransaction[];
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
  notifications: NotificationItem[];
  activities: ActivityLog[];
  
  // Search & Global state
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  
  // CRUD Actions
  addProduct: (product: Omit<Product, 'id' | 'lastUpdated' | 'status'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => boolean;
  
  addCategory: (category: Omit<Category, 'id' | 'itemCount' | 'totalValuation'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => boolean;
  
  addSupplier: (supplier: Omit<Supplier, 'id' | 'activeOrders'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => boolean;
  
  recordStockTransaction: (tx: {
    productId: string;
    type: TransactionType;
    quantity: number;
    reference: string;
    notes: string;
    costPerUnit?: number;
  }) => boolean;
  
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'date' | 'createdBy'>) => void;
  receivePurchaseOrder: (poId: string) => void;
  
  createInvoice: (inv: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>) => boolean;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'aurastock_user',
  PRODUCTS: 'aurastock_products',
  CATEGORIES: 'aurastock_categories',
  SUPPLIERS: 'aurastock_suppliers',
  TRANSACTIONS: 'aurastock_transactions',
  POS: 'aurastock_pos',
  INVOICES: 'aurastock_invoices',
  NOTIFICATIONS: 'aurastock_notifications',
  ACTIVITIES: 'aurastock_activities',
};

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state - default logged in as admin for immediate usability or from localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
      return MOCK_USERS[0]; // Alexander Vance (Admin)
    } catch {
      return MOCK_USERS[0];
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Core Data States
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
    } catch {
      return MOCK_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : MOCK_CATEGORIES;
    } catch {
      return MOCK_CATEGORIES;
    }
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      return saved ? JSON.parse(saved) : MOCK_SUPPLIERS;
    } catch {
      return MOCK_SUPPLIERS;
    }
  });

  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : MOCK_STOCK_TRANSACTIONS;
    } catch {
      return MOCK_STOCK_TRANSACTIONS;
    }
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POS);
      return saved ? JSON.parse(saved) : MOCK_PURCHASE_ORDERS;
    } catch {
      return MOCK_PURCHASE_ORDERS;
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return saved ? JSON.parse(saved) : MOCK_INVOICES;
    } catch {
      return MOCK_INVOICES;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : MOCK_ACTIVITIES;
    } catch {
      return MOCK_ACTIVITIES;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(stockTransactions));
  }, [stockTransactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POS, JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  // Toast System
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logActivity = (action: string, module: string, details: string) => {
    if (!currentUser) return;
    const newLog: ActivityLog = {
      id: 'act_' + Date.now(),
      timestamp: 'Just now',
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      module,
      details,
    };
    setActivities((prev) => [newLog, ...prev.slice(0, 40)]);
  };

  // Auth Operations
  const login = (role: Role, email?: string) => {
    const foundUser = MOCK_USERS.find((u) => u.role === role) || {
      id: 'usr_' + role,
      name: role.toUpperCase() + ' User',
      email: email || `${role}@aurastock.io`,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      department: 'Corporate Headquarters',
      title: `${role.charAt(0).toUpperCase() + role.slice(1)} Operator`,
    };
    setCurrentUser(foundUser);
    showToast('success', 'Authenticated Successfully', `Welcome back, ${foundUser.name} (${role.toUpperCase()})`);
    logActivity('Session Started', 'Security', `Logged in as ${role.toUpperCase()}`);
  };

  const logout = () => {
    if (currentUser) {
      logActivity('Session Ended', 'Security', `Signed out from ${currentUser.name}`);
    }
    setCurrentUser(null);
    showToast('info', 'Signed Out', 'You have been securely signed out of AuraStock.');
  };

  const permissions: RolePermissions = currentUser
    ? ROLE_PERMISSIONS[currentUser.role]
    : ROLE_PERMISSIONS['viewer'];

  // Helper for computing status
  const calculateStockStatus = (stock: number, minStock: number): StockStatus => {
    if (stock <= 0) return 'OUT_OF_STOCK';
    if (stock <= minStock) return 'LOW_STOCK';
    return 'IN_STOCK';
  };

  // Product Operations
  const addProduct = (prodData: Omit<Product, 'id' | 'lastUpdated' | 'status'>) => {
    if (!permissions.canCreateProduct) {
      showToast('error', 'Permission Denied', 'Your role does not allow creating new products.');
      return;
    }
    const id = 'prod_' + Date.now();
    const status = calculateStockStatus(prodData.stock, prodData.minStock);
    const newProduct: Product = {
      ...prodData,
      id,
      status,
      lastUpdated: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('success', 'Product Registered', `${newProduct.name} (${newProduct.sku}) added to inventory.`);
    logActivity('Product Created', 'Products', `Created ${newProduct.name} [${newProduct.sku}]`);
    
    // Check if added with low stock
    if (status === 'LOW_STOCK' || status === 'OUT_OF_STOCK') {
      addNotificationItem({
        title: 'New Product Low Stock',
        message: `${newProduct.name} was created with low stock level (${newProduct.stock} units).`,
        type: 'warning',
      });
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    if (!permissions.canEditProduct) {
      showToast('error', 'Permission Denied', 'Your role does not allow modifying products.');
      return;
    }
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates, lastUpdated: new Date().toISOString() };
          updated.status = calculateStockStatus(updated.stock, updated.minStock);
          return updated;
        }
        return p;
      })
    );
    showToast('success', 'Product Updated', 'Inventory records updated successfully.');
    logActivity('Product Updated', 'Products', `Modified product ID ${id}`);
  };

  const deleteProduct = (id: string): boolean => {
    if (!permissions.canDeleteProduct) {
      showToast('error', 'Permission Denied', 'Only Administrators have permission to delete inventory items.');
      return false;
    }
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('info', 'Product Deleted', `${target?.name || 'Item'} was removed from catalog.`);
    logActivity('Product Deleted', 'Products', `Deleted ${target?.name} [${target?.sku}]`);
    return true;
  };

  // Category Operations
  const addCategory = (catData: Omit<Category, 'id' | 'itemCount' | 'totalValuation'>) => {
    if (!permissions.canManageCategories) {
      showToast('error', 'Permission Denied', 'Role not authorized to manage categories.');
      return;
    }
    const id = 'cat_' + Date.now();
    const newCat: Category = {
      ...catData,
      id,
      itemCount: 0,
      totalValuation: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast('success', 'Category Created', `Category "${newCat.name}" is now available.`);
    logActivity('Category Created', 'Categories', `Added ${newCat.name}`);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    if (!permissions.canManageCategories) {
      showToast('error', 'Permission Denied', 'Role not authorized to manage categories.');
      return;
    }
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('success', 'Category Updated', 'Category details modified.');
  };

  const deleteCategory = (id: string): boolean => {
    if (!permissions.canManageCategories) {
      showToast('error', 'Permission Denied', 'Role not authorized to delete categories.');
      return false;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('info', 'Category Removed', 'Category was deleted.');
    return true;
  };

  // Supplier Operations
  const addSupplier = (supData: Omit<Supplier, 'id' | 'activeOrders'>) => {
    if (!permissions.canManageSuppliers) {
      showToast('error', 'Permission Denied', 'Role not authorized to manage suppliers.');
      return;
    }
    const id = 'sup_' + Date.now();
    const newSup: Supplier = {
      ...supData,
      id,
      activeOrders: 0,
    };
    setSuppliers((prev) => [...prev, newSup]);
    showToast('success', 'Supplier Registered', `${newSup.name} added to supply network.`);
    logActivity('Supplier Created', 'Suppliers', `Added supplier ${newSup.name}`);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    if (!permissions.canManageSuppliers) {
      showToast('error', 'Permission Denied', 'Role not authorized to update suppliers.');
      return;
    }
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('success', 'Supplier Updated', 'Supplier record saved.');
  };

  const deleteSupplier = (id: string): boolean => {
    if (!permissions.canManageSuppliers) {
      showToast('error', 'Permission Denied', 'Role not authorized to delete suppliers.');
      return false;
    }
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    showToast('info', 'Supplier Removed', 'Supplier record deleted.');
    return true;
  };

  // Stock In / Stock Out
  const recordStockTransaction = ({
    productId,
    type,
    quantity,
    reference,
    notes,
    costPerUnit,
  }: {
    productId: string;
    type: TransactionType;
    quantity: number;
    reference: string;
    notes: string;
    costPerUnit?: number;
  }): boolean => {
    if (!permissions.canStockInOut) {
      showToast('error', 'Permission Denied', 'You do not have rights to record stock movements.');
      return false;
    }

    const prod = products.find((p) => p.id === productId);
    if (!prod) {
      showToast('error', 'Product Not Found', 'Specified product does not exist.');
      return false;
    }

    const previousStock = prod.stock;
    let newStock = previousStock;

    if (type === 'IN' || type === 'RETURN') {
      newStock = previousStock + quantity;
    } else if (type === 'OUT' || type === 'DAMAGE') {
      if (previousStock < quantity) {
        showToast('error', 'Insufficient Stock', `Cannot dispatch ${quantity} units. Only ${previousStock} units available.`);
        return false;
      }
      newStock = previousStock - quantity;
    } else if (type === 'ADJUST') {
      newStock = quantity; // Absolute adjustment
    }

    const newStatus = calculateStockStatus(newStock, prod.minStock);

    // Update Product Stock
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock: newStock,
              status: newStatus,
              lastUpdated: new Date().toISOString(),
            }
          : p
      )
    );

    // Record Transaction
    const newTx: StockTransaction = {
      id: 'tx_' + Date.now(),
      date: new Date().toISOString(),
      type,
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      quantity,
      previousStock,
      newStock,
      reference: reference || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      operatorName: currentUser?.name || 'Operator',
      notes,
      costPerUnit: costPerUnit ?? prod.costPrice,
    };

    setStockTransactions((prev) => [newTx, ...prev]);

    showToast(
      'success',
      `Stock ${type} Recorded`,
      `${prod.name}: ${previousStock} → ${newStock} units (${type === 'IN' ? '+' : '-'}${quantity}).`
    );

    logActivity(`Stock ${type}`, 'Inventory', `${type} ${quantity}x ${prod.name} (Ref: ${newTx.reference})`);

    // Check low stock triggers
    if (newStock <= prod.minStock) {
      addNotificationItem({
        title: newStock === 0 ? 'CRITICAL: Stock Depleted' : 'Low Stock Warning',
        message: `${prod.name} (${prod.sku}) is now at ${newStock} units (Threshold: ${prod.minStock}).`,
        type: newStock === 0 ? 'alert' : 'warning',
      });
    }

    return true;
  };

  // Purchase Order Operations
  const createPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'date' | 'createdBy'>) => {
    if (!permissions.canManagePurchaseOrders) {
      showToast('error', 'Permission Denied', 'Your role cannot create purchase orders.');
      return;
    }
    const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPO: PurchaseOrder = {
      ...poData,
      id: 'po_' + Date.now(),
      poNumber,
      date: new Date().toISOString(),
      createdBy: currentUser?.name || 'Authorized Buyer',
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);
    showToast('success', 'Purchase Order Issued', `${poNumber} created for ${newPO.supplierName}.`);
    logActivity('PO Created', 'Purchases', `Created ${poNumber} for $${newPO.totalAmount.toLocaleString()}`);
  };

  const receivePurchaseOrder = (poId: string) => {
    if (!permissions.canManagePurchaseOrders || !permissions.canStockInOut) {
      showToast('error', 'Permission Denied', 'Your role cannot receive orders.');
      return;
    }
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    if (po.orderStatus === 'RECEIVED') {
      showToast('info', 'Already Received', 'This purchase order has already been logged into stock.');
      return;
    }

    // Auto increment stock for all items
    po.items.forEach((item) => {
      recordStockTransaction({
        productId: item.productId,
        type: 'IN',
        quantity: item.quantity,
        reference: po.poNumber,
        notes: `Received from PO shipment (${po.supplierName})`,
        costPerUnit: item.unitCost,
      });
    });

    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === poId ? { ...p, orderStatus: 'RECEIVED', paymentStatus: 'PAID' } : p))
    );

    showToast('success', 'Shipment Logged to Stock', `All items in ${po.poNumber} have been credited to inventory.`);
    logActivity('PO Received', 'Purchases', `Received and unpacked items for ${po.poNumber}`);
  };

  // Invoicing Operations
  const createInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>): boolean => {
    if (!permissions.canGenerateInvoices) {
      showToast('error', 'Permission Denied', 'Role not permitted to create invoices.');
      return false;
    }

    // Verify stock availability
    for (const item of invData.items) {
      const p = products.find((prod) => prod.id === item.productId);
      if (!p || p.stock < item.quantity) {
        showToast(
          'error',
          'Stock Unavailable',
          `Cannot invoice ${item.quantity}x ${item.productName}. Current stock: ${p ? p.stock : 0}`
        );
        return false;
      }
    }

    const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: Invoice = {
      ...invData,
      id: 'inv_' + Date.now(),
      invoiceNumber: invNumber,
      date: new Date().toISOString(),
    };

    // Auto stock out for each item
    for (const item of invData.items) {
      recordStockTransaction({
        productId: item.productId,
        type: 'OUT',
        quantity: item.quantity,
        reference: invNumber,
        notes: `Sales fulfillment for ${invData.customerName}`,
      });
    }

    setInvoices((prev) => [newInvoice, ...prev]);
    showToast('success', 'Invoice Generated', `${invNumber} created for ${newInvoice.customerName} ($${newInvoice.grandTotal.toLocaleString()}).`);
    logActivity('Invoice Created', 'Billing', `Issued ${invNumber} to ${newInvoice.customerName}`);
    return true;
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
    showToast('info', 'Invoice Status Updated', `Status changed to ${status}`);
  };

  // Notifications
  const addNotificationItem = (notif: { title: string; message: string; type: 'alert' | 'warning' | 'info' | 'success' }) => {
    const newNotif: NotificationItem = {
      id: 'notif_' + Date.now(),
      ...notif,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('info', 'Notifications Cleared', 'All notifications marked as read.');
  };

  // Reset demo data
  const resetDemoData = () => {
    localStorage.clear();
    setProducts(MOCK_PRODUCTS);
    setCategories(MOCK_CATEGORIES);
    setSuppliers(MOCK_SUPPLIERS);
    setStockTransactions(MOCK_STOCK_TRANSACTIONS);
    setPurchaseOrders(MOCK_PURCHASE_ORDERS);
    setInvoices(MOCK_INVOICES);
    setNotifications(MOCK_NOTIFICATIONS);
    setActivities(MOCK_ACTIVITIES);
    setCurrentUser(MOCK_USERS[0]);
    showToast('success', 'System Reset', 'All enterprise mock data restored to pristine state.');
  };

  return (
    <InventoryContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        permissions,
        activeTab,
        setActiveTab,
        products,
        categories,
        suppliers,
        stockTransactions,
        purchaseOrders,
        invoices,
        notifications,
        activities,
        globalSearch,
        setGlobalSearch,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        recordStockTransaction,
        createPurchaseOrder,
        receivePurchaseOrder,
        createInvoice,
        updateInvoiceStatus,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
