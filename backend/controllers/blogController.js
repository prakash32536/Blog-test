import Blog from '../models/blogModel.js';

const createBlog = async (req, res) => {
    try {
        const { title, description } = req.body;

        const blog = await Blog.create({
            title,
            description,
            image: req.file ? req.file.path : '',
            user: req.user._id
        });

        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({})
            .populate('user', 'email profileImage')
            .sort({ createdAt: -1 });

        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('user', 'email profileImage')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'email profileImage'
                }
            });

        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const { title, description } = req.body;

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user owns the blog
        if (blog.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        blog.title = title || blog.title;
        blog.description = description || blog.description;
        if (req.file) {
            blog.image = req.file.path;
        }

        const updatedBlog = await blog.save();

        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user owns the blog
        if (blog.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await blog.deleteOne();

        res.json({ message: 'Blog removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { content } = req.body;

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const comment = {
            user: req.user._id,
            content
        };

        blog.comments.push(comment);

        await blog.save();

        const updatedBlog = await Blog.findById(req.params.id)
            .populate('user', 'email profileImage')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'email profileImage'
                }
            });

        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addReply = async (req, res) => {
    try {
        const { content } = req.body;

        const blog = await Blog.findById(req.params.blogId);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const comment = blog.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const reply = {
            user: req.user._id,
            content
        };

        comment.replies.push(reply);

        await blog.save();

        const updatedBlog = await Blog.findById(req.params.blogId)
            .populate('user', 'email profileImage')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'email profileImage'
                }
            });

        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    addComment,
    addReply
};