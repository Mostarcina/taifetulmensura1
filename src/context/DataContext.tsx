import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Post, Comment, CommunityLink } from '../types';

interface DataContextType {
  posts: Post[];
  comments: Comment[];
  links: CommunityLink[];
  addPost: (post: Omit<Post, 'id' | 'likes' | 'likedBy' | 'createdAt'>) => void;
  editPost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  toggleLike: (postId: string, userId: string) => void;
  addComment: (postId: string, author: string, text: string) => void;
  addLink: (link: Omit<CommunityLink, 'id'>) => void;
  deleteLink: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialPosts: Post[] = [
  {
    id: '1',
    title: 'The Importance of Namaz (Prayer)',
    content: 'Namaz is the second pillar of Islam and a direct link between the worshipper and Allah. It is obligatory upon every adult Muslim to perform the five daily prayers. Establishing regular prayer brings peace to the heart and keeps one away from evil deeds.',
    tags: ['Namaz', 'Prayer', 'Pillars of Islam'],
    likes: 12,
    likedBy: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Benefits of Fasting in Ramadan',
    content: 'Fasting during the month of Ramadan teaches self-discipline, empathy for the less fortunate, and brings us closer to our Creator. It is a time for spiritual reflection, increased devotion, and worship.',
    tags: ['Ramadan', 'Fasting', 'Spirituality'],
    likes: 8,
    likedBy: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

const initialLinks: CommunityLink[] = [
  { id: '1', title: 'Discord Server', url: '#', iconName: 'MessageSquare' }
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [comments, setComments] = useState<Comment[]>([]);
  const [links, setLinks] = useState<CommunityLink[]>(initialLinks);

  const addPost = (post: Omit<Post, 'id' | 'likes' | 'likedBy' | 'createdAt'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
  };

  const editPost = (id: string, updatedFields: Partial<Post>) => {
    setPosts(posts.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
    setComments(comments.filter(c => c.postId !== id));
  };

  const toggleLike = (postId: string, userId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const hasLiked = p.likedBy.includes(userId);
        return {
          ...p,
          likes: hasLiked ? p.likes - 1 : p.likes + 1,
          likedBy: hasLiked ? p.likedBy.filter(id => id !== userId) : [...p.likedBy, userId]
        };
      }
      return p;
    }));
  };

  const addComment = (postId: string, author: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      author,
      text,
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
  };

  const addLink = (link: Omit<CommunityLink, 'id'>) => {
    setLinks([...links, { ...link, id: Date.now().toString() }]);
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  return (
    <DataContext.Provider value={{ posts, comments, links, addPost, editPost, deletePost, toggleLike, addComment, addLink, deleteLink }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
