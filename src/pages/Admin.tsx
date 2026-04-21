import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Plus, Edit, Trash2, Link as LinkIcon } from 'lucide-react';

export const Admin = () => {
  const { user } = useAuth();
  const { posts, links, addPost, editPost, deletePost, addLink, deleteLink } = useData();
  
  const [activeTab, setActiveTab] = useState<'posts' | 'links'>('posts');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('');

  // Link Form State
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkIcon, setLinkIcon] = useState('Link');

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = postTags.split(',').map(t => t.trim()).filter(t => t);
    
    if (isEditing) {
      editPost(isEditing, { title: postTitle, content: postContent, tags: tagsArray });
    } else {
      addPost({ title: postTitle, content: postContent, tags: tagsArray });
    }
    
    resetPostForm();
  };

  const resetPostForm = () => {
    setPostTitle('');
    setPostContent('');
    setPostTags('');
    setIsEditing(null);
  };

  const handleEditClick = (post: any) => {
    setIsEditing(post.id);
    setPostTitle(post.title);
    setPostContent(post.content);
    setPostTags(post.tags.join(', '));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLink({ title: linkTitle, url: linkUrl, iconName: linkIcon });
    setLinkTitle('');
    setLinkUrl('');
    setLinkIcon('Link');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('posts')}
          className={`pb-3 px-4 font-medium text-sm transition ${activeTab === 'posts' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Manage Posts
        </button>
        <button 
          onClick={() => setActiveTab('links')}
          className={`pb-3 px-4 font-medium text-sm transition ${activeTab === 'links' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Manage Community Links
        </button>
      </div>

      {activeTab === 'posts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" value={postTitle} onChange={e => setPostTitle(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea required value={postContent} onChange={e => setPostContent(e.target.value)} rows={6} className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input type="text" placeholder="e.g. Namaz, Quran, Fasting" value={postTags} onChange={e => setPostTags(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="submit" className="flex-1 bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition flex items-center justify-center">
                  {isEditing ? <Edit size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
                  {isEditing ? 'Update Post' : 'Publish Post'}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetPostForm} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-4">Existing Posts</h2>
            {posts.map(post => (
              <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()} • {post.likes} Likes</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEditClick(post)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deletePost(post.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-md transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Add New Link</h2>
            <form onSubmit={handleLinkSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Title</label>
                <input required type="text" placeholder="e.g. Discord Server" value={linkTitle} onChange={e => setLinkTitle(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input required type="url" placeholder="https://..." value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select value={linkIcon} onChange={e => setLinkIcon(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="Link">Default Link</option>
                  <option value="Discord">Discord / Chat</option>
                  <option value="Globe">Website / Globe</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition flex items-center justify-center mt-4">
                <Plus size={16} className="mr-2" /> Add Link
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-4">Active Links</h2>
            {links.map(link => (
              <div key={link.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <LinkIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{link.title}</h3>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 hover:underline">{link.url}</a>
                  </div>
                </div>
                <button onClick={() => deleteLink(link.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-md transition">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {links.length === 0 && <p className="text-gray-500">No links added yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
};
