'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const shippingCharge = 0; // Free shipping
  const grandTotal = cartTotal + shippingCharge;

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] flex flex-col items-center justify-center bg-[#F9FFF9] px-4 text-center">
        <div className="w-20 h-20 bg-white border border-[#2E7D32]/10 rounded-full flex items-center justify-center mb-6 text-[#2E7D32]/60 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-display font-bold text-[#1B5E20] mb-4">Your Cart is Empty</h1>
        <p className="text-[#555555] max-w-sm mb-8">
          It looks like you haven't added any products to your cart yet. Check out our authentic Ayurvedic formulations.
        </p>
        <Link
          href="/products"
          className="px-8 py-3.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-[var(--radius-md)] font-semibold shadow-sm transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-[#F9FFF9] min-h-screen text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#1B5E20] mb-12">Shopping Cart ({cartCount})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border border-[#2E7D32]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center space-x-6 w-full sm:w-auto">
                  <div className="w-20 h-20 bg-[#F9FFF9] rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center p-2 shrink-0">
                    <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#1A1A1A] hover:text-[#2E7D32] transition-colors">
                      <Link href={`/products/${item.slug}`}>{item.name}</Link>
                    </h3>
                    <p className="text-xs text-[#2E7D32] font-semibold mt-1">₹{item.price.toFixed(2)} each</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-50 text-gray-500 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50 text-gray-500 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal & Delete */}
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-[#2E7D32] text-base">₹{(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-all"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            <Link href="/products" className="inline-flex items-center text-sm text-[#2E7D32] hover:text-[#1B5E20] font-semibold transition-colors mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
            </Link>
          </div>

          {/* Cart Summary Card */}
          <div className="lg:col-span-4 bg-white p-8 rounded-2xl border border-[#2E7D32]/10 shadow-xs space-y-6">
            <h2 className="text-xl font-display font-bold text-[#1B5E20] border-b border-gray-100 pb-4">Order Summary</h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-[#555555]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1A1A1A]">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#555555]">
                <span>Shipping Charge</span>
                <span className="text-[#2E7D32] font-semibold">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between text-base font-bold text-[#1B5E20]">
                <span>Total Amount</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full py-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-center font-semibold rounded-lg shadow-sm transition-all hover:scale-[1.01] flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
