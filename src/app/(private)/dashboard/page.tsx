'use client';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { blogData } from '@/mock/blogData';
import { setBlogId, setBlogs } from '@/store/slice/blogSlice';
import Like from '../../../../public/thumbs-up.svg';
import './style.css';

function Dashboard(): React.ReactNode {
  const [blog, setBlog] = useState(blogData); // Load first 5 blogs
  const dispatch = useDispatch();

  useEffect(() => {
    setBlog(blogData); // Simulate fetching data
    dispatch(setBlogs(blogData));
  }, [dispatch]);

  return (
    <Box className="dashboard-root-container">
      <Box className="dashboard-blog-container">
        {blog.map((blogDataMock, index) => (
          <Link
            className="dashboard-blog-card-wrapper"
            key={index}
            href={`/dashboard/${encodeURIComponent(blogDataMock.title.toLowerCase().replace(/\s+/g, '-'))}`}
            onClick={() => {
              dispatch(setBlogId(String(blogDataMock.id)));
            }}>
            <Image
              src={blogDataMock.bannerImg}
              alt="Banner"
              width={400}
              height={200}
              priority
              className="dashboard-blog-img"
            />
            <Typography className="dashboard-blog-title">{blogDataMock.title}</Typography>
            <Typography className="dashboard-blog-description">{blogDataMock.content}</Typography>
            <Box className="dashboard-blog-user-info">
              <AccountCircleIcon color="secondary" className="dashboard-user-info-icon" />
              <Typography className="dashboard-user-info-title">
                {blogDataMock.author.name}
              </Typography>
            </Box>
            <Box className="dashboard-blog-user-like">
              <Typography className="dashboard-user-info-title">
                {blogDataMock.likesCount}
              </Typography>
              <Image
                priority
                src={Like}
                alt="like"
                width={20}
                className="dashboard-user-like-icon"
              />
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

export default Dashboard;
