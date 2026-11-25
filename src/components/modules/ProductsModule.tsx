import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Product, StockStatus } from '../../types';
import { Modal } from '../common/Modal';
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  Barcode,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Layers,
  MapPin,
  DollarSign,
  Tag,
} from 'lucide-react';

export const ProductsModule: React.FC = () => {
  const {
    products,
    categories,
    suppliers,
    addProduct,
    updateProduct,
    deleteProduct,
    permissions,
    showToast,
    globalSearch,
  } = useInventory();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    categoryId: categories[0]?.id || '',
    stock: 10,
    minStock: 5,
    maxStock: 50,
    unitPrice: 100,
    costPrice: 70,
    supplierId: suppliers[0]?.id || '',
    barcode: '',
    unit: 'Units',
    location: 'Aisle 1, Bin 10',
  });

  // Effective search combining global and local
  const effectiveSearch = globalSearch || searchTerm;

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
          p.sku.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
          p.barcode.includes(effectiveSearch);
        const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'name') diff = a.name.localeCompare(b.name);
        if (sortBy === 'stock') diff = a.stock - b.stock;
        if (sortBy === 'price') diff = a.unitPrice - b.unitPrice;
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [products, effectiveSearch, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const openAddModal = () => {
    setFormData({
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      description: '',
      categoryId: categories[0]?.id || '',
      stock: 10,
      minStock: 5,
      maxStock: 50,
      unitPrice: 150,
      costPrice: 90,
      supplierId: suppliers[0]?.id || '',
      barcode: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      unit: 'Units',
      location: 'Section A, Tier 1',
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setActiveProduct(prod);
    setFormData({
      sku: prod.sku,
      name: prod.name,
      description: prod.description,
      categoryId: prod.categoryId,
      stock: prod.stock,
      minStock: prod.minStock,
      maxStock: prod.maxStock,
      unitPrice: prod.unitPrice,
      costPrice: prod.costPrice,
      supplierId: prod.supplierId,
      barcode: prod.barcode,
      unit: prod.unit,
      location: prod.location,
    });
    setIsEditModalOpen(true);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === formData.categoryId);
    const sup = suppliers.find((s) => s.id === formData.supplierId);

    addProduct({
      sku: formData.sku,
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId,
      categoryName: cat?.name || 'General',
      stock: Number(formData.stock),
      minStock: Number(formData.minStock),
      maxStock: Number(formData.maxStock),
      unitPrice: Number(formData.unitPrice),
      costPrice: Number(formData.costPrice),
      supplierId: formData.supplierId,
      supplierName: sup?.name || 'General Supplier',
      barcode: formData.barcode,
      unit: formData.unit,
      location: formData.location,
    });

    setIsAddModalOpen(false);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;

    const cat = categories.find((c) => c.id === formData.categoryId);
    const sup = suppliers.find((s) => s.id === formData.supplierId);

    updateProduct(activeProduct.id, {
      ...formData,
      categoryName: cat?.name || activeProduct.categoryName,
      supplierName: sup?.name || activeProduct.supplierName,
      stock: Number(formData.stock),
      minStock: Number(formData.minStock),
      maxStock: Number(formData.maxStock),
      unitPrice: Number(formData.unitPrice),
      costPrice: Number(formData.costPrice),
    });

    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!activeProduct) return;
    deleteProduct(activeProduct.id);
    setIsDeleteModalOpen(false);
    setActiveProduct(null);
  };

  const exportCSV = () => {
    const headers = ['SKU,Name,Category,Stock,MinStock,UnitPrice,CostPrice,Supplier,Barcode,Location\n'];
    const rows = products.map(
      (p) =>
        `"${p.sku}","${p.name}","${p.categoryName}",${p.stock},${p.minStock},${p.unitPrice},${p.costPrice},"${p.supplierName}","${p.barcode}","${p.location}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-catalog-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('success', 'Export Complete', 'Inventory catalog CSV downloaded.');
  };

  const getStatusBadge = (status: StockStatus, stock: number) => {
    switch (status) {
      case 'IN_STOCK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>In Stock ({stock})</span>
          </span>
        );
      case 'LOW_STOCK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 whitespace-nowrap">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span>Low Stock ({stock})</span>
          </span>
        );
      case 'OUT_OF_STOCK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 whitespace-nowrap">
            <XCircle className="w-3 h-3 shrink-0" />
            <span>Out of Stock (0)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-indigo-400" />
            <span>Product Inventory Catalog</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Master SKU catalog with live inventory tracking, valuation, and barcode telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl glass-panel-subtle hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>

          {permissions.canCreateProduct && (
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="p-4 rounded-2xl glass-card border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Local Search input */}
        <div className="lg:col-span-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SKU, Product Name, Barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs text-slate-100 placeholder:text-slate-500 border border-white/10"
          />
        </div>

        {/* Category filter */}
        <div className="lg:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs text-slate-200 border border-white/10 bg-slate-900"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status filter */}
        <div className="lg:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs text-slate-200 border border-white/10 bg-slate-900"
          >
            <option value="all">All Stock Statuses</option>
            <option value="IN_STOCK">In Stock Only</option>
            <option value="LOW_STOCK">Low Stock Warnings</option>
            <option value="OUT_OF_STOCK">Out of Stock Only</option>
          </select>
        </div>

        {/* Sort order toggle */}
        <div className="lg:col-span-2 flex items-center gap-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-2 py-2 rounded-xl glass-input text-xs text-slate-200 border border-white/10 bg-slate-900"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
            <option value="price">Sort by Price</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-xl glass-panel-subtle hover:bg-white/10 border border-white/10 text-slate-300"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="rounded-2xl glass-card border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Product & SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Status & Stock</th>
                <th className="py-3.5 px-4 text-right">Unit Price</th>
                <th className="py-3.5 px-4 text-right">Cost Price</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No products matched your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/[0.03] transition-colors group">
                    {/* Name & SKU */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm tracking-tight">{prod.name}</div>
                      <div className="flex items-center gap-2 mt-0.5 text-slate-400">
                        <span className="font-mono text-indigo-300 text-[11px] whitespace-nowrap">{prod.sku}</span>
                        <span>•</span>
                        <span className="text-slate-400 truncate">{prod.supplierName}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 border border-white/10 text-slate-300">
                        {prod.categoryName}
                      </span>
                    </td>

                    {/* Status & Stock */}
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(prod.status, prod.stock)}
                      <div className="text-[10px] text-slate-400 mt-1">Min: {prod.minStock} | Max: {prod.maxStock}</div>
                    </td>

                    {/* Unit Price */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                      ${prod.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Cost Price */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                      ${prod.costPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="text-[11px]">{prod.location}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setActiveProduct(prod);
                            setIsBarcodeModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="View Barcode"
                        >
                          <Barcode className="w-4 h-4" />
                        </button>

                        {permissions.canEditProduct && (
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-white/10 transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {permissions.canDeleteProduct && (
                          <button
                            onClick={() => {
                              setActiveProduct(prod);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Inventory Product"
        subtitle="Register SKU, set minimum restock threshold and financial pricing"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">SKU Code *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="e.g. LiDAR Solid-State Array Gen5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="Hardware specifications, tolerances, and use cases..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full h-9 px-3 py-1.5 rounded-xl glass-input text-xs text-white bg-slate-900 truncate"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="truncate">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Supplier *</label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full h-9 px-3 py-1.5 rounded-xl glass-input text-xs text-white bg-slate-900 truncate"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id} className="truncate">
                    {s.name} ({s.company})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Stock Units</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Min Restock Threshold</label>
              <input
                type="number"
                min="1"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unit Selling Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unit Cost Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Warehouse Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="Aisle 3, Shelf B"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Barcode / UPC</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl glass-panel-subtle hover:bg-white/10 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl glass-button-primary text-xs font-bold text-white shadow-lg"
            >
              Create Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Product: ${activeProduct?.sku}`}
        subtitle="Update pricing, stock levels or warehouse location"
        maxWidth="2xl"
      >
        <form onSubmit={handleUpdateProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-slate-900"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Stock Level</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Min Restock Threshold</label>
              <input
                type="number"
                min="1"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unit Selling Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unit Cost Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Warehouse Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Barcode</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl glass-panel-subtle hover:bg-white/10 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl glass-button-primary text-xs font-bold text-white shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Barcode Viewer Modal */}
      <Modal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        title="Universal Product Barcode"
        subtitle={activeProduct?.name}
        maxWidth="md"
      >
        <div className="p-6 bg-white rounded-2xl text-slate-900 text-center space-y-4">
          <div className="text-xs uppercase font-bold text-slate-600 tracking-wider">
            {activeProduct?.categoryName}
          </div>
          <div className="text-sm font-extrabold text-slate-900">{activeProduct?.name}</div>

          {/* Graphical SVG Barcode simulation */}
          <div className="py-4 px-2 flex justify-center items-center gap-[3px]">
            {activeProduct?.barcode.split('').map((digit, idx) => (
              <div
                key={idx}
                className="bg-black"
                style={{
                  height: '64px',
                  width: parseInt(digit) % 2 === 0 ? '4px' : '2px',
                  marginRight: parseInt(digit) % 3 === 0 ? '3px' : '1px',
                }}
              />
            ))}
          </div>

          <div className="font-mono text-base font-bold tracking-widest text-slate-900">
            {activeProduct?.barcode}
          </div>
          <div className="text-xs text-slate-500 font-mono">SKU: {activeProduct?.sku}</div>

          <button
            onClick={() => window.print()}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold mt-2"
          >
            Print Barcode Label
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Inventory Deletion"
        subtitle="This action cannot be undone"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to permanently delete{' '}
            <span className="font-bold text-white">{activeProduct?.name}</span> ({activeProduct?.sku})?
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl glass-panel-subtle hover:bg-white/10 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
