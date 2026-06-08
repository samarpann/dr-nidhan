'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Plus, Send, ChevronLeft, ChevronRight, User } from 'lucide-react';

type Testimonial = {
  _id: string;
  name: string;
  city: string;
  review: string;
  rating: number;
  photo?: string;
  isApproved: boolean;
  isFeatured: boolean;
};

const preseededReviews: Testimonial[] = [
  {
    _id: '1',
    name: 'Sumit Singh',
    city: 'Delhi',
    review: 'Dr. Nidan Nasha Mukti Drops have been a miracle. My alcohol cravings reduced significantly within just a few weeks of taking them secretly with dinner. No side effects at all!',
    rating: 5,
    isApproved: true,
    isFeatured: true
  },
  {
    _id: '2',
    name: 'Rajesh Kumar',
    city: 'Lucknow',
    review: '100% natural and highly effective. We mixed these colorless drops in my brother’s tea without him knowing. His alcohol intake has gone down to zero in 2 months. Truly grateful.',
    rating: 5,
    isApproved: true,
    isFeatured: true
  },
  {
    _id: '3',
    name: 'Megha',
    city: 'Jaipur',
    review: 'My husband had been smoking for over 15 years. These drops helped him manage withdrawal anxiety and stop smoking completely. Highly recommended for tobacco addiction!',
    rating: 5,
    isApproved: true,
    isFeatured: true
  }
];

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState<Testimonial[]>(preseededReviews);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    city: '',
    rating: 5,
    review: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/testimonials?approved=true');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setReviews(data);
          }
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const featuredReviews = reviews.filter((r) => r.isFeatured);

  // Auto-play featured carousel
  useEffect(() => {
    if (featuredReviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredReviews]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });
      if (res.ok) {
        setFormStatus('success');
        setFormState({ name: '', city: '', rating: 5, review: '' });
        setTimeout(() => {
          setShowForm(false);
          setFormStatus('idle');
        }, 3000);
      } else {
        setFormStatus('error');
      }
    } catch (err) {
      console.error('Testimonial submit error:', err);
      setFormStatus('error');
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#F9FFF9] min-h-screen text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 relative">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1 rounded-full">
            Patient Feedback
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#1B5E20] mt-3 mb-4 flex items-center justify-center space-x-2">
            <span>What Our Customers Say</span>
          </h1>
          <div className="flex justify-center text-[#F9A825] mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <p className="text-base text-[#555555] max-w-xl mx-auto leading-relaxed">
            Real stories of recovery and rehabilitation from families who have successfully used Dr. Nidan drops.
          </p>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-8 px-6 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center justify-center space-x-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Share Your Story</span>
          </button>
        </div>

        {/* Story Form Modal / Section */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-xl mx-auto mb-16 bg-white p-8 rounded-2xl border border-[#2E7D32]/10 shadow-sm overflow-hidden"
            >
              <h3 className="text-xl font-display font-bold text-[#1B5E20] mb-6">Submit Your Review</h3>
              
              {formStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 text-[#2E7D32] font-semibold rounded-lg border border-[#2E7D32]/20 text-sm">
                  🎉 Thank you for sharing! Your review has been submitted and will show up once approved by the administrator.
                </div>
              )}
              {formStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 font-semibold rounded-lg border border-red-200 text-sm">
                  ❌ Submission failed. Please fill out all fields correctly.
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#555555] mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                      placeholder="e.g. Sumit Singh"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#555555] mb-2">City / Location *</label>
                    <input
                      type="text"
                      required
                      value={formState.city}
                      onChange={(e) => setFormState({...formState, city: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                      placeholder="e.g. Delhi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#555555] mb-2">Rating *</label>
                  <select
                    value={formState.rating}
                    onChange={(e) => setFormState({...formState, rating: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] bg-white"
                  >
                    {[5, 4, 3, 2, 1].map((val) => (
                      <option key={val} value={val}>{val} Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#555555] mb-2">Your Review *</label>
                  <textarea
                    required
                    rows={4}
                    value={formState.review}
                    onChange={(e) => setFormState({...formState, review: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] resize-none"
                    placeholder="Describe your or your relative's experience with Dr. Nidan drops..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold rounded-lg text-sm shadow-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{formStatus === 'submitting' ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Testimonials Auto-Carousel */}
        {featuredReviews.length > 0 && (
          <div className="mb-24 bg-[#1B5E20] text-white p-8 sm:p-16 rounded-3xl relative overflow-hidden border border-[#2E7D32]/20">
            <div className="absolute top-6 left-6 text-emerald-300/20 font-display font-bold text-7xl select-none">
              “
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto text-center space-y-6"
              >
                <div className="flex justify-center text-[#F9A825]">
                  {[...Array(featuredReviews[activeSlide].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-current" />
                  ))}
                </div>
                
                <p className="text-xl sm:text-2xl font-light italic leading-relaxed">
                  "{featuredReviews[activeSlide].review}"
                </p>

                <div>
                  <h4 className="font-bold text-lg text-[#FFF8E1]">{featuredReviews[activeSlide].name}</h4>
                  <span className="text-sm text-emerald-200">{featuredReviews[activeSlide].city}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider controls */}
            {featuredReviews.length > 1 && (
              <div className="flex justify-center space-x-4 mt-8 pt-4 border-t border-white/10">
                <button
                  onClick={() => setActiveSlide((prev) => (prev === 0 ? featuredReviews.length - 1 : prev - 1))}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveSlide((prev) => (prev + 1) % featuredReviews.length)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Full Grid of Testimonial Cards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#1B5E20] border-b border-gray-100 pb-4">
            Recent Patient Reviews
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((rev) => (
                <motion.div
                  key={rev._id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl border border-[#2E7D32]/10 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex text-[#F9A825]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold uppercase bg-emerald-50 text-[#2E7D32] px-2 py-0.5 rounded">
                        Verified
                      </span>
                    </div>

                    <p className="text-[#555555] text-sm italic leading-relaxed">
                      "{rev.review}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-gray-50">
                    <div className="w-10 h-10 rounded-full bg-[#F9FFF9] border border-[#2E7D32]/15 flex items-center justify-center text-[#2E7D32] font-bold uppercase">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1A1A1A]">{rev.name}</h4>
                      <span className="text-xs text-gray-400">{rev.city}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
