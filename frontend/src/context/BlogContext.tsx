'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface Comment {
  _id: string;
  user: {
    _id: string;
    email: string;
    profileImage: string;
  };
  content: string;
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  _id: string;
  user: {
    _id: string;
    email: string;
    profileImage: string;
  };
  content: string;
  createdAt: string;
}

interface Blog {
  _id: string;
  title: string;
  description: string;
  image: string;
  user: {
    _id: string;
    email: string;
    profileImage: string;
  };
  comments: Comment[];
  createdAt: string;
}

interface BlogContextProps {
  blogs: Blog[];
  currentBlog: Blog | null;
  loading: boolean;
  error: string | null;
  fetchBlogs: () => Promise<void>;
  fetchBlogById: (id: string) => Promise<void>;
  createBlog: (title: string, description: string, image: File | null) => Promise<void>;
  updateBlog: (id: string, title: string, description: string, image: File | null) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  addComment: (blogId: string, content: string) => Promise<void>;
  addReply: (blogId: string, commentId: string, content: string) => Promise<void>;
}

const BlogContext = createContext<BlogContextProps | undefined>(undefined);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('https://blog-test-7we3.onrender.com/api/blogs');
      setBlogs(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`https://blog-test-7we3.onrender.com/api/blogs/${id}`);
      setCurrentBlog(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (title: string, description: string, image: File | null) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`
        }
      };
      
      await axios.post('https://blog-test-7we3.onrender.com/api/blogs', formData, config);
      await fetchBlogs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (id: string, title: string, description: string, image: File | null) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`
        }
      };
      
      await axios.put(`https://blog-test-7we3.onrender.com/api/blogs/${id}`, formData, config);
      await fetchBlogs();
      if (currentBlog) {
        await fetchBlogById(id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update blog');
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      };
      
      await axios.delete(`https://blog-test-7we3.onrender.com/api/blogs/${id}`, config);
      setBlogs(blogs.filter(blog => blog._id !== id));
      if (currentBlog && currentBlog._id === id) {
        setCurrentBlog(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete blog');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (blogId: string, content: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        }
      };
      
      const response = await axios.post(
        `https://blog-test-7we3.onrender.com/api/blogs/${blogId}/comments`,
        { content },
        config
      );
      
      setCurrentBlog(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const addReply = async (blogId: string, commentId: string, content: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        }
      };
      
      const response = await axios.post(
        `https://blog-test-7we3.onrender.com/api/blogs/${blogId}/comments/${commentId}/replies`,
        { content },
        config
      );
      
      setCurrentBlog(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add reply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlogContext.Provider value={{
      blogs,
      currentBlog,
      loading,
      error,
      fetchBlogs,
      fetchBlogById,
      createBlog,
      updateBlog,
      deleteBlog,
      addComment,
      addReply
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};