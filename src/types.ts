export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  likedBy: string[];
  createdAt: string;
}

export interface CommunityLink {
  id: string;
  title: string;
  url: string;
  iconName: string;
}
