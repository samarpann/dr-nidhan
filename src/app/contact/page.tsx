'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageSquare, PhoneCall, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#F9FFF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1 rounded-full">
            Contact Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#1B5E20] mt-3 mb-6">Get in Touch</h1>
          <p className="text-base text-[#555555] max-w-2xl mx-auto leading-relaxed">
            Have questions about Dr. Nidan Nasha Mukti Drops? Need support with your order? Our Ayurvedic consultants are here to guide you.
          </p>
        </div>

        {/* Quick Contact Actions Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <a
            href="tel:+919307904425"
            className="flex items-center justify-center space-x-3 p-5 bg-white border border-[#2E7D32]/10 hover:border-[#2E7D32]/40 rounded-xl shadow-xs hover:shadow-sm transition-all text-[#2E7D32] font-semibold"
          >
            <PhoneCall className="w-5 h-5" />
            <span>Call Now</span>
          </a>
          <a
            href="https://wa.me/919307904425"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-3 p-5 bg-white border border-[#2E7D32]/10 hover:border-[#2E7D32]/40 rounded-xl shadow-xs hover:shadow-sm transition-all text-[#2E7D32] font-semibold"
          >
            <MessageSquare className="w-5 h-5 text-[#25D366]" />
            <span>WhatsApp Us</span>
          </a>
          <a
            href="mailto:MD@drnidan.in"
            className="flex items-center justify-center space-x-3 p-5 bg-white border border-[#2E7D32]/10 hover:border-[#2E7D32]/40 rounded-xl shadow-xs hover:shadow-sm transition-all text-[#2E7D32] font-semibold"
          >
            <Mail className="w-5 h-5" />
            <span>Email Support</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Contact Details & Map (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-white p-8 rounded-2xl border border-[#2E7D32]/10 shadow-xs space-y-6">
              <h2 className="text-2xl font-display font-bold text-[#1B5E20]">Our Office</h2>
              
              <div className="space-y-5 text-sm text-[#555555]">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-[#2E7D32] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-1">Corporate Address</h3>
                    <p className="leading-relaxed">Office #1222, Twin Building, Plegona, Dhabade, Pune (M.S.) – 410506</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-[#2E7D32] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-1">Phone Numbers</h3>
                    <p className="leading-relaxed">+91 93079 04425</p>
                    <p className="leading-relaxed text-xs text-gray-400 font-medium">+91 7058105880</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-[#2E7D32] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-1">Email</h3>
                    <div className="flex flex-col space-y-1">
                      <a href="mailto:MD@drnidan.in" className="text-[#2E7D32] hover:underline font-semibold">MD@drnidan.in</a>
                      <a href="mailto:HR@drnidan.in" className="text-[#2E7D32] hover:underline font-semibold">HR@drnidan.in</a>
                      <a href="mailto:Logistics@drnidan.in" className="text-[#2E7D32] hover:underline font-semibold">Logistics@drnidan.in</a>
                      <a href="mailto:Sales@drnidan.in" className="text-[#2E7D32] hover:underline font-semibold">Sales@drnidan.in</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Centered on Dhabade, Pune */}
            <div className="aspect-video bg-white rounded-2xl overflow-hidden border border-[#2E7D32]/10 shadow-xs relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15124.960000000001!2d73.62635955000001!3d18.720541!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b07e5c6bbccb%3A0xea8080f585d852a!2sTalegaon%20Dabhade%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1716900000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Dr. Nidan Location Map"
              ></iframe>
            </div>
          </motion.div>

          {/* Contact Form (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-2xl border border-[#2E7D32]/10 shadow-xs"
          >
            <h2 className="text-2xl font-display font-bold text-[#1B5E20] mb-8">Send Us a Message</h2>
            
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 text-[#2E7D32] font-semibold rounded-lg border border-[#2E7D32]/20 text-sm">
                🎉 Thank you for contacting us! Your message has been sent successfully. We will get back to you shortly.
              </div>
            )}
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 font-semibold rounded-lg border border-red-200 text-sm">
                ❌ Failed to send your message. Please verify your details or email us directly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A]"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A]"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A]"
                    placeholder="e.g. +91 93079 04425"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Subject</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A]"
                    placeholder="Inquiry about..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Message *</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A] resize-none"
                  placeholder="Tell us what you would like to know..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full py-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold rounded-lg text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 flex items-center justify-center space-x-2"
              >
                {status === 'submitting' ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4.5 h-4.5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
