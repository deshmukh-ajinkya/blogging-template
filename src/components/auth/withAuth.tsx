import { JwtPayload } from 'jsonwebtoken';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserId, setUserName } from '@/store/slice/blogSlice';
import { getToken } from '@/utils';
import Loading from '../loading/loading';

type WithAuthProps = {
  [key: string]: unknown;
};

const publicRoutes = ['/login', '/register', '/reset'];
const privateRoutes = ['/dashboard', '/insight', '/blog'];

const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some((route) => pathname === route);
};

const isPrivateRoute = (pathname: string): boolean => {
  return privateRoutes.some((route) => pathname === route) || pathname.startsWith('/dashboard/');
};

// Mock token validation logic
const verifyMockToken = (token: string): JwtPayload | null => {
  if (token === 'mocked_jwt_token_1234567890') {
    return {
      userId: 'mockUserId',
      name: 'Demo'
    }; // Mock payload
  }
  return null;
};

const withAuth = <P extends WithAuthProps>(
  WrappedComponent: React.ComponentType<P>
): React.FC<Omit<P, keyof WithAuthProps>> => {
  const HOC: React.FC<Omit<P, keyof WithAuthProps>> = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const dispatch = useDispatch();

    useEffect(() => {
      const token = getToken();
      const isTokenValid = token && verifyMockToken(token);

      if (isTokenValid) {
        dispatch(setUserId(isTokenValid.userId));
        dispatch(setUserName(isTokenValid.name));
      }

      if (!isTokenValid) {
        if (isPublicRoute(pathname)) {
          // Allow access to public routes
          setLoading(false);
        } else {
          // If trying to access private routes, redirect to login
          router.push('/login');
        }
      } else {
        if (isPrivateRoute(pathname)) {
          // Allow access to private routes
          setLoading(false);
        } else {
          // If trying to access public routes, redirect to dashboard
          router.push('/dashboard');
        }
      }
    }, [router, pathname, dispatch]);

    if (loading) {
      return <Loading />;
    }

    return <WrappedComponent {...(props as P)} />;
  };

  HOC.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return HOC;
};

export default withAuth;
