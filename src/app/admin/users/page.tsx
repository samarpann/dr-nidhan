'use client';
import { useEffect, useState } from 'react';
import { Users, Mail, Phone, MapPin, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type UserProfile = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  createdAt: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error('Failed to fetch clients', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const clientsOnly = users.filter((u) => u.role === 'user');

  return (
    <div className="text-[#1A1A1A]">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#1B5E20]">Registered Clients</h1>
        <p className="text-xs text-[#555555]">
          View customer directory details including addresses and registration histories.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#2E7D32]/10 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#F9FFF9] border-b border-[#2E7D32]/10 text-gray-500 uppercase tracking-wider text-xs">
              <th className="px-6 py-4 font-bold">Client Name</th>
              <th className="px-6 py-4 font-bold">Email</th>
              <th className="px-6 py-4 font-bold">Phone</th>
              <th className="px-6 py-4 font-bold">Address Info</th>
              <th className="px-6 py-4 font-bold">Date Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="w-5 h-5 text-[#2E7D32] animate-spin" />
                    <span>Loading customers...</span>
                  </div>
                </td>
              </tr>
            ) : clientsOnly.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  No customers registered in database yet.
                </td>
              </tr>
            ) : (
              clientsOnly.map((u, i) => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#2E7D32] flex items-center justify-center font-bold text-sm uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-bold text-[#1A1A1A]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a href={`mailto:${u.email}`} className="text-gray-600 hover:text-[#2E7D32] hover:underline font-semibold flex items-center">
                      <Mail className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                      <span>{u.email}</span>
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {u.phone ? (
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                        {u.phone}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs">
                    {u.address && (u.address.street || u.address.city) ? (
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-1.5 text-[#2E7D32] shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">
                          {[u.address.street, u.address.city, u.address.state, u.address.pincode].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No address saved</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-medium">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                      <span>{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
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
