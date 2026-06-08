'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, PlusCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  mrp?: number;
  stock: number;
  category: string;
  isActive: boolean;
  keyStrengths: string[];
  benefits: string[];
  howToUse: string[];
  images: { url: string }[];
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [mrp, setMrp] = useState(0);
  const [stock, setStock] = useState(100);
  const [category, setCategory] = useState('Herbal Drops');
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  
  // Dynamic fields
  const [strengthInput, setStrengthInput] = useState('');
  const [keyStrengths, setKeyStrengths] = useState<string[]>([]);
  
  const [benefitInput, setBenefitInput] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);

  const [stepInput, setStepInput] = useState('');
  const [howToUse, setHowToUse] = useState<string[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?admin=true');
      const data = await res.json();
      setProducts(data.map((p: any) => ({
        ...p,
        id: p._id
      })));
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (!editingProduct) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  }, [name, editingProduct]);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setDescription('');
    setShortDescription('');
    setPrice(0);
    setMrp(0);
    setStock(100);
    setCategory('Herbal Drops');
    setIsActive(true);
    setImageUrl('/product image/nasha mukti.jpeg');
    setKeyStrengths([
      'Comprehensive Approach: Addresses cravings and detox.',
      'Natural & Safe: 100% organic herbs.'
    ]);
    setBenefits([
      'Reduces alcohol and tobacco cravings significantly',
      'Supports natural liver detoxification'
    ]);
    setHowToUse([
      'Shake bottle before use',
      'Take 20-25 drops twice daily in water'
    ]);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setSlug(product.slug);
    setDescription(product.description);
    setShortDescription(product.shortDescription || '');
    setPrice(product.price);
    setMrp(product.mrp || 0);
    setStock(product.stock);
    setCategory(product.category);
    setIsActive(product.isActive);
    setImageUrl(product.images?.[0]?.url || '/product image/nasha mukti.jpeg');
    setKeyStrengths(product.keyStrengths || []);
    setBenefits(product.benefits || []);
    setHowToUse(product.howToUse || []);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name,
      slug,
      description,
      shortDescription,
      price,
      mrp,
      stock,
      category,
      isActive,
      images: [{ url: imageUrl }],
      keyStrengths,
      benefits,
      howToUse,
      ingredients: [
        {
          category: 'Active Herbs',
          items: ['Ashwagandha', 'Brahmi', 'Vidarikand (Kudzu)']
        }
      ]
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setModalOpen(false);
        fetchProducts();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addStrength = () => {
    if (strengthInput.trim()) {
      setKeyStrengths([...keyStrengths, strengthInput.trim()]);
      setStrengthInput('');
    }
  };

  const removeStrength = (idx: number) => {
    setKeyStrengths(keyStrengths.filter((_, i) => i !== idx));
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput('');
    }
  };

  const removeBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  const addStep = () => {
    if (stepInput.trim()) {
      setHowToUse([...howToUse, stepInput.trim()]);
      setStepInput('');
    }
  };

  const removeStep = (idx: number) => {
    setHowToUse(howToUse.filter((_, i) => i !== idx));
  };

  return (
    <div className="text-[#1A1A1A]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1B5E20]">Manage Products</h1>
          <p className="text-xs text-[#555555]">Create, update, and remove items from the store.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center px-5 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#2E7D32]/10 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#F9FFF9] border-b border-[#2E7D32]/10 text-gray-500 uppercase tracking-wider text-xs">
              <th className="px-6 py-4 font-bold">Product</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">Price</th>
              <th className="px-6 py-4 font-bold">Stock</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="w-5 h-5 text-[#2E7D32] animate-spin" />
                    <span>Loading products...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No products found. Click "Add Product" to create one.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F9FFF9] border border-gray-150 flex items-center justify-center p-1 shrink-0">
                        <img src={p.images?.[0]?.url || 'https://via.placeholder.com/50'} alt="" className="max-h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1A1A1A] line-clamp-1">{p.name}</h4>
                        <span className="text-[10px] text-gray-400 font-medium">{p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-semibold">{p.category}</td>
                  <td className="px-6 py-4 font-bold text-[#2E7D32]">₹{p.price}</td>
                  <td className="px-6 py-4 font-medium text-gray-600">{p.stock} units</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      p.isActive ? 'bg-green-50 text-[#2E7D32] border border-[#2E7D32]/10' : 'bg-gray-50 text-gray-400 border border-gray-100'
                    }`}>
                      {p.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all inline-block"
                      title="Edit Product"
                    >
                      <Edit className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-all inline-block"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center z-10">
                <h3 className="text-xl font-display font-bold text-[#1B5E20]">
                  {editingProduct ? 'Edit Product formulation' : 'Create New Product'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                
                {/* 1. Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                      placeholder="e.g. Dr. Nidan Nasha Mukti Drops 50 ML"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Product Slug *</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                      placeholder="auto-generated-slug"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">MRP (₹)</label>
                    <input
                      type="number"
                      value={mrp}
                      onChange={(e) => setMrp(parseFloat(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Stock Inventory *</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Category *</label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                </div>

                {/* 2. Image URL */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Product Image URL *</label>
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    placeholder="https://cloudinary.com/..."
                  />
                </div>

                {/* 3. Descriptions */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Short Description</label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    placeholder="Short 1-2 sentence hook..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Full Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] resize-none"
                    placeholder="Full Ayurvedic product catalog details..."
                  />
                </div>

                {/* 4. Lists (Strengths, Benefits, HowToUse) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  
                  {/* Key Strengths */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase text-gray-500">Key Strengths</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={strengthInput}
                        onChange={(e) => setStrengthInput(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                        placeholder="Add strength feature..."
                      />
                      <button
                        type="button"
                        onClick={addStrength}
                        className="px-3 bg-emerald-50 border border-[#2E7D32]/10 text-[#2E7D32] rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-2">
                      {keyStrengths.map((str, idx) => (
                        <li key={idx} className="flex justify-between items-center text-xs p-2 bg-[#F9FFF9] border border-[#2E7D32]/10 rounded">
                          <span className="line-clamp-1">{str}</span>
                          <button type="button" onClick={() => removeStrength(idx)} className="text-red-500 font-bold ml-2">×</button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase text-gray-500">Product Benefits</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                        placeholder="Add clinical benefit..."
                      />
                      <button
                        type="button"
                        onClick={addBenefit}
                        className="px-3 bg-emerald-50 border border-[#2E7D32]/10 text-[#2E7D32] rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-2">
                      {benefits.map((ben, idx) => (
                        <li key={idx} className="flex justify-between items-center text-xs p-2 bg-[#F9FFF9] border border-[#2E7D32]/10 rounded">
                          <span className="line-clamp-1">{ben}</span>
                          <button type="button" onClick={() => removeBenefit(idx)} className="text-red-500 font-bold ml-2">×</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* How to use */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <label className="block text-xs font-bold uppercase text-gray-500">How to Use Steps</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={stepInput}
                      onChange={(e) => setStepInput(e.target.value)}
                      className="flex-grow px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                      placeholder="Add administration step..."
                    />
                    <button
                      type="button"
                      onClick={addStep}
                      className="px-4 bg-emerald-50 border border-[#2E7D32]/10 text-[#2E7D32] rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                    >
                      Add Step
                    </button>
                  </div>
                  <ul className="space-y-1.5">
                    {howToUse.map((step, idx) => (
                      <li key={idx} className="flex justify-between items-center text-xs p-2 bg-[#F9FFF9] border border-[#2E7D32]/10 rounded">
                        <span className="line-clamp-1">Step {idx + 1}: {step}</span>
                        <button type="button" onClick={() => removeStep(idx)} className="text-red-500 font-bold ml-2">×</button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 5. Status Toggle */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4.5 h-4.5 text-[#2E7D32] border-gray-300 rounded focus:ring-[#2E7D32]"
                  />
                  <label htmlFor="isActive" className="text-xs font-bold uppercase text-gray-500 cursor-pointer">
                    Publish immediately (Active in Store)
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold rounded-xl text-sm shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-75"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Product</span>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
