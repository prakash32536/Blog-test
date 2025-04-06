'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useBlog } from '@/context/BlogContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';
import BlogForm from '@/components/BlogForm';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const { blogs, loading: blogLoading, error, fetchBlogs, deleteBlog } = useBlog();
  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }

    if (user) {
      fetchBlogs();
    }
  }, [user, authLoading, router]);

  const handleEditClick = (blog: any) => {
    setCurrentBlog(blog);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (blog: any) => {
    setCurrentBlog(blog);
    setIsDeleteDialogOpen(true);
  };

  const handleViewClick = (blogId: string) => {
    router.push(`/blogs/${blogId}`);
  };

  const handleDelete = async () => {
    try {
      await deleteBlog(currentBlog._id);
      toast.success('Blog deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (err) {
      toast.error('Failed to delete blog');
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user.profileImage} alt={user.email} />
                  <AvatarFallback>{getUserInitials(user.email)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
            )}
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Blogs</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add New Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Blog</DialogTitle>
              </DialogHeader>
              <BlogForm onClose={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {blogLoading ? (
          <p>Loading blogs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : blogs.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-500">You haven't created any blogs yet.</p>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blogs.map((blog: any) => (
                  <tr key={blog._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{blog.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 relative rounded overflow-hidden">
                        <img 
                          src={blog.image} 
                          alt={blog.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{blog.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewClick(blog._id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditClick(blog)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteClick(blog)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      
      {/* Edit Blog Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
          </DialogHeader>
          {currentBlog && (
            <BlogForm 
              onClose={() => setIsEditDialogOpen(false)} 
              blog={currentBlog} 
              isEdit={true} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Blog</DialogTitle>
          </DialogHeader>
          <DeleteConfirmation 
            onDelete={handleDelete} 
            onCancel={() => setIsDeleteDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}