import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, Tag, ArrowLeft, Send } from 'lucide-react';

export const PostView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, comments, toggleLike, addComment } = useData();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');

  const post = posts.find(p => p.id === id);
  const postComments = comments.filter(c => c.postId === id);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Post not found</h2>
        <Link to="/" className="text-emerald-600 hover:underline flex items-center justify-center">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  const hasLiked = user ? post.likedBy.includes(user.id) : false;

  const handleLike = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    toggleLike(post.id, user.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (commentText.trim()) {
      addComment(post.id, user.username, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6 font-medium">
        <ArrowLeft size={16} className="mr-2" /> Back to feed
      </Link>

      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                <Tag size={12} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="text-sm text-gray-500 mb-8 border-b pb-4">
            Published on {new Date(post.createdAt).toLocaleDateString()}
          </div>
          
          <div className="prose max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-wrap mb-8">
            {post.content}
          </div>

          <div className="flex items-center space-x-6 border-t pt-6">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 text-lg transition ${hasLiked ? 'text-rose-500 font-medium' : 'text-gray-500 hover:text-rose-500'}`}
            >
              <Heart size={24} fill={hasLiked ? "currentColor" : "none"} />
              <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
            </button>
            <div className="flex items-center space-x-2 text-lg text-gray-500">
              <MessageCircle size={24} />
              <span>{postComments.length} Comments</span>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments</h3>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none min-h-[100px]"
                />
                <div className="mt-2 flex justify-end">
                  <button 
                    type="submit"
                    disabled={!commentText.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition disabled:opacity-50"
                  >
                    <Send size={16} className="mr-2" /> Post Comment
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center mb-8 border border-gray-200">
            <p className="text-gray-600">Please <Link to="/login" className="text-emerald-600 font-medium hover:underline">log in</Link> to leave a comment.</p>
          </div>
        )}

        <div className="space-y-6">
          {postComments.length === 0 ? (
            <p className="text-gray-500 text-center italic">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            postComments.map(comment => (
              <div key={comment.id} className="flex space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 font-bold">
                  {comment.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
