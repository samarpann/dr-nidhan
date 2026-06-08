'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingBag, User as UserIcon, Lock, Compass, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'password'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Profile forms
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
      });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileForm.name,
          phone: profileForm.phone,
          address: {
            street: profileForm.street,
            city: profileForm.city,
            state: profileForm.state,
            pincode: profileForm.pincode,
          }
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Profile details updated successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to update profile details' });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }
    setSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FFF9]">
        <Loader2 className="w-10 h-10 text-[#2E7D32] animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-[#F9FFF9] min-h-screen text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="bg-[#1B5E20] text-white p-8 sm:p-12 rounded-3xl mb-12 shadow-sm relative overflow-hidden border border-[#2E7D32]/10">
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-display font-bold">Welcome, {user.name || 'User'}!</h1>
            <p className="text-emerald-100 font-light text-sm sm:text-base">
              Manage your orders, update your address, and configure your security settings from here.
            </p>
          </div>
          <div className="absolute top-0 right-0 text-emerald-600/10 font-display font-bold text-9xl select-none translate-x-10 translate-y-5">
            Ayur
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-200 mb-10 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => { setActiveTab('orders'); setStatusMessage(null); }}
            className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 flex items-center space-x-2 ${
              activeTab === 'orders' ? 'border-[#2E7D32] text-[#2E7D32]' : 'border-transparent text-gray-500 hover:text-[#2E7D32]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('profile'); setStatusMessage(null); }}
            className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 flex items-center space-x-2 ${
              activeTab === 'profile' ? 'border-[#2E7D32] text-[#2E7D32]' : 'border-transparent text-gray-500 hover:text-[#2E7D32]'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Edit Profile & Address</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('password'); setStatusMessage(null); }}
            className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 flex items-center space-x-2 ${
              activeTab === 'password' ? 'border-[#2E7D32] text-[#2E7D32]' : 'border-transparent text-gray-500 hover:text-[#2E7D32]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div className={`mb-8 p-4 rounded-xl text-sm font-semibold border ${
            statusMessage.type === 'success' 
              ? 'bg-green-50 text-[#2E7D32] border-[#2E7D32]/25' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {statusMessage.text}
          </div>
        )}

        {/* Tab Content Panels */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#2E7D32]/10 shadow-xs">
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="text-xl font-display font-bold text-[#1B5E20] mb-4">Your Purchase History</h3>
              
              {ordersLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#2E7D32] animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500 space-y-4">
                  <p>You haven't placed any orders yet.</p>
                  <Link href="/products" className="inline-block text-xs font-bold uppercase tracking-wider text-[#2E7D32] border border-[#2E7D32]/30 px-4 py-2.5 rounded-lg hover:bg-[#F9FFF9]">
                    Shop Collection
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-[#555555]">
                        <th className="py-4 font-bold">Order ID</th>
                        <th className="py-4 font-bold">Date</th>
                        <th className="py-4 font-bold">Payment</th>
                        <th className="py-4 font-bold">Status</th>
                        <th className="py-4 font-bold text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50/50">
                          <td className="py-4 font-bold text-[#1B5E20] max-w-[120px] truncate" title={order._id}>
                            #{order._id.substring(order._id.length - 8)}
                          </td>
                          <td className="py-4 text-[#555555]">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              order.paymentStatus === 'paid' ? 'bg-green-50 text-[#2E7D32]' : 'bg-yellow-50 text-yellow-700'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className="font-semibold text-gray-700 uppercase text-xs">{order.orderStatus}</span>
                          </td>
                          <td className="py-4 text-right font-bold text-[#2E7D32]">
                            ₹{order.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-3xl">
              <h3 className="text-xl font-display font-bold text-[#1B5E20] mb-4">Personal & Address Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#555555] mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#555555] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A]"
                    placeholder="+91 99999 99999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#555555] mb-2">Street Address</label>
                <input
                  type="text"
                  value={profileForm.street}
                  onChange={(e) => setProfileForm({...profileForm, street: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A]"
                  placeholder="Flat, building, street..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#555555] mb-2">City</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A]"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#555555] mb-2">State</label>
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({...profileForm, state: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A]"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#555555] mb-2">Pincode</label>
                  <input
                    type="text"
                    value={profileForm.pincode}
                    onChange={(e) => setProfileForm({...profileForm, pincode: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A]"
                    placeholder="PIN Code"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold rounded-lg text-sm shadow-sm transition-all disabled:opacity-70 flex items-center space-x-2"
              >
                {submitting ? <span>Saving Changes...</span> : <span>Save Details</span>}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-xl">
              <h3 className="text-xl font-display font-bold text-[#1B5E20] mb-4">Security Settings</h3>
              
              <div>
                <label className="block text-xs font-bold uppercase text-[#555555] mb-2">Old Password *</label>
                <input
                  type="password"
                  required
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#555555] mb-2">New Password *</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#555555] mb-2">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] text-[#1A1A1A]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold rounded-lg text-sm shadow-sm transition-all disabled:opacity-70 flex items-center space-x-2"
              >
                {submitting ? <span>Changing Password...</span> : <span>Update Password</span>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
