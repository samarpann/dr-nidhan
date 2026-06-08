'use client';
import { MessageCircle } from 'lucide-react';

export function WhatsAppBtn() {
  return (
    <a
      href="https://wa.me/919307904425"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 animate-pulse" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-out text-sm font-semibold whitespace-nowrap">
        WhatsApp Us
      </span>
    </a>
  );
}
