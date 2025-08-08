import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Search } from '@mui/icons-material';
import { api } from '../services/api';

interface StudentAnalytics {
  studentId: string;
  name: string;
  email: string;
  analytics: {
    total: number;
    completed: number;
    current: number;
    missed: number;
    attendanceRate: number;
  };
}

const Analytics: React.FC = () => {
  const [students, setStudents] = useState<StudentAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // This would be implemented in your backend
      // For now, using mock data
      setStudents([
        {
          studentId: '1',
          name: 'John Doe',
          email: 'john@example.com',
          analytics: {
            total: 15,
            completed: 12,
            current: 2,
            missed: 1,
            attendanceRate: 80,
          },
        },
        {
          studentId: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          analytics: {
            total: 20,
            completed: 18,
            current: 1,
            missed: 1,
            attendanceRate: 90,
          },
        },
      ]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = [
    { name: 'Completed', value: students.reduce((sum, s) => sum + s.analytics.completed, 0) },
    { name: 'Current', value: students.reduce((sum, s) => sum + s.analytics.current, 0) },
    { name: 'Missed', value: students.reduce((sum, s) => sum + s.analytics.missed, 0) },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

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
        Analytics Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search students"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: <Search />,
          }}
        />
      </Box>

      {/* Charts */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Shift Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Attendance Rates
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredStudents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="analytics.attendanceRate" fill="#8884d8" name="Attendance Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Student Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Student Analytics
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Total Shifts</TableCell>
                  <TableCell align="right">Completed</TableCell>
                  <TableCell align="right">Current</TableCell>
                  <TableCell align="right">Missed</TableCell>
                  <TableCell align="right">Attendance Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell align="right">{student.analytics.total}</TableCell>
                    <TableCell align="right">{student.analytics.completed}</TableCell>
                    <TableCell align="right">{student.analytics.current}</TableCell>
                    <TableCell align="right">{student.analytics.missed}</TableCell>
                    <TableCell align="right">{student.analytics.attendanceRate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Analytics; 