'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, CheckCircle, Info, ChevronRight, Plus, Minus, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  mrp?: number;
  stock: number;
  category: string;
  images: { url: string }[];
  keyStrengths: string[];
  ingredients: { category: string; items: string[] }[];
  benefits: string[];
  howToUse: string[];
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'strengths' | 'how' | 'ingredients' | 'benefits'>('desc');
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct({
            id: data._id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            shortDescription: data.shortDescription,
            price: data.price,
            mrp: data.mrp,
            stock: data.stock || 100,
            category: data.category || 'Herbal Drops',
            images: data.images || [],
            keyStrengths: data.keyStrengths || [],
            ingredients: data.ingredients || [],
            benefits: data.benefits || [],
            howToUse: data.howToUse || []
          });

          // Fetch reviews for product
          const revRes = await fetch(`/api/testimonials?approved=true`);
          if (revRes.ok) {
            const revData = await revRes.json();
            setReviews(revData);
          }
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProductDetails();
  }, [slug]);

  const handleQtyChange = (type: 'inc' | 'dec') => {
    if (!product) return;
    if (type === 'inc') {
      setQuantity((prev) => Math.min(product.stock, prev + 1));
    } else {
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  const handleAction = (action: 'cart' | 'buy') => {
    if (!user) {
      router.push(`/login?redirect=/products/${slug}`);
      return;
    }

    if (product) {
      addToCart(product, quantity);
      if (action === 'buy') {
        router.push('/cart');
      } else {
        alert('Added to Cart!');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FFF9]">
        <Loader2 className="w-10 h-10 text-[#2E7D32] animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FFF9] text-center p-4">
        <h1 className="text-3xl font-display font-bold text-red-600 mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8">The requested formulation details are unavailable.</p>
        <Link href="/products" className="px-6 py-3 bg-[#2E7D32] text-white font-semibold rounded-lg">
          Back to Shop
        </Link>
      </div>
    );
  }

  const mainImage = product.images?.[activeImageIndex]?.url || '/product image/nasha mukti.jpeg';

  return (
    <div className="pt-28 pb-24 bg-[#F9FFF9] min-h-screen text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link href="/products" className="inline-flex items-center text-sm font-semibold text-[#2E7D32] hover:text-[#1B5E20] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
        </Link>

        {/* Top Detail Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-16">
          
          {/* Gallery Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-[#2E7D32]/10 shadow-xs flex items-center justify-center p-6">
              <img src={mainImage} alt={product.name} className="max-h-full max-w-full object-contain" />
            </div>

            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 bg-white rounded-xl overflow-hidden border p-1.5 flex items-center justify-center transition-all ${
                      activeImageIndex === idx ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/15' : 'border-gray-200'
                    }`}
                  >
                    <img src={img.url} alt="" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#1B5E20]">
              {product.name}
            </h1>

            {/* Rating display */}
            <div className="flex items-center space-x-2">
              <div className="flex text-[#F9A825]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4.5 h-4.5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-semibold">({reviews.length > 0 ? reviews.length : 3} reviews)</span>
            </div>

            {/* Prices */}
            <div className="flex items-baseline space-x-4">
              <span className="text-3xl font-bold text-[#2E7D32]">₹{product.price}</span>
              {product.mrp && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
                  <span className="text-xs text-red-600 bg-red-50 border border-red-100 font-bold px-2.5 py-1 rounded">
                    Save {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-[#555555] leading-relaxed">
              {product.shortDescription || '100% Ayurvedic organic formulation. Free from chemical side effects.'}
            </p>

            {/* Qty & Add to Cart Controls */}
            <div className="pt-4 border-t border-gray-100 space-y-6">
              <div className="flex items-center space-x-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#555555]">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => handleQtyChange('dec')}
                    className="p-2.5 hover:bg-gray-50 text-gray-500 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 text-sm font-semibold w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQtyChange('inc')}
                    className="p-2.5 hover:bg-gray-50 text-gray-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-400 font-medium">({product.stock} bottles in stock)</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleAction('cart')}
                  className="flex-1 py-4 border-2 border-[#2E7D32] hover:bg-[#F9FFF9] text-[#2E7D32] font-semibold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-2xs"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                
                <button
                  onClick={() => handleAction('buy')}
                  className="flex-1 py-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold rounded-xl transition-all shadow-md"
                >
                  Buy It Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs Section */}
        <div className="border-t border-gray-100 pt-12 mb-16">
          <div className="flex border-b border-gray-200 overflow-x-auto pb-px scrollbar-none whitespace-nowrap mb-8">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'desc' ? 'border-[#2E7D32] text-[#2E7D32]' : 'border-transparent text-gray-500 hover:text-[#2E7D32]'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('strengths')}
              className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'strengths' ? 'border-[#2E7D32] text-[#2E7D32]' : 'border-transparent text-gray-500 hover:text-[#2E7D32]'
              }`}
            >
              Key Strengths
            </button>
            <button
              onClick={() => setActiveTab('how')}
              className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'how' ? 'border-[#2E7D32] text-[#2E7D32]' : 'border-transparent text-gray-500 hover:text-[#2E7D32]'
              }`}
            >
              How to Use
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'ingredients' ? 'border-[#2E7D32] text-[#2E7D32]' : 'border-transparent text-gray-500 hover:text-[#2E7D32]'
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'benefits' ? 'border-[#2E7D32] text-[#2E7D32]' : 'border-transparent text-gray-500 hover:text-[#2E7D32]'
              }`}
            >
              Benefits
            </button>
          </div>

          {/* Tab Panels */}
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#2E7D32]/10 shadow-2xs">
            {activeTab === 'desc' && (
              <div className="prose prose-emerald max-w-none text-sm text-[#555555] leading-relaxed space-y-4">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'strengths' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {product.keyStrengths.map((str, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-sm text-[#555555] p-4 bg-[#F9FFF9] rounded-xl border border-[#2E7D32]/10">
                    <CheckCircle className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'how' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {product.howToUse.map((step, idx) => (
                  <div key={idx} className="p-6 bg-[#F9FFF9] border border-gray-100 rounded-xl relative overflow-hidden">
                    <span className="absolute top-2 right-2 text-3xl font-display font-bold text-[#2E7D32]/10">{idx + 1}</span>
                    <p className="text-xs font-semibold text-[#1A1A1A] mb-2">Step {idx + 1}</p>
                    <p className="text-xs text-[#555555] leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {product.ingredients.map((cat, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="font-bold text-[#1B5E20] border-b border-gray-100 pb-2 text-sm">{cat.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((item) => (
                        <span key={item} className="bg-[#FFF8E1] text-[#F9A825] px-3 py-1 rounded-full text-xs font-semibold">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'benefits' && (
              <ul className="space-y-3">
                {product.benefits.map((ben, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm text-[#555555]">
                    <span className="w-6 h-6 rounded-full bg-emerald-50 text-[#2E7D32] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{idx + 1}</span>
                    <span className="mt-0.5">{ben}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* User Reviews */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#1B5E20] border-b border-gray-100 pb-4">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No reviews for this product yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.slice(0, 4).map((rev) => (
                <div key={rev._id} className="bg-white p-6 rounded-xl border border-[#2E7D32]/10 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-[#F9A825]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] bg-[#FFF8E1] text-[#F9A825] px-2 py-0.5 rounded font-bold">Verified Purchase</span>
                  </div>
                  <p className="text-[#555555] text-sm italic mb-4">"{rev.review}"</p>
                  <div className="text-xs text-gray-400 font-semibold">{rev.name} — {rev.city}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
