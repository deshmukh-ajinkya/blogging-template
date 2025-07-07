'use client';
import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { blogData } from '@/mock/blogData';
import { RootState } from '@/store/store';
import './style.css';

dayjs.extend(customParseFormat);

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const getDefaultFromDate = (): string => {
  const now = new Date();
  return formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
};

const getDefaultToDate = (): string => formatDate(new Date());

const generateBarChartData = (blogData: any[]) => ({
  labels: blogData.map((post: { title: string }) =>
    post.title.length > 15 ? `${post.title.slice(0, 15)}...` : post.title
  ) || ['No Data'],
  datasets: [
    {
      label: 'Count',
      data: blogData.map((post: { likesCount: any }) => post.likesCount) || [0],
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 0.5,
      barThickness: 50
    }
  ]
});

const generateDoughnutChartData = (likesByCategory: any[]) =>
  likesByCategory.length
    ? {
        labels: likesByCategory.map((c: { category: string }) =>
          c.category.length > 12 ? `${c.category.slice(0, 12)}...` : c.category
        ),
        datasets: [
          {
            label: 'Likes by Category',
            data: likesByCategory.map((c: { totalLikes: any }) => c.totalLikes),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }
        ]
      }
    : {
        labels: ['No Data'],
        datasets: [
          {
            label: 'Likes by Category',
            data: [1],
            backgroundColor: ['#d3d3d3'],
            hoverBackgroundColor: ['#a9a9a9']
          }
        ]
      };

function Insight(): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    blogData: [] as typeof blogData,
    likesByCategory: [] as { category: string; totalLikes: number }[]
  });

  const [fromDate, setFromDate] = useState<string>(getDefaultFromDate());
  const [toDate, setToDate] = useState<string>(getDefaultToDate());
  const userId = useSelector((state: RootState) => state.blog.userId);

  const parseToDayjs = (dateStr: string): Dayjs => dayjs(dateStr, 'DD-MM-YYYY');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const from = parseToDayjs(fromDate);
      const to = parseToDayjs(toDate);

      const filteredBlogData = blogData.filter((post) => {
        const created = dayjs(post.createdAt);
        return created.isAfter(from.subtract(1, 'day')) && created.isBefore(to.add(1, 'day'));
      });

      const categoryMap = filteredBlogData.reduce(
        (acc, post) => {
          const category = post.category || 'Other';
          acc[category] = (acc[category] || 0) + post.likesCount;
          return acc;
        },
        {} as Record<string, number>
      );

      const dynamicLikesByCategory = Object.entries(categoryMap).map(([category, totalLikes]) => ({
        category,
        totalLikes
      }));

      setData({
        blogData: filteredBlogData,
        likesByCategory: dynamicLikesByCategory
      });

      setLoading(false);
    }, 200);
  }, [fromDate, toDate, userId]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex;
            return data.blogData[index]?.title || '';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (val: string | number) => (typeof val === 'number' && val % 1 === 0 ? val : '')
        }
      }
    }
  };

  const dounotOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const label = context.chart.data.labels[index] || '';
            const value = context.dataset.data[index] || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  return (
    <Box className="insight-root-container">
      <Box className="date-container">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField
            size="small"
            className="select-date"
            label="Start Date"
            variant="standard"
            format="DD-MM-YYYY"
            value={parseToDayjs(fromDate)}
            onChange={(date) => setFromDate(date?.format('DD-MM-YYYY') || '')}
          />
          <DateField
            size="small"
            className="select-date"
            label="End Date"
            variant="standard"
            format="DD-MM-YYYY"
            value={parseToDayjs(toDate)}
            onChange={(date) => setToDate(date?.format('DD-MM-YYYY') || '')}
          />
        </LocalizationProvider>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box className="like-chart-container">
            <Typography color="primary" variant="h6">
              Trends
            </Typography>
            <Box className="liked-chart">
              <Doughnut
                data={generateDoughnutChartData(data.likesByCategory)}
                options={dounotOptions}
              />
            </Box>
          </Box>

          <Box className="post-overview-container">
            <Typography color="primary" variant="h6">
              Post Overview
            </Typography>
            <TableContainer className="table-container">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                    <TableCell align="right">Likes</TableCell>
                    <TableCell align="right">Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.blogData.length ? (
                    data.blogData.map((row) => (
                      <TableRow key={row.title}>
                        <Tooltip title={row.title}>
                          <TableCell
                            sx={{
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                            {row.title}
                          </TableCell>
                        </Tooltip>
                        <TableCell align="right">{row.likesCount}</TableCell>
                        <TableCell align="right">{row.createdAt}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No Data Available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box className="graph-container">
            <Typography color="primary" variant="h6">
              Most Liked Blog
            </Typography>
            <Box className="most-liked-graph">
              <Bar data={generateBarChartData(data.blogData)} options={chartOptions} />
            </Box>
            <Typography color="primary" variant="h6" className="count-title">
              Visitors
            </Typography>
            <Box className="count-graph">
              <Bar data={generateBarChartData(data.blogData)} options={chartOptions} />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default Insight;
