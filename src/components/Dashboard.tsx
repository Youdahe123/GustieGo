import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { LogOut, Search, Calendar, Clock, MapPin, Users, Coffee, CheckCircle } from 'lucide-react';

interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  station: string;
  maxWorkers: number;
  currentWorkers: number;
  status: 'available' | 'requested' | 'full';
  payRate: number;
}

interface DashboardProps {
  studentId: string;
  onLogout: () => void;
}

const Dashboard = ({ studentId, onLogout }: DashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: '1',
      date: '2024-07-12',
      startTime: '07:00',
      endTime: '11:00',
      station: 'Breakfast Counter',
      maxWorkers: 3,
      currentWorkers: 1,
      status: 'available',
      payRate: 15.50
    },
    {
      id: '2',
      date: '2024-07-12',
      startTime: '11:00',
      endTime: '15:00',
      station: 'Grill Station',
      maxWorkers: 2,
      currentWorkers: 0,
      status: 'available',
      payRate: 16.00
    },
    {
      id: '3',
      date: '2024-07-13',
      startTime: '15:00',
      endTime: '19:00',
      station: 'Salad Bar',
      maxWorkers: 2,
      currentWorkers: 1,
      status: 'available',
      payRate: 15.50
    },
    {
      id: '4',
      date: '2024-07-13',
      startTime: '12:00',
      endTime: '16:00',
      station: 'Pizza Station',
      maxWorkers: 2,
      currentWorkers: 2,
      status: 'full',
      payRate: 16.50
    },
    {
      id: '5',
      date: '2024-07-14',
      startTime: '08:00',
      endTime: '12:00',
      station: 'Coffee Bar',
      maxWorkers: 1,
      currentWorkers: 0,
      status: 'available',
      payRate: 17.00
    }
  ]);

  const handleRequestShift = (shiftId: string) => {
    setShifts(prevShifts =>
      prevShifts.map(shift =>
        shift.id === shiftId
          ? { ...shift, status: 'requested' as const }
          : shift
      )
    );

    const shift = shifts.find(s => s.id === shiftId);
    toast({
      title: "Shift Request Sent!",
      description: `Your request for ${shift?.station} on ${shift?.date} has been submitted.`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredShifts = shifts.filter(shift =>
    shift.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shift.date.includes(searchTerm)
  );

  const availableShifts = shifts.filter(shift => shift.status === 'available').length;
  const requestedShifts = shifts.filter(shift => shift.status === 'requested').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Coffee className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">GustieGo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {studentId}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Shifts</p>
                  <p className="text-2xl font-bold text-green-600">{availableShifts}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Your Requests</p>
                  <p className="text-2xl font-bold text-blue-600">{requestedShifts}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-purple-600">{shifts.length}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by station or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shifts Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Available Shifts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Station</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Workers</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Pay Rate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShifts.map((shift) => (
                    <tr key={shift.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{formatDate(shift.date)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{shift.startTime} - {shift.endTime}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{shift.station}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm">
                          {shift.currentWorkers}/{shift.maxWorkers}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-green-600">
                          ${shift.payRate}/hr
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            shift.status === 'available' ? 'default' :
                            shift.status === 'requested' ? 'secondary' :
                            'destructive'
                          }
                          className={
                            shift.status === 'available' ? 'bg-green-100 text-green-800' :
                            shift.status === 'requested' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {shift.status === 'available' ? 'Available' :
                           shift.status === 'requested' ? 'Requested' :
                           'Full'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {shift.status === 'available' ? (
                          <Button
                            size="sm"
                            onClick={() => handleRequestShift(shift.id)}
                            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                          >
                            Request Shift
                          </Button>
                        ) : shift.status === 'requested' ? (
                          <Button size="sm" variant="secondary" disabled>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Requested
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            Full
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredShifts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No shifts found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
