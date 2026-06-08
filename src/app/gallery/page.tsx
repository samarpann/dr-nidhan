'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const galleryImages = [
  {
    id: 1,
    url: '/product image/nasha mukti.jpeg',
    category: 'Products',
    title: 'Dr. Nidan Nasha Mukti Drops'
  },
  {
    id: 2,
    url: '/crousel/andhera.jpeg',
    category: 'Products',
    title: 'Dr. Nidan Aanidra Capsules'
  },
  {
    id: 3,
    url: '/crousel/horse.jpeg',
    category: 'Products',
    title: 'Dr. Nidan Horse Rider Gold'
  },
  {
    id: 4,
    url: '/product image/eco cleanser.jpeg',
    category: 'Products',
    title: 'Dr. Nidan Eco Cleanse Drops'
  },
  {
    id: 5,
    url: '/crousel/slim.jpeg',
    category: 'Products',
    title: 'Dr. Nidan Slimkaya Capsules'
  },
  {
    id: 6,
    url: '/product image/andhera.jpeg',
    category: 'Products',
    title: 'Dr. Nidan Aanidra Capsules'
  },
  {
    id: 7,
    url: '/product image/horse rider gold.jpeg',
    category: 'Products',
    title: 'Dr. Nidan Horse Rider Gold'
  },
  {
    id: 8,
    url: '/product image/andhera.jpeg',
    category: 'Products',
    title: 'Dr. Nidan Aanidra Sleep Capsules'
  },
  {
    id: 9,
    url: '/product image/slimkaya.jpeg',
    category: 'Products',
    title: 'Dr. Nidan Slimkaya Weight Capsules'
  }
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Products', 'Herbs', 'Processing'];

  const filteredImages = activeTab === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeTab);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prevIndex) => 
      prevIndex === 0 ? filteredImages.length - 1 : (prevIndex || 0) - 1
    );
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prevIndex) => 
      (prevIndex || 0) === filteredImages.length - 1 ? 0 : (prevIndex || 0) + 1
    );
  };

  return (
    <div className="pt-28 pb-24 bg-[#F9FFF9] min-h-screen text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1 rounded-full">
            Media & Images
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#1B5E20] mt-3 mb-6">Our Gallery</h1>
          <p className="text-base text-[#555555] max-w-xl mx-auto leading-relaxed">
            Take a visual tour of our natural herbs, extraction pipeline, and certified organic Ayurvedic drops.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center space-x-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === cat
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'bg-white text-[#555555] border border-gray-200 hover:text-[#2E7D32] hover:bg-[#F9FFF9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, index) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setLightboxIndex(index)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#2E7D32]/10 shadow-xs hover:shadow-md transition-all relative aspect-square flex items-center justify-center p-6"
              >
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-300" 
                  loading="lazy"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">{img.category}</span>
                      <h3 className="font-bold text-sm">{img.title}</h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fullscreen Lightbox Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[110]"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Nav */}
            <button
              onClick={handlePrev}
              className="absolute left-6 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors z-[110]"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Main Image */}
            <div className="max-w-4xl max-h-[80vh] flex flex-col items-center justify-center">
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={filteredImages[lightboxIndex].url}
                alt={filteredImages[lightboxIndex].title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="text-center mt-6 text-white space-y-1">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  {filteredImages[lightboxIndex].category}
                </span>
                <h2 className="text-lg font-bold">{filteredImages[lightboxIndex].title}</h2>
              </div>
            </div>

            {/* Right Nav */}
            <button
              onClick={handleNext}
              className="absolute right-6 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors z-[110]"
              aria-label="Next Image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
