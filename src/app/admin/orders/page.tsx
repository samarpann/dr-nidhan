'use client';
import { useEffect, useState } from 'react';
import { ShoppingBag, Eye } from 'lucide-react';

type Order = {
  id: string;
  order_id: string;
  payment_id: string;
  amount: number;
  items: string[];
  status: string;
  created_at: string;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders?admin=true');
        const data = await res.json();
        setOrders(data.map((o: any) => ({
          ...o,
          id: o._id,
          created_at: o.createdAt
        })));
      } catch (error) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--color-primary)]">Customer Orders</h1>
      </div>
      
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-outline)]/20 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface)] border-b border-[var(--color-outline)]/20 text-[var(--color-on-surface)] text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Order ID</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-outline)]/10">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--color-on-surface)] opacity-50">Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--color-on-surface)] opacity-50">No orders placed yet.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-[var(--color-surface)]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--color-on-surface)]">
                    <div className="flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-2 text-[var(--color-secondary)]" />
                      {o.order_id || o.id.substring(o.id.length - 8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-on-surface)] opacity-80">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-[var(--color-on-surface)] opacity-80">₹{o.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${o.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 p-2" title="View Order Details"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
