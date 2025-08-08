import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Schedule,
  LocationOn,
  People,
} from '@mui/icons-material';
import { api } from '../services/api';

interface Shift {
  _id: string;
  location: string;
  dayOfWeek: string;
  Time: string;
  hoursPerShift: number;
  maxWorkers: number;
  currentWorkers: number;
  status: string;
  notes?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
}

const ShiftManagement: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialog, setCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    hoursPerShift: 1,
    maxWorkers: 1,
    notes: '',
    isRecurring: false,
    recurringPattern: '',
  });

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/shift/available');
      setShifts((response.data as { shifts: Shift[] }).shifts);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch shifts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShift = async () => {
    try {
      const shiftData = {
        ...formData,
        startTime: new Date(`2000-01-01 ${formData.startTime}`),
        endTime: new Date(`2000-01-01 ${formData.endTime}`),
      };
      
      await api.post('/shift/makeShift', shiftData);
      setCreateDialog(false);
      setFormData({
        location: '',
        dayOfWeek: '',
        startTime: '',
        endTime: '',
        hoursPerShift: 1,
        maxWorkers: 1,
        notes: '',
        isRecurring: false,
        recurringPattern: '',
      });
      await fetchShifts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create shift');
    }
  };

  const handleDeleteShift = async (shiftId: string) => {
    try {
      await api.delete('/shift/delete', { data: { shiftId } } as any);
      await fetchShifts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete shift');
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Shift Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialog(true)}
        >
          Create Shift
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {shifts.map((shift) => (
          <Card key={shift._id} sx={{ minWidth: 300, flex: 1 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {shift.location}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {shift.dayOfWeek} • {shift.Time}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {shift.hoursPerShift} hours • {shift.currentWorkers}/{shift.maxWorkers} workers
                  </Typography>
                  {shift.notes && (
                    <Typography variant="body2" color="textSecondary">
                      {shift.notes}
                    </Typography>
                  )}
                  <Chip
                    label={shift.status}
                    color={shift.status === 'active' ? 'success' : 'default'}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteShift(shift._id)}
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Create Shift Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Shift</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Location"
              fullWidth
              value={formData.location}
              onChange={handleChange('location')}
            />
            <FormControl fullWidth>
              <InputLabel>Day of Week</InputLabel>
              <Select
                value={formData.dayOfWeek}
                label="Day of Week"
                onChange={(e) => setFormData(prev => ({ ...prev, dayOfWeek: e.target.value }))}
              >
                <MenuItem value="Monday">Monday</MenuItem>
                <MenuItem value="Tuesday">Tuesday</MenuItem>
                <MenuItem value="Wednesday">Wednesday</MenuItem>
                <MenuItem value="Thursday">Thursday</MenuItem>
                <MenuItem value="Friday">Friday</MenuItem>
                <MenuItem value="Saturday">Saturday</MenuItem>
                <MenuItem value="Sunday">Sunday</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Start Time</InputLabel>
              <Select
                value={formData.startTime}
                label="Start Time"
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              >
                <MenuItem value="6:00 AM">6:00 AM</MenuItem>
                <MenuItem value="7:00 AM">7:00 AM</MenuItem>
                <MenuItem value="8:00 AM">8:00 AM</MenuItem>
                <MenuItem value="9:00 AM">9:00 AM</MenuItem>
                <MenuItem value="10:00 AM">10:00 AM</MenuItem>
                <MenuItem value="11:00 AM">11:00 AM</MenuItem>
                <MenuItem value="12:00 PM">12:00 PM</MenuItem>
                <MenuItem value="1:00 PM">1:00 PM</MenuItem>
                <MenuItem value="2:00 PM">2:00 PM</MenuItem>
                <MenuItem value="3:00 PM">3:00 PM</MenuItem>
                <MenuItem value="4:00 PM">4:00 PM</MenuItem>
                <MenuItem value="5:00 PM">5:00 PM</MenuItem>
                <MenuItem value="6:00 PM">6:00 PM</MenuItem>
                <MenuItem value="7:00 PM">7:00 PM</MenuItem>
                <MenuItem value="8:00 PM">8:00 PM</MenuItem>
                <MenuItem value="9:00 PM">9:00 PM</MenuItem>
                <MenuItem value="10:00 PM">10:00 PM</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>End Time</InputLabel>
              <Select
                value={formData.endTime}
                label="End Time"
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              >
                <MenuItem value="6:00 AM">6:00 AM</MenuItem>
                <MenuItem value="7:00 AM">7:00 AM</MenuItem>
                <MenuItem value="8:00 AM">8:00 AM</MenuItem>
                <MenuItem value="9:00 AM">9:00 AM</MenuItem>
                <MenuItem value="10:00 AM">10:00 AM</MenuItem>
                <MenuItem value="11:00 AM">11:00 AM</MenuItem>
                <MenuItem value="12:00 PM">12:00 PM</MenuItem>
                <MenuItem value="1:00 PM">1:00 PM</MenuItem>
                <MenuItem value="2:00 PM">2:00 PM</MenuItem>
                <MenuItem value="3:00 PM">3:00 PM</MenuItem>
                <MenuItem value="4:00 PM">4:00 PM</MenuItem>
                <MenuItem value="5:00 PM">5:00 PM</MenuItem>
                <MenuItem value="6:00 PM">6:00 PM</MenuItem>
                <MenuItem value="7:00 PM">7:00 PM</MenuItem>
                <MenuItem value="8:00 PM">8:00 PM</MenuItem>
                <MenuItem value="9:00 PM">9:00 PM</MenuItem>
                <MenuItem value="10:00 PM">10:00 PM</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Hours per Shift"
              type="number"
              fullWidth
              value={formData.hoursPerShift}
              onChange={handleChange('hoursPerShift')}
            />
            <TextField
              label="Max Workers"
              type="number"
              fullWidth
              value={formData.maxWorkers}
              onChange={handleChange('maxWorkers')}
            />
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange('notes')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateShift} variant="contained">
            Create Shift
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShiftManagement; 