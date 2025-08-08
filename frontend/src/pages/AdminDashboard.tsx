import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People,
  Schedule,
  Analytics,
  Add,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface DashboardStats {
  totalShifts: number;
  activeShifts: number;
  totalStudents: number;
  activeStudents: number;
  completedShifts: number;
  pendingShifts: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // This would be implemented in your backend
      // For now, using mock data
      setStats({
        totalShifts: 45,
        activeShifts: 32,
        totalStudents: 120,
        activeStudents: 98,
        completedShifts: 156,
        pendingShifts: 8,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Quick Actions */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/shifts')}
          >
            Create Shift
          </Button>
          <Button
            variant="outlined"
            startIcon={<Analytics />}
            onClick={() => navigate('/analytics')}
          >
            View Analytics
          </Button>
          <Button
            variant="outlined"
            startIcon={<Schedule />}
            onClick={() => navigate('/calendar')}
          >
            Calendar View
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Shifts
                </Typography>
                <Typography variant="h4">
                  {stats?.totalShifts}
                </Typography>
              </Box>
              <Schedule color="primary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Active Shifts
                </Typography>
                <Typography variant="h4">
                  {stats?.activeShifts}
                </Typography>
              </Box>
              <TrendingUp color="success" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Students
                </Typography>
                <Typography variant="h4">
                  {stats?.totalStudents}
                </Typography>
              </Box>
              <People color="primary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Pending Shifts
                </Typography>
                <Typography variant="h4">
                  {stats?.pendingShifts}
                </Typography>
              </Box>
              <Warning color="warning" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Activity */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Card>
          <CardContent>
            <Typography color="textSecondary">
              No recent activity to display
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 