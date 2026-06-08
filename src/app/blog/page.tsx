'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  created_at: string;
};

// Fallback data
const initialPosts: BlogPost[] = [
  { id: '1', title: 'The Science Behind Ashwagandha', slug: 'science-behind-ashwagandha', excerpt: 'Discover how this ancient adaptogen helps your body manage stress.', featured_image: '/images/img5.jpg', created_at: '2026-05-10T10:00:00Z' },
  { id: '2', title: 'Balancing Your Pitta Dosha', slug: 'balancing-pitta-dosha', excerpt: 'Summer wellness tips for keeping your inner fire in check.', featured_image: '/images/img6.jpg', created_at: '2026-05-05T14:30:00Z' },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog');
        const data = await res.json();
        if (data && data.length > 0) {
          setPosts(data.map((p: any) => ({
            ...p,
            id: p._id,
            featured_image: p.featuredImage,
            created_at: p.createdAt
          })));
        }
      } catch (error) {
        console.error('Failed to fetch blog posts');
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="pt-20 pb-24 bg-[var(--color-surface)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-bold text-[var(--color-primary)] mb-6">Journal</h1>
          <p className="text-lg text-[var(--color-on-surface)] max-w-2xl mx-auto opacity-80">
            Insights, research, and timeless Ayurvedic wisdom for modern living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.map((post, i) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer bg-white rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-outline)]/20 shadow-sm"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="aspect-video overflow-hidden">
                  <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8">
                  <div className="flex items-center text-sm text-[var(--color-on-surface)] opacity-60 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h2 className="text-2xl font-display font-bold text-[var(--color-primary)] mb-4 group-hover:text-[var(--color-secondary)] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[var(--color-on-surface)] opacity-80 mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <span className="text-[var(--color-primary)] font-medium inline-flex items-center">
                    Read Article →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
