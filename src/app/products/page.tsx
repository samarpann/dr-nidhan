'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp?: number;
  shortDescription?: string;
  images: { url: string }[];
  category: string;
};

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data.map((p: any) => ({
            id: p._id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            mrp: p.mrp,
            shortDescription: p.shortDescription,
            images: (p.images || []).map((img: any) => {
              let url = img.url;
              if (url.includes('/product image/')) {
                url = url.replace('/product image/', '/product image -2/')
                         .replace('andhera.jpeg', 'aandra.jpeg')
                         .replace('eco cleanser.jpeg', 'eco cleanse.jpeg')
                         .replace('horse rider gold.jpeg', 'horse rider gold .jpeg');
              }
              return { ...img, url };
            }),
            category: p.category || 'Herbal Drops'
          })));
        }
      } catch (error) {
        console.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-28 pb-24 bg-[#F9FFF9] min-h-screen text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1 rounded-full">
              Ayurvedic Shop
            </span>
            <h1 className="text-4xl font-display font-bold text-[#1B5E20] mt-3">Our Products</h1>
            <p className="text-sm text-[#555555] mt-2">
              Browse our clinical-grade formulations prepared from 100% organic herbs.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A] shadow-2xs"
            />
            <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex space-x-2 mb-12 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 uppercase tracking-wider ${
                activeCategory === cat
                  ? 'bg-[#2E7D32] text-white shadow-2xs'
                  : 'bg-white text-[#555555] border border-gray-200 hover:text-[#2E7D32] hover:bg-[#F9FFF9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-[#2E7D32] animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white border border-gray-100 rounded-2xl p-12">
            No products found matching "{search}" in category "{activeCategory}".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, i) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl overflow-hidden border border-[#2E7D32]/10 shadow-2xs flex flex-col justify-between group h-full"
              >
                <Link href={`/products/${product.slug}`} className="block p-5">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F9FFF9] mb-4 flex items-center justify-center p-4 border border-gray-50">
                    <img 
                      src={product.images?.[0]?.url || '/product image -2/nasha mukti.jpeg'} 
                      alt={product.name} 
                      className="max-h-full object-contain group-hover:scale-103 transition-transform duration-500" 
                    />
                  </div>
                  
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32]">
                    {product.category}
                  </span>
                  <h3 className="font-display font-bold text-base text-[#1A1A1A] mt-1 group-hover:text-[#2E7D32] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#555555] mt-1.5 line-clamp-2 leading-relaxed h-8">
                    {product.shortDescription || 'Authentic organic Ayurvedic formula.'}
                  </p>
                </Link>

                <div className="p-5 pt-0 border-t border-gray-50 mt-4 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-[#2E7D32]">₹{product.price}</span>
                    {product.mrp && (
                      <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      addToCart(product);
                      alert('Added to Cart!');
                    }}
                    className="px-4 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
