'use client';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, MenuItem, Select, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { getBlogs, addBlog, updateBlog, deleteBlog as deleteBlogById } from '@/mock/blogData';
import Like from '../../../../public/thumbs-up.png';
import { MockBlog } from '@/types';
import './style.css';

function Blog(): React.ReactElement {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [, setBannerImg] = useState<File | null>(null);
  const [bannerImgBase64, setBannerImgBase64] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('select');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ownBlogs, setOwnBlogs] = useState<MockBlog[]>([]);
  const [blogId, setBlogId] = useState<string | null | undefined>('');
  const [validation, setValidation] = useState<string | null>(null);
  const router = useRouter();

  const getOwnBlogs = (): void => {
    setOwnBlogs([...getBlogs()]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        setValidation('Please select a valid image file');
        fileInputRef.current!.value = '';
        return;
      }

      const MAX_SIZE_MB = 2;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setValidation(`File size should not exceed ${MAX_SIZE_MB}MB`);
        fileInputRef.current!.value = '';
        return;
      }

      setBannerImg(file);
      const reader = new FileReader();
      reader.onloadend = (): void => {
        setBannerImgBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValidation(null);
    }
  };

  const handleCreateBlog = (): void => {
    if (!title.trim() || !content.trim() || category === 'select') {
      setValidation('Please fill out all fields');
      return;
    }

    const newBlog: any = {
      id: `${Date.now()}`,
      author: { name: 'You' },
      title,
      content,
      bannerImg: bannerImgBase64 || 'https://via.placeholder.com/150',
      category,
      likesCount: 0,
      createdAt: new Date().toISOString(),
      comments: []
    };

    addBlog(newBlog);
    getOwnBlogs();
    setValidation('Blog added successfully');
    resetForm();
    setTimeout(() => setValidation(null), 3000);
  };

  const handleUpdateBlog = (): void => {
    if (!blogId) {
      setValidation('No blog selected for update');
      return;
    }

    const updatedBlog: any = {
      id: blogId,
      author: { name: 'You' },
      title,
      content,
      bannerImg: bannerImgBase64 || 'https://via.placeholder.com/150',
      category,
      likesCount: 0,
      createdAt: new Date().toISOString(),
      comments: []
    };

    updateBlog(updatedBlog);
    getOwnBlogs();
    setValidation('Blog updated successfully');
    resetForm();
    setTimeout(() => setValidation(null), 3000);
  };

  const handleDeleteBlog = (blog_id: string | null | undefined): void => {
    if (!blog_id) {
      setValidation('No blog selected for deletion');
      return;
    }

    deleteBlogById(blog_id);
    getOwnBlogs();
    setValidation('Blog deleted successfully');
    resetForm();
    setTimeout(() => setValidation(null), 3000);
  };

  const resetForm = (): void => {
    setTitle('');
    setContent('');
    setBannerImg(null);
    setBannerImgBase64(null);
    setCategory('select');
    setBlogId(null);
  };

  const handleIconClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleBlogSelect = (blog: MockBlog): void => {
    setBlogId(blog.id);
    setTitle(blog.title);
    setContent(blog.content);
    setBannerImgBase64(blog.bannerImg);
    setCategory(blog.category);
  };

  useEffect(() => {
    getOwnBlogs();
  }, []);

  return (
    <Box className="blog-root-container">
      <Box className="blog-grid-container">
        <Box className="blog-icon-container" onClick={handleIconClick}>
          {bannerImgBase64 ? (
            <Image
              src={bannerImgBase64}
              alt="Selected banner"
              className="blog-banner-preview"
              width={150}
              height={100}
            />
          ) : (
            <AddBoxIcon color="primary" />
          )}
        </Box>
        <Box className="blog-select-container">
          <Select
            name="select-category"
            size="small"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="blog-select"
            fullWidth>
            <MenuItem value="select">Select Category</MenuItem>
            <MenuItem value="technology">Technology</MenuItem>
            <MenuItem value="news">News</MenuItem>
          </Select>
          {validation && (
            <Box className="validation-msg">
              <Typography color="primary">{validation}</Typography>
            </Box>
          )}
          <Box className="blog-actions">
            <AddBoxIcon color="primary" onClick={handleCreateBlog} />
            <ChangeCircleIcon color="primary" onClick={handleUpdateBlog} />
            <DeleteIcon color="primary" onClick={() => handleDeleteBlog(blogId)} />
          </Box>
        </Box>
      </Box>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="blog-heading"
      />
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        multiline
        placeholder="Blog Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="blog-textfield"
      />
      <Box className="blog-content-container">
        {ownBlogs.map((blog) => (
          <Box
            key={blog.id}
            className={`blog-content-box ${blog.id === blogId ? 'highlighted' : ''}`}
            onClick={() => handleBlogSelect(blog)}>
            <Box component="img" src={blog.bannerImg} alt="Banner" className="blog-image" />
            <Typography color="primary" className="blog-user-info-text">
              {blog.title}
            </Typography>
            <Typography color="primary" className="blog-user-info-description">
              {blog.content}
            </Typography>
            <Box className="blog-info">
              <Box className="blog-user-info">
                <AccountCircleIcon color="secondary" className="blog-user-info-icon" />
                <Typography color="primary" className="blog-user-info-text">
                  {blog.author.name}
                </Typography>
              </Box>
              <Box className="blog-like-info">
                <Box component="img" src={Like.src} alt="like" className="blog-user-like-icon" />
                <Typography color="primary" className="blog-user-info-text">
                  {blog.likesCount}
                </Typography>
                <OpenInNewIcon
                  color="primary"
                  fontSize="small"
                  onClick={() => {
                    router.push(
                      `/dashboard/${encodeURIComponent(blog.title.toLowerCase().replace(/\s+/g, '-'))}`
                    );
                  }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        component="input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
    </Box>
  );
}

export default Blog;
