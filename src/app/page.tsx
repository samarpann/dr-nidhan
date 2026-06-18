'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { 
  ArrowRight, ShieldCheck, Leaf, Sparkles, Star, 
  MessageSquare, HeartHandshake, Eye, Flame, CheckCircle, 
  Droplet, Layers, Beaker, Clock, BookOpen, Compass
} from 'lucide-react';

export default function Home() {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Hero carousel slides
  const slides = [
    {
      image: '/crousel/andhera.jpeg',
      title: 'The Qualified Organic Product',
      subtitle: '30+ Herbs | 100% Ayurvedic | No Color, No Flavor, No Taste',
    },
    {
      image: '/crousel/horse.jpeg',
      title: 'Nasha Mukti Drops 50ml',
      subtitle: 'Effective recovery from alcohol & tobacco addiction naturally',
    },
    {
      image: '/crousel/slim.jpeg',
      title: 'Restore Health & Harmony',
      subtitle: 'Result Oriented | Quality Standard | 100% Organic',
    }
  ];

  // Auto play hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch flagship product
  useEffect(() => {
    const fetchFlagship = async () => {
      try {
        const res = await fetch('/api/products/dr-nidan-nasha-mukti-drops-50ml');
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error('Error fetching flagship product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlagship();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      if (res.ok) {
        setNewsletterSuccess(true);
        setNewsletterEmail('');
        setTimeout(() => setNewsletterSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Newsletter error:', error);
    }
  };

  const keyStrengths = [
    {
      title: 'Comprehensive Approach',
      description: 'Addresses stress, anxiety, craving, detox, and mood support.',
      icon: HeartHandshake,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    {
      title: 'Natural & Safe',
      description: 'Carefully selected organic herbal ingredients ensure safety and efficacy.',
      icon: Leaf,
      color: 'bg-green-50 text-green-700 border-green-100'
    },
    {
      title: 'Ayurvedic Wisdom',
      description: 'Drawing from ancient Ayurvedic knowledge and traditional herbalism.',
      icon: Compass,
      color: 'bg-amber-50 text-amber-700 border-amber-100'
    },
    {
      title: 'Research-Backed',
      description: 'Herbs studied clinically for addiction recovery and detoxification.',
      icon: Beaker,
      color: 'bg-blue-50 text-blue-700 border-blue-100'
    }
  ];

  const testimonials = [
    {
      name: 'Sumit Singh',
      city: 'Delhi',
      review: 'Dr. Nidan Nasha Mukti Drops have been a miracle. My alcohol cravings reduced significantly within just a few weeks of taking them secretly with dinner. No side effects at all!',
      stars: 5,
      verified: true
    },
    {
      name: 'Rajesh Kumar',
      city: 'Lucknow',
      review: '100% natural and highly effective. We mixed these colorless drops in my brother’s tea without him knowing. His alcohol intake has gone down to zero in 2 months. Truly grateful.',
      stars: 5,
      verified: true
    },
    {
      name: 'Megha',
      city: 'Jaipur',
      review: 'My husband had been smoking for over 15 years. These drops helped him manage withdrawal anxiety and stop smoking completely. Highly recommended for tobacco addiction!',
      stars: 5,
      verified: true
    }
  ];

  const galleryImages = [
    '/product image -2/nasha mukti.jpeg',
    '/product image -2/eco cleanse.jpeg',
    '/product image -2/horse rider gold .jpeg',
    '/product image -2/aandra.jpeg',
    '/product image -2/slimkaya.jpeg'
  ];

  const steps = [
    { num: '01', title: 'Shake Well', desc: 'Shake the bottle thoroughly before each use to mix herbs.' },
    { num: '02', title: 'Measure Drops', desc: 'Take 20-25 drops in half a cup of water, juice, tea, or mix secretly in food.' },
    { num: '03', title: 'Twice Daily', desc: 'Administer after lunch and dinner for optimum absorption.' },
    { num: '04', title: '2-Month Course', desc: 'Continue regularly for a minimum of 2 months for best recovery results.' }
  ];

  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* 3.2 Hero Section */}
      <section className="relative h-[85vh] min-h-[500px] flex items-center bg-[#1B5E20] overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[carouselIndex].image})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-[#FFF8E1] text-[#2E7D32] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              100% Ayurvedic Formulation
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              {slides[carouselIndex].title}
            </h1>
            <p className="text-lg sm:text-xl text-[#FFF8E1] mb-8 max-w-2xl font-light opacity-90">
              {slides[carouselIndex].subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products/dr-nidan-nasha-mukti-drops-50ml"
                className="px-8 py-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-[var(--radius-md)] hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold shadow-md flex items-center"
              >
                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/919307904425"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-white hover:bg-white hover:text-[#1B5E20] text-white rounded-[var(--radius-md)] hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold"
              >
                WhatsApp Inquiry
              </a>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm py-4 border-t border-white/10 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-around items-center gap-4 text-sm font-semibold tracking-wide text-white/90">
            <span className="flex items-center"><ShieldCheck className="w-5 h-5 text-[#66BB6A] mr-2" /> Result Oriented</span>
            <span className="flex items-center"><Sparkles className="w-5 h-5 text-[#F9A825] mr-2" /> Quality Standard</span>
            <span className="flex items-center"><Leaf className="w-5 h-5 text-[#66BB6A] mr-2" /> 100% Organic</span>
          </div>
        </div>
      </section>

      {/* 3.3 Featured Product Section */}
      <section className="py-24 bg-[#F9FFF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#1B5E20] relative inline-block">
              Dr. Nidan Nasha Mukti Drops
              <span className="absolute left-1/4 right-1/4 -bottom-3 h-1 bg-[#2E7D32] rounded" />
            </h2>
            <p className="text-[#555555] mt-6 max-w-xl mx-auto">
              Our flagship herbal formulation engineered to ease withdrawal symptoms and reduce alcohol and tobacco addiction.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-pulse">
              <div className="bg-gray-200 aspect-[4/5] rounded-[var(--radius-lg)]" />
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-24 bg-gray-200 rounded w-full" />
                <div className="h-12 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 aspect-[4/5] bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-lg border border-gray-100 relative group p-6 flex items-center justify-center"
              >
                <img
                  src={product?.images?.[0]?.url || '/product image -2/nasha mukti.jpeg'}
                  alt={product?.name || 'Nasha Mukti Drops'}
                  className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 right-4 bg-[#F9A825] text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                  Best Seller
                </span>
              </motion.div>

              {/* Product Details */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7 space-y-6"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex text-[#F9A825]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-[#555555] font-semibold">(124 Verified Reviews)</span>
                </div>

                <h3 className="text-3xl font-display font-bold text-[#1A1A1A]">
                  {product?.name || 'Dr. Nidan Nasha Mukti Drops 50 ML'}
                </h3>

                <div className="flex items-baseline space-x-4">
                  <span className="text-3xl font-bold text-[#2E7D32]">₹{product?.price || 799}</span>
                  <span className="text-lg text-gray-400 line-through">₹{product?.mrp || 999}</span>
                  <span className="text-xs text-red-600 bg-red-50 border border-red-100 font-bold px-2.5 py-1 rounded">
                    Save 20%
                  </span>
                </div>

                <p className="text-[#555555] leading-relaxed">
                  {product?.shortDescription || '40+ herb Ayurvedic formulation. No Color, No Flavor, No Taste.'}
                </p>

                {/* Key Benefits */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="font-bold text-[#1A1A1A] text-sm tracking-wide uppercase">Key Benefits:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#555555]">
                    <span className="flex items-center"><CheckCircle className="w-4.5 h-4.5 text-[#2E7D32] mr-2 shrink-0" /> Reduces Cravings</span>
                    <span className="flex items-center"><CheckCircle className="w-4.5 h-4.5 text-[#2E7D32] mr-2 shrink-0" /> Supports Liver Detox</span>
                    <span className="flex items-center"><CheckCircle className="w-4.5 h-4.5 text-[#2E7D32] mr-2 shrink-0" /> Reduces stress & anxiety</span>
                    <span className="flex items-center"><CheckCircle className="w-4.5 h-4.5 text-[#2E7D32] mr-2 shrink-0" /> Supports mood balance</span>
                    <span className="flex items-center"><CheckCircle className="w-4.5 h-4.5 text-[#2E7D32] mr-2 shrink-0" /> Enhances wellbeing</span>
                    <span className="flex items-center"><CheckCircle className="w-4.5 h-4.5 text-[#2E7D32] mr-2 shrink-0" /> Natural & 100% Safe</span>
                  </div>
                </div>

                {/* Ingredients Chips */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="font-bold text-[#1A1A1A] text-sm tracking-wide uppercase">Ingredients Preview:</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Ashwagandha', 'Brahmi', 'Haldi', 'Amla', 'Milk Thistle', 'Sarpgandha', 'Vidarikand (Kudzu)', 'Nagarmotha'].map((ing) => (
                      <span key={ing} className="bg-[#FFF8E1] text-[#F9A825] border border-[#FFF8E1] font-medium text-xs px-3 py-1 rounded-full shadow-2xs">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={() => {
                      addToCart(product || { id: 'flagship', name: 'Dr. Nidan Nasha Mukti Drops 50 ML', slug: 'dr-nidan-nasha-mukti-drops-50ml', price: 799, images: ['/product image -2/nasha mukti.jpeg'] });
                      alert('Added to Cart!');
                    }}
                    className="flex-1 min-w-[200px] py-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold rounded-[var(--radius-md)] shadow-md transition-all hover:scale-[1.01]"
                  >
                    Add to Cart
                  </button>
                  <Link
                    href="/products/dr-nidan-nasha-mukti-drops-50ml"
                    className="flex-1 min-w-[200px] py-4 border-2 border-[#2E7D32] hover:bg-[#F9FFF9] text-[#2E7D32] font-semibold rounded-[var(--radius-md)] text-center transition-all hover:scale-[1.01]"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* 3.4 Key Strengths Section */}
      <section className="py-24 bg-white border-y border-[#2E7D32]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-[#1B5E20]">Why Families Choose Dr. Nidan</h2>
            <p className="text-[#555555] mt-4 max-w-xl mx-auto">
              Our products are crafted with a commitment to pure, effective, and organic Ayurvedic medicine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyStrengths.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-[#F9FFF9] p-8 rounded-[var(--radius-lg)] border border-[#2E7D32]/10 shadow-xs text-center"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 border`}>
                  <item.icon className="w-6 h-6 text-[#2E7D32]" />
                </div>
                <h3 className="font-display font-semibold text-lg text-[#1A1A1A] mb-3">{item.title}</h3>
                <p className="text-[#555555] text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.7 How to Use Section */}
      <section className="py-24 bg-[#F9FFF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-[#1B5E20]">How To Use Nasha Mukti Drops</h2>
            <p className="text-[#555555] mt-4 max-w-xl mx-auto">
              Simple steps for effective administration, designed for smooth and sustainable recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[var(--radius-lg)] border border-gray-100 shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-[#FFF8E1] text-[#F9A825] font-display font-bold text-3xl px-4 py-2 rounded-bl-lg">
                  {step.num}
                </div>
                <h3 className="font-display font-bold text-lg text-[#1A1A1A] mb-4 pr-12">{step.title}</h3>
                <p className="text-[#555555] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-[#FFF8E1] border border-[#F9A825]/20 p-6 rounded-lg max-w-3xl mx-auto text-center">
            <p className="text-sm text-[#F9A825] font-bold">
              💡 Note: Store in a cold place. Safe for all ages 10+. Since it has no color, flavor, or taste, it can easily be administered to the person without their knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* 3.5 Testimonials Carousel */}
      <section className="py-24 bg-[#1B5E20] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold">What Our Customers Say</h2>
            <p className="text-emerald-100 mt-4 max-w-xl mx-auto opacity-95">
              Read the direct stories of recovery and health restoration from people who have used Dr. Nidan drops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-xs p-8 rounded-[var(--radius-lg)] border border-white/10 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex text-[#F9A825]">
                    {[...Array(test.stars)].map((_, idx) => (
                      <Star key={idx} className="w-4.5 h-4.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm italic text-gray-100 leading-relaxed font-light">
                    "{test.review}"
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{test.name}</h4>
                    <span className="text-emerald-200">{test.city}</span>
                  </div>
                  {test.verified && (
                    <span className="bg-[#FFF8E1]/20 text-[#FFF8E1] px-2.5 py-1 rounded font-bold border border-white/10">
                      ✓ Verified User
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.6 Gallery Preview Strip */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-[#1B5E20]">Product Gallery</h2>
              <p className="text-[#555555] mt-2">Authentic packaging and organic processing pictures.</p>
            </div>
            <Link
              href="/gallery"
              className="text-[#2E7D32] hover:text-[#1B5E20] font-semibold text-sm flex items-center"
            >
              View Full Gallery <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="min-w-[260px] w-[260px] h-[320px] bg-[#F9FFF9] rounded-[var(--radius-lg)] overflow-hidden border border-gray-100 shadow-xs shrink-0 flex items-center justify-center p-4"
              >
                <img
                  src={img}
                  alt={`Dr. Nidan product thumbnail ${i + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.8 Newsletter Signup */}
      <section className="py-24 bg-[#FFF8E1] border-t border-[#F9A825]/10">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-display font-bold text-[#1B5E20]">Join Our Wellness Community</h2>
          <p className="text-[#555555] max-w-md mx-auto text-sm leading-relaxed">
            Subscribe to receive Ayurvedic wellness tips, product notifications, and distributor updates.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4">
            <input
              type="email"
              placeholder="Your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-grow px-5 py-4 bg-white border border-gray-200 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A]"
              required
            />
            <button
              type="submit"
              className="px-6 py-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold rounded-[var(--radius-md)] text-sm shadow-sm transition-colors"
            >
              Subscribe
            </button>
          </form>

          {newsletterSuccess && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-[#2E7D32] font-semibold"
            >
              🎉 Success! Thank you for subscribing to our newsletter.
            </motion.p>
          )}
        </div>
      </section>
    </div>
  );
}
