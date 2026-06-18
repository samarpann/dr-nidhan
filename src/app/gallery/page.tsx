'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Image from 'next/image';

const campaignImages = Array.from({ length: 25 }).map((_, i) => ({
  id: 10 + i,
  url: `/campaign/campagin-img-${i + 1}.jpeg`,
  category: 'Campaign',
  title: 'Campaign'
}));

const existingImages = [
  { id: 1, url: '/product image -2/nasha mukti.jpeg', category: 'Products', title: 'Dr. Nidan Nasha Mukti Drops' },
  { id: 2, url: '/crousel/andhera.jpeg', category: 'Products', title: 'Dr. Nidan Aanidra Capsules' },
  { id: 3, url: '/crousel/horse.jpeg', category: 'Products', title: 'Dr. Nidan Horse Rider Gold' },
  { id: 4, url: '/product image -2/eco cleanse.jpeg', category: 'Products', title: 'Dr. Nidan Eco Cleanse Drops' },
  { id: 5, url: '/crousel/slim.jpeg', category: 'Products', title: 'Dr. Nidan Slimkaya Capsules' },
  { id: 6, url: '/product image -2/aandra.jpeg', category: 'Products', title: 'Dr. Nidan Aanidra Capsules' },
  { id: 7, url: '/product image -2/horse rider gold .jpeg', category: 'Products', title: 'Dr. Nidan Horse Rider Gold' },
  { id: 8, url: '/product image -2/aandra.jpeg', category: 'Products', title: 'Dr. Nidan Aanidra Sleep Capsules' },
  { id: 9, url: '/product image -2/slimkaya.jpeg', category: 'Products', title: 'Dr. Nidan Slimkaya Weight Capsules' }
];

const galleryImages = [...existingImages, ...campaignImages];

const ITEMS_PER_PAGE = 9;

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Products', 'Campaign', 'Herbs', 'Processing'];

  const filteredImages = activeTab === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeTab);

  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
  const currentImages = filteredImages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (cat: string) => {
    setActiveTab(cat);
    setCurrentPage(1);
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prevIndex) => 
      prevIndex === 0 ? currentImages.length - 1 : (prevIndex || 0) - 1
    );
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prevIndex) => 
      (prevIndex || 0) === currentImages.length - 1 ? 0 : (prevIndex || 0) + 1
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
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleTabChange(cat)}
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          <AnimatePresence mode="popLayout">
            {currentImages.map((img, index) => (
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
                <div className="w-full h-full relative">
                  <Image 
                    src={img.url} 
                    alt={img.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlMGUwZTAiLz48L3N2Zz4="
                  />
                </div>
                
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-gray-200 text-[#555555] hover:bg-[#F9FFF9] disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                    currentPage === i + 1
                      ? 'bg-[#2E7D32] text-white'
                      : 'bg-white text-[#555555] border border-gray-200 hover:text-[#2E7D32]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-gray-200 text-[#555555] hover:bg-[#F9FFF9] disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
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
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[110]"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-6 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors z-[110]"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <div className="max-w-4xl w-full h-[80vh] flex flex-col items-center justify-center relative">
              <div className="w-full h-full relative">
                <Image
                  key={lightboxIndex}
                  src={currentImages[lightboxIndex].url}
                  alt={currentImages[lightboxIndex].title}
                  fill
                  className="object-contain rounded-lg shadow-2xl"
                  priority
                />
              </div>
              <div className="text-center mt-6 text-white space-y-1">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  {currentImages[lightboxIndex].category}
                </span>
                <h2 className="text-lg font-bold">{currentImages[lightboxIndex].title}</h2>
              </div>
            </div>

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
