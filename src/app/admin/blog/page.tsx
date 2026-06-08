'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
};

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Health & Recovery');
  const [featuredImage, setFeaturedImage] = useState('');
  const [author, setAuthor] = useState('Dr. Nidan Ayurvedic Expert');
  const [isPublished, setIsPublished] = useState(true);
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog?admin=true');
      const data = await res.json();
      setPosts(data.map((p: any) => ({
        ...p,
        id: p._id
      })));
    } catch (error) {
      console.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!editingPost) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  }, [title, editingPost]);

  const openAddModal = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setContent('');
    setExcerpt('');
    setCategory('Health & Recovery');
    setFeaturedImage('/product image/nasha mukti.jpeg');
    setAuthor('Dr. Nidan Ayurvedic Expert');
    setIsPublished(true);
    setTags(['nasha mukti', 'ayurvedic healing']);
    setTagsInput('');
    setModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setExcerpt(post.excerpt || '');
    setCategory(post.category);
    setFeaturedImage(post.featuredImage || '');
    setAuthor(post.author || 'Dr. Nidan Ayurvedic Expert');
    setIsPublished(post.isPublished);
    setTags(post.tags || []);
    setTagsInput('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title,
      slug,
      content,
      excerpt,
      category,
      featuredImage,
      author,
      isPublished,
      tags,
      publishedAt: isPublished ? new Date() : undefined
    };

    try {
      let res;
      if (editingPost) {
        res = await fetch(`/api/blog/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setModalOpen(false);
        fetchPosts();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/blog/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPosts();
      } else {
        alert('Failed to delete blog post');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTag = () => {
    if (tagsInput.trim() && !tags.includes(tagsInput.trim().toLowerCase())) {
      setTags([...tags, tagsInput.trim().toLowerCase()]);
      setTagsInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="text-[#1A1A1A]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1B5E20]">Manage Blog Posts</h1>
          <p className="text-xs text-[#555555]">Write and publish Ayurvedic wellness resources.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center px-5 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5 mr-2" /> New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#2E7D32]/10 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#F9FFF9] border-b border-[#2E7D32]/10 text-gray-500 uppercase tracking-wider text-xs">
              <th className="px-6 py-4 font-bold">Article Title</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">Date Created</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="w-5 h-5 text-[#2E7D32] animate-spin" />
                    <span>Loading articles...</span>
                  </div>
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  No blog posts found. Click "New Post" to create one.
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#1A1A1A]">
                    <span className="line-clamp-1">{p.title}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{p.slug}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-semibold">{p.category}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      p.isPublished ? 'bg-green-50 text-[#2E7D32] border border-[#2E7D32]/10' : 'bg-gray-50 text-gray-400 border border-gray-100'
                    }`}>
                      {p.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all inline-block"
                      title="Edit Post"
                    >
                      <Edit className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-all inline-block"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Post Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center z-10">
                <h3 className="text-xl font-display font-bold text-[#1B5E20]">
                  {editingPost ? 'Edit Blog Article' : 'Write New Article'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                
                {/* Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                      placeholder="e.g. 5 Herbs that stop cravings"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Slug *</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                      placeholder="auto-generated-slug"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Category *</label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Author *</label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Featured Image URL *</label>
                    <input
                      type="text"
                      required
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Excerpt (Short Summary)</label>
                  <input
                    type="text"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    placeholder="Short 150-character article teaser..."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Rich Content (HTML/Text) *</label>
                  <textarea
                    required
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] resize-none font-mono"
                    placeholder="<h2>Header</h2><p>Article body paragraphs...</p>"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase text-gray-500">Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                      className="flex-grow px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                      placeholder="Type tag and press enter..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 bg-emerald-50 border border-[#2E7D32]/10 text-[#2E7D32] rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((t) => (
                      <span key={t} className="bg-[#FFF8E1] text-[#F9A825] px-2.5 py-1 rounded-md text-xs font-semibold flex items-center shadow-2xs">
                        <span>#{t}</span>
                        <button type="button" onClick={() => handleRemoveTag(t)} className="text-red-500 font-bold ml-2 text-[10px]">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4.5 h-4.5 text-[#2E7D32] border-gray-300 rounded focus:ring-[#2E7D32]"
                  />
                  <label htmlFor="isPublished" className="text-xs font-bold uppercase text-gray-500 cursor-pointer">
                    Publish immediately (Active in Journal)
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold rounded-xl text-sm shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-75"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Post</span>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
