import { User, Product, Category, Supplier, StockTransaction, PurchaseOrder, Invoice, NotificationItem, ActivityLog, RolePermissions, Role } from '../types';

export const ROLE_PERMISSIONS: Record<Role, RolePermissions> = {
  admin: {
    canCreateProduct: true,
    canEditProduct: true,
    canDeleteProduct: true,
    canManageCategories: true,
    canManageSuppliers: true,
    canStockInOut: true,
    canManagePurchaseOrders: true,
    canGenerateInvoices: true,
    canViewReports: true,
    canManageUsers: true,
    canResetDatabase: true,
  },
  manager: {
    canCreateProduct: true,
    canEditProduct: true,
    canDeleteProduct: false,
    canManageCategories: true,
    canManageSuppliers: true,
    canStockInOut: true,
    canManagePurchaseOrders: true,
    canGenerateInvoices: true,
    canViewReports: true,
    canManageUsers: false,
    canResetDatabase: false,
  },
  staff: {
    canCreateProduct: false,
    canEditProduct: false,
    canDeleteProduct: false,
    canManageCategories: false,
    canManageSuppliers: false,
    canStockInOut: true,
    canManagePurchaseOrders: false,
    canGenerateInvoices: true,
    canViewReports: false,
    canManageUsers: false,
    canResetDatabase: false,
  },
  viewer: {
    canCreateProduct: false,
    canEditProduct: false,
    canDeleteProduct: false,
    canManageCategories: false,
    canManageSuppliers: false,
    canStockInOut: false,
    canManagePurchaseOrders: false,
    canGenerateInvoices: false,
    canViewReports: true,
    canManageUsers: false,
    canResetDatabase: false,
  },
};

export const MOCK_USERS: User[] = [
  {
    id: 'usr_admin',
    name: 'Alexander Vance',
    email: 'admin@aurastock.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Executive Operations',
    title: 'Chief Inventory Officer',
  },
  {
    id: 'usr_manager',
    name: 'Elena Rostova',
    email: 'manager@aurastock.io',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Supply Chain & Fulfillment',
    title: 'Senior Operations Director',
  },
  {
    id: 'usr_staff',
    name: 'Marcus Chen',
    email: 'staff@aurastock.io',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Warehouse & Logistics',
    title: 'Logistics Lead Specialist',
  },
  {
    id: 'usr_viewer',
    name: 'Sophia Patel',
    email: 'viewer@aurastock.io',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Financial Auditing',
    title: 'External Inventory Analyst',
  },
];

export const INITIAL_CATEGORIES: Category[] = [];
export const INITIAL_SUPPLIERS: Supplier[] = [];
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_STOCK_TRANSACTIONS: StockTransaction[] = [];
export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [];
export const INITIAL_INVOICES: Invoice[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
export const INITIAL_ACTIVITIES: ActivityLog[] = [];
