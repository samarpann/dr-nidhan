'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { 
  LayoutDashboard, Package, FileText, MessageSquare, LogOut, 
  ShoppingBag, Users, Layers, Menu, X, Leaf 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.push('/login?redirect=/admin');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FFF9] text-[#2E7D32] font-semibold text-lg">
        Checking Authorization...
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
  };

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
    { name: 'Carousel Slides', href: '/admin/carousel', icon: Layers },
    { name: 'Registered Clients', href: '/admin/users', icon: Users },
    { name: 'Contact Messages', href: '/admin/messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#F9FFF9] flex flex-col md:flex-row pt-20">
      
      {/* Mobile Header Bar */}
      <header className="md:hidden bg-[#1B5E20] text-white p-4 flex justify-between items-center z-40 fixed top-20 left-0 right-0 border-b border-white/10 shadow-xs">
        <div className="flex items-center space-x-3">
          <img src="/logo.jpeg" alt="Logo" className="w-7 h-7 object-contain rounded-md bg-white p-0.5" />
          <span className="font-display font-bold text-sm">Dr. Nidan Admin</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 focus:outline-none">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-[#1B5E20] text-white flex flex-col shrink-0 border-r border-[#2E7D32]/20 shadow-xs hidden md:flex min-h-[calc(100vh-80px)]">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpeg" alt="Logo" className="w-10 h-10 object-contain rounded-md bg-white p-1" />
            <h2 className="font-display text-lg font-bold tracking-tight text-white">Dr. Nidan Admin</h2>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
                  isActive 
                    ? 'bg-[#66BB6A] text-[#1B5E20] shadow-sm' 
                    : 'text-emerald-100 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#1B5E20]' : 'text-emerald-300'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-200 hover:bg-white/5 hover:text-red-400 rounded-xl transition-all text-sm font-semibold"
          >
            <LogOut className="w-5 h-5 mr-3 text-red-300" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-y-0 left-0 w-64 bg-[#1B5E20] text-white z-50 p-6 flex flex-col md:hidden pt-28 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="font-display font-bold text-lg">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-emerald-300" />
              </button>
            </div>
            
            <nav className="flex-grow space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3.5 rounded-xl transition-all text-sm font-semibold ${
                      isActive 
                        ? 'bg-[#66BB6A] text-[#1B5E20] shadow-sm' 
                        : 'text-emerald-100 hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="flex items-center w-full px-4 py-3.5 text-red-200 hover:bg-white/5 hover:text-red-400 rounded-xl transition-all text-sm font-semibold mt-auto"
            >
              <LogOut className="w-5 h-5 mr-3 shrink-0" />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
}
