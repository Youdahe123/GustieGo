
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { LogOut, Search, Calendar, Clock, MapPin, Users, Coffee, CheckCircle, X, Check } from 'lucide-react';

interface ShiftRequest {
  id: string;
  studentId: string;
  shiftId: string;
  date: string;
  startTime: string;
  endTime: string;
  station: string;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: string;
  payRate: number;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState<ShiftRequest[]>([
    {
      id: '1',
      studentId: '1100830',
      shiftId: '1',
      date: '2024-07-12',
      startTime: '07:00',
      endTime: '11:00',
      station: 'Breakfast Counter',
      status: 'pending',
      requestedAt: '2024-07-09 14:30',
      payRate: 15.50
    },
    {
      id: '2',
      studentId: '1100831',
      shiftId: '2',
      date: '2024-07-12',
      startTime: '11:00',
      endTime: '15:00',
      station: 'Grill Station',
      status: 'approved',
      requestedAt: '2024-07-09 15:45',
      payRate: 16.00
    },
    {
      id: '3',
      studentId: '1100832',
      shiftId: '3',
      date: '2024-07-13',
      startTime: '15:00',
      endTime: '19:00',
      station: 'Salad Bar',
      status: 'pending',
      requestedAt: '2024-07-09 16:20',
      payRate: 15.50
    },
    {
      id: '4',
      studentId: '1100830',
      shiftId: '5',
      date: '2024-07-14',
      startTime: '08:00',
      endTime: '12:00',
      station: 'Coffee Bar',
      status: 'denied',
      requestedAt: '2024-07-09 17:10',
      payRate: 17.00
    }
  ]);

  const handleApproveRequest = (requestId: string) => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId
          ? { ...request, status: 'approved' as const }
          : request
      )
    );

    const request = requests.find(r => r.id === requestId);
    toast({
      title: "Request Approved",
      description: `Shift request for ${request?.studentId} has been approved.`,
    });
  };

  const handleDenyRequest = (requestId: string) => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId
          ? { ...request, status: 'denied' as const }
          : request
      )
    );

    const request = requests.find(r => r.id === requestId);
    toast({
      title: "Request Denied",
      description: `Shift request for ${request?.studentId} has been denied.`,
      variant: "destructive",
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

  const filteredRequests = requests.filter(request =>
    request.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.date.includes(searchTerm)
  );

  const pendingRequests = requests.filter(request => request.status === 'pending').length;
  const approvedRequests = requests.filter(request => request.status === 'approved').length;
  const deniedRequests = requests.filter(request => request.status === 'denied').length;

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
              <h1 className="text-xl font-bold text-gray-800">GustieGo Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin Dashboard</span>
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
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingRequests}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{approvedRequests}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Denied</p>
                  <p className="text-2xl font-bold text-red-600">{deniedRequests}</p>
                </div>
                <X className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student ID, station, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Shift Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Student ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Station</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Pay Rate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Requested</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium">{request.studentId}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(request.date)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{request.startTime} - {request.endTime}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{request.station}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-green-600">
                          ${request.payRate}/hr
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {request.requestedAt}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            request.status === 'pending' ? 'secondary' :
                            request.status === 'approved' ? 'default' :
                            'destructive'
                          }
                          className={
                            request.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {request.status === 'pending' ? 'Pending' :
                           request.status === 'approved' ? 'Approved' :
                           'Denied'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {request.status === 'pending' ? (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveRequest(request.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDenyRequest(request.id)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Deny
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {request.status === 'approved' ? 'Approved' : 'Denied'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredRequests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No shift requests found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
