'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Building, Briefcase, Award, TrendingUp, Send } from 'lucide-react';

type Dealer = {
  _id: string;
  state: string;
  city: string;
  dealerName: string;
  phone: string;
  address: string;
};

const fallbackDealers: Dealer[] = [
  {
    _id: '1',
    state: 'Maharashtra',
    city: 'Pune',
    dealerName: 'Dr. Nidan Main Office / Distributor',
    phone: '+91 93079 04425',
    address: 'Office #1222, Twin Building, Plegona, Dhabade, Pune (M.S.) – 410506'
  },
  {
    _id: '2',
    state: 'Maharashtra',
    city: 'Mumbai',
    dealerName: 'Sahyadri Organic Distributors',
    phone: '+91 7058105880',
    address: 'Gala No. 4, Ground Floor, Laxmi Nivas, Andheri East, Mumbai – 400069'
  },
  {
    _id: '3',
    state: 'Delhi',
    city: 'New Delhi',
    dealerName: 'Capital Ayurvedic Agency',
    phone: '+91 93079 04425',
    address: 'Shop No. 12, Block C, Lajpat Nagar-II, New Delhi – 110024'
  },
  {
    _id: '4',
    state: 'Uttar Pradesh',
    city: 'Lucknow',
    dealerName: 'Awadh Herbal Store',
    phone: '+91 93079 04425',
    address: 'B-34, Aliganj Main Road, Near Hanuman Temple, Lucknow – 226024'
  }
];

export default function SalesNetworkPage() {
  const [dealers, setDealers] = useState<Dealer[]>(fallbackDealers);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const res = await fetch('/api/sales-network');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setDealers(data);
          }
        }
      } catch (err) {
        console.error('Error fetching sales network dealers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDealers();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          subject: `Distributor Inquiry for ${formState.location}`,
          message: formState.message,
          type: 'distributor_inquiry'
        })
      });

      if (res.ok) {
        setStatus('success');
        setFormState({ name: '', email: '', phone: '', location: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Distributor inquiry submit error:', err);
      setStatus('error');
    }
  };

  // Group dealers by state
  const dealersByState = dealers.reduce((acc: { [key: string]: Dealer[] }, dealer) => {
    if (!acc[dealer.state]) {
      acc[dealer.state] = [];
    }
    acc[dealer.state].push(dealer);
    return acc;
  }, {});

  return (
    <div className="pt-28 pb-24 bg-[#F9FFF9] min-h-screen text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1 rounded-full">
            Distribution Reach
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#1B5E20] mt-3 mb-6">Our Sales Network</h1>
          <p className="text-base text-[#555555] max-w-2xl mx-auto leading-relaxed">
            Find an authorized Dr. Nidan distributor near you, or learn about joining our expanding wholesale retail network across India.
          </p>
        </div>

        {/* State-Wise Dealers Grid */}
        <div className="space-y-12 mb-24">
          <h2 className="text-2xl font-display font-bold text-[#1B5E20] border-b border-gray-100 pb-4">
            State-wise Distributors
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-2xl" />
              <div className="h-40 bg-gray-200 rounded-2xl" />
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(dealersByState).map(([state, stateDealers]) => (
                <div key={state} className="space-y-6">
                  <h3 className="text-lg font-bold text-[#2E7D32] bg-[#F9FFF9] border-l-4 border-[#2E7D32] pl-3 py-1 uppercase tracking-wider">
                    {state}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stateDealers.map((dealer) => (
                      <motion.div
                        key={dealer._id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-6 rounded-2xl border border-[#2E7D32]/10 shadow-xs hover:shadow-sm transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase bg-emerald-50 text-[#2E7D32] px-2 py-0.5 rounded">
                              {dealer.city}
                            </span>
                            <h4 className="font-display font-bold text-base mt-2">{dealer.dealerName}</h4>
                          </div>
                          <Building className="w-5 h-5 text-gray-400" />
                        </div>
                        
                        <p className="text-xs text-[#555555] mb-4 flex items-start">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2 shrink-0 mt-0.5" />
                          <span>{dealer.address}</span>
                        </p>
                        
                        <p className="text-xs font-bold text-[#2E7D32] flex items-center">
                          <Phone className="w-4 h-4 text-[#2E7D32] mr-2" />
                          <span>{dealer.phone}</span>
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Become a Partner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-t border-[#2E7D32]/10 pt-24">
          
          {/* Partner Benefits (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl font-display font-bold text-[#1B5E20]">Become Dr. Nidan Distributor</h2>
            <p className="text-[#555555] leading-relaxed text-sm">
              We are actively looking for distributors and retail partners in North and West India to make our authentic de-addiction drops widely available. Join a verified organic brand.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#FFF8E1] text-[#F9A825] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] text-sm">Exclusive Territory Rights</h3>
                  <p className="text-xs text-[#555555] mt-1">Get exclusive rights to represent Dr. Nidan in designated pin codes or whole cities.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#2E7D32] flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] text-sm">Comprehensive Marketing Support</h3>
                  <p className="text-xs text-[#555555] mt-1">Access product banners, pamphlets, display boards, and online lead redirects.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] text-sm">Attractive Margins & ROI</h3>
                  <p className="text-xs text-[#555555] mt-1">We offer high distributor margins and quick product rotations to ensure fast profitability.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-2xl border border-[#2E7D32]/10 shadow-xs">
            <h3 className="text-2xl font-display font-bold text-[#1B5E20] mb-8">Distributor Inquiry Form</h3>

            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 text-[#2E7D32] font-semibold rounded-lg border border-[#2E7D32]/20 text-sm">
                🎉 Your inquiry has been sent! Our team will contact you within 24-48 business hours with wholesale pricing.
              </div>
            )}
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 font-semibold rounded-lg border border-red-200 text-sm">
                ❌ Submission failed. Please review your entries or contact us at +91 93079 04425 directly.
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({...formState, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Target City / State *</label>
                  <input
                    type="text"
                    required
                    value={formState.location}
                    onChange={(e) => setFormState({...formState, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    placeholder="e.g. Nagpur, Maharashtra"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Brief Cover Note / Inquiry Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] resize-none"
                  placeholder="Detail your business profile or shop location..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold rounded-lg text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 flex items-center justify-center space-x-2"
              >
                {status === 'submitting' ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4.5 h-4.5" />
                    <span>Submit Partner Application</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
