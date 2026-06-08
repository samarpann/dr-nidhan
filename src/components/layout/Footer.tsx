'use client';
import Link from 'next/link';
import { Leaf, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1B5E20] text-white py-16 border-t border-[#2E7D32]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Logo & Tagline */}
          <div className="col-span-1 md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/logo.jpeg" alt="Dr. Nidan Logo" className="h-10 w-auto object-contain rounded-md bg-white p-1" />
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                Dr. <span className="text-[#66BB6A]">Nidan</span>
              </span>
            </Link>
            <p className="text-[#FFF8E1] text-sm italic font-semibold">
              "The Qualified Organic Product"
            </p>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              We specialize in addiction recovery and herbal wellness products. Our flagship Nasha Mukti Drops have helped thousands lead healthier lives.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://wa.me/919307904425" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#2E7D32] hover:bg-[#66BB6A] rounded-full text-white transition-colors" title="WhatsApp">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-[#2E7D32] hover:bg-[#66BB6A] rounded-full text-white transition-colors" title="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a href="#" className="p-2 bg-[#2E7D32] hover:bg-[#66BB6A] rounded-full text-white transition-colors" title="Instagram">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="font-display font-semibold mb-6 text-lg text-[#FFF8E1]">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Our Products</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/sales-network" className="hover:text-white transition-colors">Sales Network</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog & News</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-1 md:col-span-5 space-y-4">
            <h3 className="font-display font-semibold text-lg text-[#FFF8E1]">Contact Information</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#66BB6A] shrink-0 mt-0.5" />
                <span>Office #1222, Twin Building, Plegona, Dhabade, Pune (M.S.) – 410506</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#66BB6A] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span>+91 93079 04425</span>
                  <span>+91 7058105880 | +91 7058405811</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#66BB6A] shrink-0" />
                <a href="mailto:info@drnidan.com" className="hover:text-white transition-colors">info@drnidan.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-[#2E7D32]/30 mt-12 pt-8 text-center text-xs text-gray-400 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Dr. Nidan. All Rights Reserved. (v0 Build Prompt | June 2026)</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-[#FFF8E1] font-semibold">100% Organic | Result Oriented | Quality Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
