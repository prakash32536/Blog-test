import express from 'express';
import { 
  createBlog, 
  getBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog, 
  addComment, 
  addReply 
} from '../controllers/blogController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createBlog);
router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.put('/:id', protect, upload.single('image'), updateBlog);
router.delete('/:id', protect, deleteBlog);
router.post('/:id/comments', protect, addComment);
router.post('/:blogId/comments/:commentId/replies', protect, addReply);

export default router;