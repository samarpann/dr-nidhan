'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu, X, User as UserIcon, LogOut, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Our Products', href: '/products' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Sales Network', href: '/sales-network' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-4 border-b border-gray-100'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img src="/logo.jpeg" alt="Dr. Nidan Logo" className="h-12 w-auto object-contain rounded-md mix-blend-multiply" />
            <span className="font-display text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Dr. <span className="text-[#2E7D32]">Nidan</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative font-medium text-sm transition-colors duration-200 ${
                    isActive ? 'text-[#2E7D32]' : 'text-[#555555] hover:text-[#2E7D32]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeUnderline"
                      className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#2E7D32]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="p-2.5 rounded-full hover:bg-[#F9FFF9] text-[#1A1A1A] hover:text-[#2E7D32] transition-colors relative"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2E7D32] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Avatar / Login Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="p-2.5 rounded-full hover:bg-[#F9FFF9] text-[#1A1A1A] hover:text-[#2E7D32] transition-colors flex items-center space-x-1"
                  title={user.role === 'admin' ? 'Admin Panel' : 'User Dashboard'}
                >
                  <UserIcon className="w-5 h-5" />
                  {user.role === 'admin' && (
                    <span className="text-xs bg-[#FFF8E1] text-[#F9A825] px-1.5 py-0.5 rounded font-bold border border-[#F9A825]/20">
                      Admin
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-full hover:bg-red-50 text-[#1A1A1A] hover:text-red-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-[var(--radius-md)] text-sm font-semibold shadow-sm transition-all hover:scale-[1.02]"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-[#1A1A1A] hover:text-[#2E7D32] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[#F9FFF9] text-[#2E7D32] font-semibold'
                        : 'text-[#555555] hover:bg-gray-50 hover:text-[#2E7D32]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-4 py-3 bg-[#2E7D32] text-white rounded-[var(--radius-md)] text-base font-semibold shadow-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
