import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2, Star, Plus } from 'lucide-react';

const API_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000/api' 
  : 'https://your-production-domain.com/api'; // Replace with actual Prod URL

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/blogs`);
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this blog post?')) {
      try {
        await axios.delete(`${API_URL}/admin/blogs/${id}`);
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleSetFeatured = async (id) => {
    try {
      await axios.put(`${API_URL}/admin/blogs/featured/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error('Error setting featured blog:', error);
    }
  };

  if (loading) return <div className="text-gray-500">Loading blogs...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800">All Blog Posts</h3>
        <Link 
          to="/editor" 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={18} /> New Post
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Post</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {blogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                  No blogs found. Create your first post!
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 border-l-4 pl-3" style={{ borderColor: blog.color.replace('bg-[', '').replace(']', '') || '#8b5cf6' }}>
                      {blog.title}
                    </div>
                    <div className="text-slate-400 text-xs mt-1 truncate max-w-xs">{blog.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">{blog.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">{blog.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {blog.isFeatured ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 shadow-sm border border-amber-200">
                        <Star size={12} fill="currentColor" /> Featured
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      {!blog.isFeatured && (
                        <button 
                          onClick={() => handleSetFeatured(blog.id)}
                          className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                          title="Set as Featured"
                        >
                          <Star size={18} />
                        </button>
                      )}
                      <Link to={`/editor/${blog.slug}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-200" title="Edit">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(blog.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200" title="Delete">
                        <Trash2 size={18} />
                      </button>
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
