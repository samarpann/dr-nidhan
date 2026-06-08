'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CarouselSlide = {
  id: string;
  imageUrl: string;
  caption?: string;
  ctaText?: string;
  ctaLink?: string;
  orderIndex: number;
  isActive: boolean;
};

export default function AdminCarousel() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);

  // Form states
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [ctaText, setCtaText] = useState('Shop Now');
  const [ctaLink, setCtaLink] = useState('/products');
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/carousel?admin=true');
      const data = await res.json();
      setSlides(data.map((s: any) => ({
        ...s,
        id: s._id
      })));
    } catch (error) {
      console.error('Failed to fetch carousel slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openAddModal = () => {
    setEditingSlide(null);
    setImageUrl('/crousel/andhera.jpeg');
    setCaption('');
    setCtaText('Shop Now');
    setCtaLink('/products/dr-nidan-nasha-mukti-drops-50ml');
    setOrderIndex(slides.length);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setImageUrl(slide.imageUrl);
    setCaption(slide.caption || '');
    setCtaText(slide.ctaText || 'Shop Now');
    setCtaLink(slide.ctaLink || '/products');
    setOrderIndex(slide.orderIndex);
    setIsActive(slide.isActive);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      imageUrl,
      caption,
      ctaText,
      ctaLink,
      orderIndex,
      isActive
    };

    try {
      let res;
      if (editingSlide) {
        res = await fetch(`/api/carousel/${editingSlide.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/carousel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setModalOpen(false);
        fetchSlides();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting slide');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slideId: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      const res = await fetch(`/api/carousel/${slideId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSlides();
      } else {
        alert('Failed to delete slide');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="text-[#1A1A1A]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1B5E20]">Manage Carousel Slides</h1>
          <p className="text-xs text-[#555555]">Configure sliders featured on the landing page hero.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center px-5 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Slide
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#2E7D32]/10 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#F9FFF9] border-b border-[#2E7D32]/10 text-gray-500 uppercase tracking-wider text-xs">
              <th className="px-6 py-4 font-bold">Image</th>
              <th className="px-6 py-4 font-bold">Caption</th>
              <th className="px-6 py-4 font-bold">CTA Button</th>
              <th className="px-6 py-4 font-bold">Order Index</th>
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
                    <span>Loading slides...</span>
                  </div>
                </td>
              </tr>
            ) : slides.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No carousel slides found. Click "Add Slide" to create one.
                </td>
              </tr>
            ) : (
              slides.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-10 rounded overflow-hidden border border-gray-100 flex items-center justify-center p-1 bg-[#F9FFF9]">
                      <img src={s.imageUrl} alt="" className="max-h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#1A1A1A] max-w-xs truncate" title={s.caption}>
                    {s.caption || 'No caption text'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 border border-gray-100 rounded">
                      {s.ctaText || 'Shop Now'} → {s.ctaLink || '/'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-500">{s.orderIndex}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      s.isActive ? 'bg-green-50 text-[#2E7D32] border border-[#2E7D32]/10' : 'bg-gray-50 text-gray-400 border border-gray-100'
                    }`}>
                      {s.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(s)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all inline-block"
                      title="Edit Slide"
                    >
                      <Edit className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-all inline-block"
                      title="Delete Slide"
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

      {/* Add / Edit Slide Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-100"
            >
              <div className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center">
                <h3 className="text-xl font-display font-bold text-[#1B5E20]">
                  {editingSlide ? 'Edit Carousel Slide' : 'Create New Slide'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-4">
                
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Image URL *</label>
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Caption Overlay Text</label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    placeholder="e.g. Ayurvedic Nasha Mukti Drops"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">CTA Button Text</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">CTA Target Link</label>
                    <input
                      type="text"
                      value={ctaLink}
                      onChange={(e) => setCtaLink(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Order Index (Priority)</label>
                  <input
                    type="number"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4.5 h-4.5 text-[#2E7D32] border-gray-300 rounded focus:ring-[#2E7D32]"
                  />
                  <label htmlFor="isActive" className="text-xs font-bold uppercase text-gray-500 cursor-pointer">
                    Enable slide in Home Carousel
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
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
                      <span>Save Slide</span>
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
