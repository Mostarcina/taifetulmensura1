import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Heart, MessageCircle, Tag } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';

export const Home = () => {
  const { posts, comments } = useData();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const inTitle = post.title.toLowerCase().includes(searchQuery);
    const inContent = post.content.toLowerCase().includes(searchQuery);
    const inTags = post.tags.some(tag => tag.toLowerCase().includes(searchQuery));
    return inTitle || inContent || inTags;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {searchQuery && (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg flex items-center justify-between">
              <span>Showing results for: <strong>"{searchQuery}"</strong></span>
              <Link to="/" className="text-emerald-600 hover:underline text-sm">Clear search</Link>
            </div>
          )}

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-lg">No posts found.</p>
            </div>
          ) : (
            filteredPosts.map(post => {
              const postComments = comments.filter(c => c.postId === post.id);
              return (
                <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <Link key={tag} to={`/?search=${tag}`} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition">
                          <Tag size={12} className="mr-1" />
                          {tag}
                        </Link>
                      ))}
                    </div>
                    <Link to={`/post/${post.id}`}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-emerald-700 transition">{post.title}</h2>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4 mt-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Heart size={18} className="text-rose-500" />
                          <span>{post.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle size={18} className="text-blue-500" />
                          <span>{postComments.length}</span>
                        </span>
                      </div>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
