import ReactImg from '../../public/react.png'; // Adjust if needed

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth(); // 0-indexed

function createDate(dayOffset: number): string {
  const date = new Date(currentYear, currentMonth, dayOffset);
  return date.toISOString();
}

export const blogData = [
  {
    id: '1',
    title: 'Getting Started with React 18',
    description: 'Learn the fundamentals of React 18 and set up your first project.',
    content:
      'React 18 introduces concurrent rendering, automatic batching, and more. This guide helps you understand the new features and how to configure your development environment from scratch.',
    bannerImg: ReactImg.src,
    author: {
      id: '1',
      name: 'Alice Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    category: 'news',
    likesCount: 84,
    createdAt: createDate(1),
    comments: [
      {
        authorID: { id: '2', name: 'David Kim' },
        content: 'Awesome intro to React 18!'
      },
      {
        authorID: { id: '3', name: 'Sandra Lee' },
        content: 'This helped me get started—thanks!'
      }
    ]
  },
  {
    id: '2',
    title: 'Building Reusable Components in React',
    description: 'Create modular and maintainable components in your React apps.',
    content:
      'Reusable components save time and reduce bugs. Learn best practices for creating component libraries, prop management, and styling techniques using Tailwind and styled-components.',
    bannerImg: ReactImg.src,
    author: {
      id: '2',
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/33.jpg'
    },
    category: 'technology',
    likesCount: 62,
    createdAt: createDate(5),
    comments: []
  },
  {
    id: '3',
    title: 'State Management in React: Context vs Redux',
    description: 'Understand when to use Context API and when to reach for Redux.',
    content:
      'Managing state efficiently is critical for app performance. This post explores the differences between React Context and Redux Toolkit, including pros, cons, and code examples.',
    bannerImg: ReactImg.src,
    author: {
      id: '3',
      name: 'Sandra Lee',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    category: 'news',
    likesCount: 91,
    createdAt: createDate(10),
    comments: []
  },
  {
    id: '4',
    title: 'React Performance Optimization Tips',
    description: 'Speed up your React app with these proven performance strategies.',
    content:
      'From memoization and lazy loading to avoiding unnecessary renders, this article walks through techniques to ensure your React application runs smoothly and efficiently.',
    bannerImg: ReactImg.src,
    author: {
      id: '4',
      name: 'Marcus Green',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
    },
    category: 'technology',
    likesCount: 127,
    createdAt: createDate(15),
    comments: []
  },
  {
    id: '5',
    title: 'Testing React Components with Jest and React Testing Library',
    description: 'Ensure reliability in your React app with robust testing practices.',
    content:
      'Learn how to write unit and integration tests using Jest and React Testing Library. This guide covers setting up tests, mocking, and writing effective assertions for complex components.',
    bannerImg: ReactImg.src,
    author: {
      id: '5',
      name: 'Elena Smith',
      avatar: 'https://randomuser.me/api/portraits/women/91.jpg'
    },
    category: 'technology',
    likesCount: 103,
    createdAt: createDate(20),
    comments: []
  }
];

export function getBlogs(): typeof blogData {
  return blogData;
}

export function addBlog(blog: (typeof blogData)[number]): void {
  blogData.push(blog);
}

export function updateBlog(updatedBlog: (typeof blogData)[number]): void {
  const index = blogData.findIndex((b) => b.id === updatedBlog.id);
  if (index !== -1) {
    blogData[index] = { ...blogData[index], ...updatedBlog };
  }
}

export function deleteBlog(id: string): void {
  const index = blogData.findIndex((b) => b.id === id);
  if (index !== -1) {
    blogData.splice(index, 1);
  }
}
