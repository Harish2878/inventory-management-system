import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Category } from '../../types';
import { Modal } from '../common/Modal';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Box,
  DollarSign,
  Cpu,
  Bot,
  Server,
  Radio,
  Zap,
  Armchair,
  FolderPlus,
} from 'lucide-react';

export const CategoriesModule: React.FC = () => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    permissions,
    setActiveTab,
  } = useInventory();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Cpu',
    color: 'from-indigo-500 to-purple-500',
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-indigo-400" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-fuchsia-400" />;
      case 'Radio':
        return <Radio className="w-5 h-5 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Armchair':
        return <Armchair className="w-5 h-5 text-rose-400" />;
      default:
        return <Layers className="w-5 h-5 text-indigo-400" />;
    }
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: 'Cpu',
      color: 'from-indigo-500 to-cyan-500',
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setActiveCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
    });
    setIsEditModalOpen(true);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');
    addCategory({
      name: formData.name,
      slug,
      description: formData.description,
      icon: formData.icon,
      color: formData.color,
    });
    setIsAddModalOpen(false);
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategory) return;
    updateCategory(activeCategory.id, formData);
    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!activeCategory) return;
    deleteCategory(activeCategory.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-purple-400" />
            <span>Category Classification</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Organize inventory into divisions, compute group valuations, and manage taxonomies
          </p>
        </div>

        {permissions.canManageCategories && (
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>New Category</span>
          </button>
        )}
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          // Dynamic calculation of count & valuation from products
          const catProducts = products.filter((p) => p.categoryId === cat.id);
          const itemCount = catProducts.length;
          const totalUnits = catProducts.reduce((acc, p) => acc + p.stock, 0);
          const totalValuation = catProducts.reduce((acc, p) => acc + p.stock * p.costPrice, 0);

          return (
            <div
              key={cat.id}
              className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between group hover:border-indigo-500/40 transition-all duration-300 relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <div className="flex items-center gap-1">
                    {permissions.canManageCategories && (
                      <>
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Edit Category"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveCategory(cat);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">/{cat.slug}</div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Products</div>
                  <div className="font-extrabold text-white mt-0.5 flex items-center gap-1">
                    <Box className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{itemCount} SKUs ({totalUnits} units)</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Valuation</div>
                  <div className="font-extrabold text-emerald-400 mt-0.5 font-mono">
                    ${totalValuation.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>

              {/* Accent colored bottom bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.color} opacity-70`} />
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Category"
        subtitle="Group products into searchable catalog classifications"
        maxWidth="md"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              placeholder="e.g. Avionics & Flight Systems"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Slug Identifier</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
              placeholder="avionics-flight-systems"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              placeholder="Summary of items and classification criteria..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Visual Icon</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-slate-900"
            >
              <option value="Cpu">Microchip / Processor (Cpu)</option>
              <option value="Server">Rackmount / Computing (Server)</option>
              <option value="Bot">Autonomous Robotics (Bot)</option>
              <option value="Radio">Telemetry Sensors (Radio)</option>
              <option value="Zap">High-Voltage Power (Zap)</option>
              <option value="Armchair">Ergonomic Gear (Armchair)</option>
            </select>
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
              Create Category
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Category: ${activeCategory?.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleUpdateCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Visual Icon</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-slate-900"
            >
              <option value="Cpu">Microchip / Processor (Cpu)</option>
              <option value="Server">Rackmount / Computing (Server)</option>
              <option value="Bot">Autonomous Robotics (Bot)</option>
              <option value="Radio">Telemetry Sensors (Radio)</option>
              <option value="Zap">High-Voltage Power (Zap)</option>
              <option value="Armchair">Ergonomic Gear (Armchair)</option>
            </select>
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

      {/* Delete Category Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to remove the category{' '}
            <span className="font-bold text-white">{activeCategory?.name}</span>?
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
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
