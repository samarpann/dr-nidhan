'use client';
import { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, Trash2, CheckSquare, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  type: 'general' | 'distributor_inquiry';
  isRead: boolean;
  created_at: string;
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.map((m: any) => ({
          ...m,
          id: m._id,
          created_at: m.createdAt
        })));
      }
    } catch (error) {
      console.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (msgId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/contact/${msgId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !currentStatus })
      });
      if (res.ok) {
        setMessages(messages.map((m) => m.id === msgId ? { ...m, isRead: !currentStatus } : m));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (msgId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/contact/${msgId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== msgId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="text-[#1A1A1A]">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#1B5E20]">Contact Messages</h1>
        <p className="text-xs text-[#555555]">
          Manage received patient emails and regional distribution inquiries.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-[#2E7D32] animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#2E7D32]/10 shadow-xs text-center text-gray-500">
          No contact messages or inquiries received yet.
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              className={`p-6 rounded-2xl border transition-all ${
                msg.isRead 
                  ? 'bg-white border-gray-150' 
                  : 'bg-emerald-50/20 border-[#2E7D32]/20 shadow-2xs'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-gray-50 pb-4">
                <div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="font-bold text-base">{msg.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      msg.type === 'distributor_inquiry' 
                        ? 'bg-[#FFF8E1] text-[#F9A825] border border-[#F9A825]/10' 
                        : 'bg-emerald-50 text-[#2E7D32] border border-[#2E7D32]/10'
                    }`}>
                      {msg.type === 'distributor_inquiry' ? 'Wholesale/Dealer Partner' : 'General Inquiry'}
                    </span>
                  </div>
                  
                  {msg.subject && (
                    <h3 className="font-bold text-sm text-[#1B5E20] mt-1">Subject: {msg.subject}</h3>
                  )}
                </div>

                {/* Info row */}
                <div className="flex items-center space-x-4 text-xs text-gray-400 font-semibold flex-wrap">
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(msg.created_at).toLocaleString()}</span>
                  <a href={`mailto:${msg.email}`} className="text-gray-500 hover:text-[#2E7D32] hover:underline flex items-center">
                    <Mail className="w-4 h-4 mr-1" /> {msg.email}
                  </a>
                  {msg.phone && (
                    <span className="flex items-center text-gray-500"><Phone className="w-4 h-4 mr-1" /> {msg.phone}</span>
                  )}
                </div>
              </div>

              {/* Message text */}
              <p className="text-sm text-[#555555] leading-relaxed whitespace-pre-wrap bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                {msg.message}
              </p>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-4 pt-2">
                <button
                  onClick={() => handleMarkAsRead(msg.id, msg.isRead)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center space-x-1.5 ${
                    msg.isRead
                      ? 'bg-gray-50 hover:bg-gray-100 text-gray-500 border-gray-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] border-[#2E7D32]/10'
                  }`}
                  title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{msg.isRead ? 'Mark as Unread' : 'Mark as Read'}</span>
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
