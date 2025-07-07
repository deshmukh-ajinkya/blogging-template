'use client';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Button, TextField, IconButton, InputAdornment } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { SyntheticEvent, useState } from 'react';
import withAuth from '@/components/auth/withAuth';
import Logo from '../../../../public/icon.png';
import './style.css';

function Login(): React.ReactElement {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('userdemo@gmail.com');
  const [password, setPassword] = useState('123456');
  const route = useRouter();

  const handleLogin = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    // Mocking the login token
    const mockResponse = {
      data: {
        token: 'mocked_jwt_token_1234567890'
      }
    };

    const storedToken = mockResponse.data.token;
    if (storedToken) {
      localStorage.setItem('token', storedToken);
      route.push('/dashboard');
    }
  };

  return (
    <Box className="container" component="form" method="post" onSubmit={(e) => handleLogin(e)}>
      <Image src={Logo} alt="logo" className="logo" />

      <Box className="input-container">
        <TextField
          size="small"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
      </Box>

      <Box className="input-container">
        <TextField
          size="small"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                  {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <RemoveRedEyeIcon fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Link href={'/forget'} className="link">
        Forget Password
      </Link>

      <Button variant="contained" color="primary" size="medium" className="button" type="submit">
        Login
      </Button>

      <Link href={'/register'} className="link">
        Dont have an account? Register
      </Link>
    </Box>
  );
}

export default withAuth(Login);
