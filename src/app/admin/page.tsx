'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, FileText, MessageSquare, Star, Users, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    posts: 0,
    messages: 0,
    clients: 0,
    orders: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          productsRes,
          postsRes,
          messagesRes,
          usersRes,
          ordersRes
        ] = await Promise.all([
          fetch('/api/products?admin=true'),
          fetch('/api/blog?admin=true'),
          fetch('/api/contact'),
          fetch('/api/users'),
          fetch('/api/orders?admin=true')
        ]);

        const [products, posts, messages, users, orders] = await Promise.all([
          productsRes.json(),
          postsRes.json(),
          messagesRes.json(),
          usersRes.json(),
          ordersRes.json()
        ]);

        const totalRevenue = (orders || [])
          .filter((o: any) => o.paymentStatus === 'paid')
          .reduce((sum: number, o: any) => sum + o.total, 0);

        setStats({
          products: products?.length || 0,
          posts: posts?.length || 0,
          messages: messages?.length || 0,
          clients: (users || []).filter((u: any) => u.role === 'user').length || 0,
          orders: orders?.length || 0,
          revenue: totalRevenue
        });

        setRecentOrders((orders || []).slice(0, 5));
        setRecentClients((users || []).filter((u: any) => u.role === 'user').slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard overview data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-[#2E7D32] animate-spin" />
      </div>
    );
  }

  const statCards = [
    { name: 'Total Revenue', value: `₹${stats.revenue.toFixed(0)}`, icon: ShoppingBag, color: 'bg-emerald-50 text-emerald-700 border-emerald-100', href: '/admin/orders' },
    { name: 'Store Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-green-50 text-green-700 border-green-100', href: '/admin/orders' },
    { name: 'Products Catalog', value: stats.products, icon: Package, color: 'bg-amber-50 text-amber-700 border-amber-100', href: '/admin/products' },
    { name: 'Registered Clients', value: stats.clients, icon: Users, color: 'bg-blue-50 text-blue-700 border-blue-100', href: '/admin/users' },
    { name: 'Patient Messages', value: stats.messages, icon: MessageSquare, color: 'bg-purple-50 text-purple-700 border-purple-100', href: '/admin/messages' },
  ];

  return (
    <div className="space-y-10 text-[#1A1A1A]">
      <div>
        <h1 className="text-3xl font-display font-bold text-[#1B5E20]">Dashboard Overview</h1>
        <p className="text-xs text-[#555555]">Real-time statistics and administrative insights.</p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card, idx) => (
          <Link key={idx} href={card.href}>
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-2xs hover:shadow-xs transition-all flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color} shrink-0`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{card.name}</p>
                <p className="text-xl font-bold mt-0.5">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Tables Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Recent Orders Table (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-150 shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="font-display font-bold text-lg text-[#1B5E20]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-[#2E7D32] hover:underline flex items-center font-bold">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-500 uppercase tracking-wider font-bold">
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Method</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-bold text-[#1B5E20] max-w-[80px] truncate" title={o._id}>
                      #{o._id.substring(o._id.length - 8)}
                    </td>
                    <td className="py-3 text-gray-500 font-medium capitalize">{o.paymentMethod}</td>
                    <td className="py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        o.paymentStatus === 'paid' ? 'bg-green-50 text-[#2E7D32]' : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-[#2E7D32]">₹{o.total.toFixed(0)}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400 italic">No orders received.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Registered Clients (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-150 shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="font-display font-bold text-lg text-[#1B5E20]">New Clients</h2>
            <Link href="/admin/users" className="text-xs text-[#2E7D32] hover:underline flex items-center font-bold">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
            {recentClients.map((u) => (
              <div key={u._id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#2E7D32] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs line-clamp-1">{u.name}</h4>
                    <span className="text-[10px] text-gray-400 font-semibold">{u.email}</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                  {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
            {recentClients.length === 0 && (
              <div className="py-6 text-center text-gray-400 italic text-xs">No users registered yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
