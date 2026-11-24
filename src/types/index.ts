export type Role = 'admin' | 'manager' | 'staff' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department: string;
  title: string;
}

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  stock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  costPrice: number;
  supplierId: string;
  supplierName: string;
  barcode: string;
  status: StockStatus;
  unit: string;
  lastUpdated: string;
  location: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  itemCount: number;
  totalValuation: number;
}

export interface Supplier {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  activeOrders: number;
  leadTimeDays: number;
  status: 'ACTIVE' | 'INACTIVE' | 'PREFERRED';
  taxId: string;
}

export type TransactionType = 'IN' | 'OUT' | 'ADJUST' | 'RETURN' | 'DAMAGE';

export interface StockTransaction {
  id: string;
  date: string;
  type: TransactionType;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  reference: string;
  operatorName: string;
  notes: string;
  costPerUnit: number;
}

export interface POItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export type POStatus = 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'PARTIAL';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  expectedDate: string;
  items: POItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: POStatus;
  notes: string;
  createdBy: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';
export type PaymentMethod = 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CASH' | 'STRIPE' | 'PAYPAL';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  discountPercent: number;
  discountAmount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
  notes: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: Role;
  action: string;
  module: string;
  details: string;
}

export interface RolePermissions {
  canCreateProduct: boolean;
  canEditProduct: boolean;
  canDeleteProduct: boolean;
  canManageCategories: boolean;
  canManageSuppliers: boolean;
  canStockInOut: boolean;
  canManagePurchaseOrders: boolean;
  canGenerateInvoices: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canResetDatabase: boolean;
}
