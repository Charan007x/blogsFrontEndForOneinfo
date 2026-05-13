import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Save, Plus, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Editor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(slug);
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [blogId, setBlogId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    color: 'bg-[#8b5cf6]',
    category: '',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    isFeatured: false,
    slug: '',
    imageUrl: ''
  });
  
  const [content, setContent] = useState([]);

  useEffect(() => {
    if (isEditing) {
      const fetchBlog = async () => {
        try {
          const { data } = await axios.get(`${API_URL}/blogs/${slug}`);
          setBlogId(data.id);
          setFormData({
            title: data.title || '',
            summary: data.summary || '',
            color: data.color || 'bg-[#8b5cf6]',
            category: data.category || '',
            date: data.date || '',
            isFeatured: data.isFeatured || false,
            slug: data.slug || '',
            imageUrl: data.imageUrl || ''
          });
          setContent(data.content || []);
        } catch (error) {
          console.error('Error fetching blog:', error);
          alert('Blog not found!');
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [slug, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const addBlock = (type) => {
    setContent([...content, { type, text: '', hasDropCap: false, author: '' }]);
  };

  const updateBlock = (index, field, value) => {
    const newContent = [...content];
    newContent[index][field] = value;
    setContent(newContent);
  };

  const removeBlock = (index) => {
    setContent(content.filter((_, i) => i !== index));
  };

  const moveBlock = (index, direction) => {
    const newContent = [...content];
    if (direction === 'up' && index > 0) {
      [newContent[index - 1], newContent[index]] = [newContent[index], newContent[index - 1]];
    } else if (direction === 'down' && index < newContent.length - 1) {
      [newContent[index + 1], newContent[index]] = [newContent[index], newContent[index + 1]];
    }
    setContent(newContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = formData.imageUrl;
      
      // Step 1: Upload image if a new one is selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const uploadRes = await axios.post(`${API_URL}/admin/upload`, uploadData);
        finalImageUrl = uploadRes.data.imageUrl;
      }

      // Step 2: Save the blog post
      const payload = {
        ...formData,
        imageUrl: finalImageUrl,
        content
      };

      if (isEditing) {
        await axios.put(`${API_URL}/admin/blogs/${blogId}`, payload);
      } else {
        await axios.post(`${API_URL}/admin/blogs`, payload);
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading editor...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-3xl font-bebas text-gray-800 tracking-wide mt-1">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h2>
        </div>
        <button 
          type="submit" 
          disabled={saving}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition disabled:bg-purple-400"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Post'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Primary Info</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" name="title" required
                value={formData.title} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Blog post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
              <textarea 
                name="summary" required rows="2"
                value={formData.summary} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Brief summary for the card"
              />
            </div>
          </div>

          {/* Dynamic Content Builder */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Content Blocks</h3>
            
            <div className="space-y-4">
              {content.map((block, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex gap-4 items-start">
                  <div className="flex flex-col gap-1 text-gray-400">
                    <button type="button" onClick={() => moveBlock(index, 'up')} className="hover:text-gray-700">▲</button>
                    <button type="button" onClick={() => moveBlock(index, 'down')} className="hover:text-gray-700">▼</button>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        {block.type}
                      </span>
                      <button type="button" onClick={() => removeBlock(index)} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1">
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    {block.type === 'paragraph' && (
                      <>
                        <textarea 
                          value={block.text || ''} 
                          onChange={(e) => updateBlock(index, 'text', e.target.value)}
                          placeholder="Write your paragraph..."
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                          rows="4"
                        />
                        <label className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                          <input 
                            type="checkbox" 
                            checked={block.hasDropCap || false}
                            onChange={(e) => updateBlock(index, 'hasDropCap', e.target.checked)}
                            className="rounded text-purple-600 focus:ring-purple-500" 
                          />
                          Enable Giant Drop Cap (first letter)
                        </label>
                      </>
                    )}

                    {block.type === 'quote' && (
                      <>
                        <textarea 
                          value={block.text || ''} 
                          onChange={(e) => updateBlock(index, 'text', e.target.value)}
                          placeholder="Quote text..."
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                          rows="2"
                        />
                        <input 
                          type="text"
                          value={block.author || ''}
                          onChange={(e) => updateBlock(index, 'author', e.target.value)}
                          placeholder="Author / Attribution (e.g. NIRANJAN VOJJA)"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                        />
                      </>
                    )}

                    {block.type === 'divider' && (
                      <div className="h-4 border-b-2 border-dashed border-gray-300 w-full my-2"></div>
                    )}
                  </div>
                </div>
              ))}

              {content.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">No content blocks yet. Add one below!</div>
              )}

              <div className="flex gap-2 pt-4 justify-center border-t border-gray-100">
                <button type="button" onClick={() => addBlock('paragraph')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium hover:bg-gray-50 text-gray-700">
                  <Plus size={16} /> Paragraph
                </button>
                <button type="button" onClick={() => addBlock('quote')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium hover:bg-gray-50 text-gray-700">
                  <Plus size={16} /> Quote
                </button>
                <button type="button" onClick={() => addBlock('divider')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium hover:bg-gray-50 text-gray-700">
                  <Plus size={16} /> Divider
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Form */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input 
                type="text" name="category" required
                value={formData.category} onChange={handleChange}
                placeholder="e.g. INDUSTRY AWARDS"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="text" name="date" required
                value={formData.date} onChange={handleChange}
                placeholder="e.g. AUG 25, 2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">String format exactly as it should appear.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme (Tailwind Class)</label>
              <input 
                type="text" name="color"
                value={formData.color} onChange={handleChange}
                placeholder="bg-[#8b5cf6]"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Slug (Optional)</label>
              <input 
                type="text" name="slug"
                value={formData.slug} onChange={handleChange}
                placeholder="auto-generated-if-empty"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 pt-2 border-t mt-4">
              <input 
                type="checkbox" name="isFeatured"
                checked={formData.isFeatured} onChange={handleChange}
                className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4" 
              />
              Featured Post
            </label>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 " >
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Cover Image</h3>
            
            {formData.imageUrl && !imageFile && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Current Image</p>
                <img src={formData.imageUrl} alt="Current cover" className="w-full h-auto rounded border border-gray-200 object-cover aspect-video" />
              </div>
            )}
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-500 font-medium">
                  {imageFile ? imageFile.name : 'Click to select new image'}
                </p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
