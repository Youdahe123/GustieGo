import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'Student' as 'Student' | 'Admin',
    isInternational: false,
    isActive: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
      } else {
        await register(formData);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              GustieGo
            </Typography>
            <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {!isLogin && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange('name')}
                  autoFocus
                />
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                value={formData.username}
                onChange={handleChange('username')}
                autoFocus={isLogin}
              />

              {!isLogin && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                />
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
              />

              {!isLogin && (
                <Box sx={{ mt: 1 }}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={formData.role}
                      label="Role"
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'Student' | 'Admin' }))}
                    >
                      <MenuItem value="Student">Student</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isInternational}
                        onChange={(e) => setFormData(prev => ({ ...prev, isInternational: e.target.checked }))}
                      />
                    }
                    label="International Student"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      />
                    }
                    label="Active Status"
                  />
                </Box>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>

              <Button
                fullWidth
                variant="text"
                onClick={() => setIsLogin(!isLogin)}
                sx={{ mt: 1 }}
              >
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login; 