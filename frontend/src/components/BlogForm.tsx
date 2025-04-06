'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBlog } from '@/context/BlogContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { Textarea } from '@/components/ui/textarea';

interface BlogFormProps {
  onClose: () => void;
  blog?: any;
  isEdit?: boolean;
}

interface BlogFormData {
  title: string;
  description: string;
}

const BlogForm: React.FC<BlogFormProps> = ({ onClose, blog, isEdit = false }) => {
  const { createBlog, updateBlog, loading } = useBlog();
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(blog?.image || null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<BlogFormData>({
    defaultValues: {
      title: blog?.title || '',
      description: blog?.description || ''
    }
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBlogImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data: BlogFormData) => {
    try {
      if (isEdit) {
        await updateBlog(blog._id, data.title, data.description, blogImage);
        toast.success('Blog updated successfully');
      } else {
        await createBlog(data.title, data.description, blogImage);
        toast.success('Blog created successfully');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${isEdit ? 'update' : 'create'} blog`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Blog Title
        </label>
        <Input
          id="title"
          placeholder="Enter blog title"
          {...register('title', {
            required: 'Title is required'
          })}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Blog Description
        </label>
        <Textarea
          id="description"
          placeholder="Enter blog description"
          rows={6}
          {...register('description', {
            required: 'Description is required'
          })}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="text-sm font-medium">
          Blog Image
        </label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
        />
        {imagePreview && (
          <div className="relative mt-2 h-40 w-full overflow-hidden rounded-md">
            <img
              src={imagePreview}
              alt="Blog Image Preview"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        {!blogImage && isEdit && !imagePreview && (
          <p className="text-sm text-amber-500">You will need to upload a new image if you want to change it.</p>
        )}
        {!blogImage && !isEdit && (
          <p className="text-sm text-amber-500">Please upload an image for your blog.</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Blog' : 'Create Blog'}
        </Button>
      </div>
    </form>
  );
};

export default BlogForm;