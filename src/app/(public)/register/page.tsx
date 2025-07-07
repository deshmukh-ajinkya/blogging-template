'use client';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Button, TextField, IconButton, InputAdornment } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import withAuth from '@/components/auth/withAuth';
import Logo from '../../../../public/icon.png';
import './style.css';

// Simulated mock database
const mockUsers: Array<{ name: string; email: string; password: string }> = [];

function Register(): React.ReactElement {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateFields = (): boolean => {
    let valid = true;

    if (!name) {
      setNameError('Full name is required.');
      valid = false;
    } else {
      setNameError('');
    }

    if (!email) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleRegister = (): void => {
    if (!validateFields()) return;

    const alreadyExists = mockUsers.find((user) => user.email === email);

    if (alreadyExists) {
      setErrorMessage('User already exists with this email.');
      setSuccessMessage('');
    } else {
      mockUsers.push({ name, email, password });
      setSuccessMessage('User registered successfully!');
      setErrorMessage('');
      setName('');
      setEmail('');
      setPassword('');
    }
  };

  const handleClickShowPassword = (): void => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box className="register-container">
      <Image src={Logo} alt="logo" className="register-logo" />

      <Box className="input-container">
        <TextField
          size="small"
          placeholder="Full Name"
          value={name}
          error={Boolean(nameError)}
          label={nameError}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </Box>

      <Box className="input-container">
        <TextField
          size="small"
          placeholder="Email"
          value={email}
          error={Boolean(emailError)}
          label={emailError}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
      </Box>

      <Box className="input-container">
        <TextField
          size="small"
          placeholder="Password"
          value={password}
          error={Boolean(passwordError)}
          label={passwordError}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
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

      <Button
        variant="contained"
        color="primary"
        size="medium"
        className="register-button"
        onClick={handleRegister}>
        Register
      </Button>

      {successMessage && <p style={{ color: '#008ae6', marginTop: 8 }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red', marginTop: 8 }}>{errorMessage}</p>}

      <Link href="/login" className="register-link">
        Already have an account? Login
      </Link>
    </Box>
  );
}

export default withAuth(Register);
