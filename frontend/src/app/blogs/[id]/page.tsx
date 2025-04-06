'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useBlog } from '@/context/BlogContext';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, ArrowLeft, Send } from 'lucide-react';

export default function BlogDetail() {
  const { user } = useAuth();
  const { currentBlog, loading, error, fetchBlogById, addComment, addReply } = useBlog();
  const params = useParams();
  const router = useRouter();

  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchBlogById(params.id as string);
    }
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment(params.id as string, commentText);
      setCommentText('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    }
  };


  const getUserInitials = (email: string) => email.charAt(0).toUpperCase();

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!currentBlog) return <div className="text-center py-10">Blog not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="shadow-lg mb-6">
          <img src={currentBlog.image} alt="Blog" className="w-full h-64 object-cover" />
          <CardContent className="py-6">
            <h1 className="text-3xl font-bold mb-2">{currentBlog.title}</h1>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentBlog.user.profileImage} />
                <AvatarFallback>{getUserInitials(currentBlog.user.email)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{currentBlog.user.email}</span>
              <span className="text-sm text-gray-400 ml-auto">{formatDate(currentBlog.createdAt)}</span>
            </div>
            <p className="text-gray-700">{currentBlog.description}</p>
          </CardContent>
        </Card>

        {/* Comment Box */}
        {user && (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <Textarea
              placeholder="Leave a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="mb-2"
            />
            <Button type="submit" disabled={!commentText.trim()}>
              <Send className="w-4 h-4 mr-2" /> Comment
            </Button>
          </form>
        )}

        {/* Comments */}
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Comments
        </h2>

        <div className="space-y-6">
          {currentBlog.comments.map((comment) => (
            <div key={comment._id} className="bg-white p-4 rounded shadow-sm">
              <div className="flex items-start gap-3 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user.profileImage} />
                  <AvatarFallback>{getUserInitials(comment.user.email)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{comment.user.email}</p>
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(comment.createdAt)}</p>


                  {/* Replies */}
                  {comment.replies?.length > 0 && (
                    <div className="mt-4 ml-6 space-y-4 border-l pl-4 border-gray-200">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="text-sm text-gray-700">
                          <div className="flex items-start gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={reply.user.profileImage} />
                              <AvatarFallback>{getUserInitials(reply.user.email)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{reply.user.email}</p>
                              <p>{reply.content}</p>
                              <p className="text-xs text-gray-400">{formatDate(reply.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
