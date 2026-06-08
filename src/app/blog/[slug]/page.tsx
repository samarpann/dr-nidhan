'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  author: string;
  created_at: string;
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      // Mock data for immediate render
      const mockPost: BlogPost = {
        id: '1',
        title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        slug,
        content: `
          <h2>Understanding the Doshas</h2>
          <p>Ayurveda proposes three stages in the quest for good health: daily routine and seasonal activities to prevent illness, purification therapy and medications for diseases, and rejuvenation of the system to enhance health and quality of life.</p>
          <p>The state of balance or equilibrium between these three doshas in the body is called health and the state of imbalance or disequilibrium is disease. The imbalance may be in one, two or all the three doshas.</p>
          <h3>Vata Aggravation</h3>
          <p>Eating too much bitter, astringent and pungent tasted foods like cabbage, cauliflower, broccoli, sprouts, beans, dry fruits, mushrooms and raw foods can increase Vata.</p>
        `,
        featured_image: '/images/img5.jpg',
        author: 'Dr. Nidan Team',
        created_at: '2026-05-10T10:00:00Z'
      };

      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost({
            ...data,
            id: data._id,
            featured_image: data.featuredImage,
            created_at: data.createdAt
          });
        } else {
          setPost(mockPost);
        }
      } catch (error) {
        setPost(mockPost);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center">Post not found.</div>;

  return (
    <article className="pt-20 pb-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-primary)] mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center space-x-6 text-[var(--color-on-surface)] opacity-70">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              {post.author}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="aspect-video w-full rounded-[var(--radius-lg)] overflow-hidden mb-16 shadow-sm"
        >
          <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg md:prose-xl max-w-none prose-headings:font-display prose-headings:text-[var(--color-primary)] prose-p:text-[var(--color-on-surface)] prose-a:text-[var(--color-secondary)]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
