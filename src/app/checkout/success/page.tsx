'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[var(--radius-lg)] shadow-sm border border-[var(--color-outline)]/20 text-center max-w-md"
      >
        <div className="w-20 h-20 bg-green-50 text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-display font-bold text-[var(--color-primary)] mb-4">Payment Successful</h1>
        <p className="text-[var(--color-on-surface)] opacity-80 mb-8">
          Thank you for your purchase. Your order has been placed and is being processed. We'll send you an email confirmation shortly.
        </p>
        <Link 
          href="/products" 
          className="inline-block w-full py-4 bg-[var(--color-primary)] text-white font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-container)] transition-colors"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
}
