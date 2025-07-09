
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { LogOut, Search, Coffee, CheckCircle, X, Check, AlertTriangle, Users, Clock, Plus, Edit, Trash2 } from 'lucide-react';

interface ShiftRequest {
  id: string;
  studentId: string;
  location: string;
  day: string;
  shiftType: 'weekday' | 'weekend';
  timeSlot: string;
  hoursPerWeek: number;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: string;
  isInternational?: boolean;
  isAbsence?: boolean;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const locations = ['Kitchen', 'Salad', 'Bakery', 'Wok', 'Pizza', 'Grill', 'Deli', 'Cashier', 'Rotisserie', 'Dishroom', 'Lunch Buffet', 'Courtyard', 'STEAMery'];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  
  const [requests, setRequests] = useState<ShiftRequest[]>([
    {
      id: '1',
      studentId: '1100830',
      location: 'Kitchen',
      day: 'Monday',
      shiftType: 'weekday',
      timeSlot: '7:00-11:00 AM',
      hoursPerWeek: 4,
      status: 'pending',
      requestedAt: '2024-07-09 14:30',
      isInternational: true
    },
    {
      id: '2',
      studentId: '1100831',
      location: 'Salad',
      day: 'Saturday',
      shiftType: 'weekend',
      timeSlot: '12:00-4:00 PM',
      hoursPerWeek: 4,
      status: 'approved',
      requestedAt: '2024-07-09 15:45'
    },
    {
      id: '3',
      studentId: '1100832',
      location: 'Pizza',
      day: 'Friday',
      shiftType: 'weekday',
      timeSlot: '3:00-7:00 PM',
      hoursPerWeek: 4,
      status: 'pending',
      requestedAt: '2024-07-09 16:20'
    },
    {
      id: '4',
      studentId: '1100830',
      location: 'Courtyard',
      day: 'Sunday',
      shiftType: 'weekend',
      timeSlot: '10:00 AM-2:00 PM',
      hoursPerWeek: 4,
      status: 'denied',
      requestedAt: '2024-07-09 17:10',
      isInternational: true
    },
    {
      id: '5',
      studentId: '1100833',
      location: 'Dishroom',
      day: 'Tuesday',
      shiftType: 'weekday',
      timeSlot: '7:00-11:00 PM',
      hoursPerWeek: 4,
      status: 'approved',
      requestedAt: '2024-07-09 18:00',
      isAbsence: true
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
      description: `Shift request for ${request?.studentId} at ${request?.location} on ${request?.day} has been approved.`,
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
      description: `Shift request for ${request?.studentId} at ${request?.location} on ${request?.day} has been denied.`,
      variant: "destructive",
    });
  };

  const handleCreateBulkShifts = () => {
    toast({
      title: "Bulk Shifts Creation",
      description: "Bulk shift creation dialog would open here.",
    });
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'All Locations' || request.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  // Calculate student hours and alerts
  const studentHours = new Map<string, { total: number, isInternational: boolean, missingWeekend: boolean }>();
  
  requests.filter(r => r.status === 'approved').forEach(request => {
    const current = studentHours.get(request.studentId) || { total: 0, isInternational: false, missingWeekend: true };
    const hasWeekendShift = requests.some(r => 
      r.studentId === request.studentId && 
      r.shiftType === 'weekend' && 
      r.status === 'approved'
    );
    
    studentHours.set(request.studentId, {
      total: current.total + request.hoursPerWeek,
      isInternational: request.isInternational || current.isInternational,
      missingWeekend: !hasWeekendShift
    });
  });

  const internationalOvertime = Array.from(studentHours.entries())
    .filter(([_, data]) => data.isInternational && data.total > 20);
  
  const missingWeekendStudents = Array.from(studentHours.entries())
    .filter(([_, data]) => data.missingWeekend);

  const pendingRequests = requests.filter(request => request.status === 'pending').length;
  const approvedRequests = requests.filter(request => request.status === 'approved').length;
  const deniedRequests = requests.filter(request => request.status === 'denied').length;
  const absenceRequests = requests.filter(request => request.isAbsence).length;

  // Group requests by day
  const groupRequestsByDay = (requestList: ShiftRequest[]) => {
    return requestList.reduce((acc, request) => {
      if (!acc[request.day]) {
        acc[request.day] = [];
      }
      acc[request.day].push(request);
      return acc;
    }, {} as Record<string, ShiftRequest[]>);
  };

  const weekdayRequests = filteredRequests.filter(r => r.shiftType === 'weekday');
  const weekendRequests = filteredRequests.filter(r => r.shiftType === 'weekend');

  const renderRequestCard = (request: ShiftRequest) => (
    <Card key={request.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold">{request.studentId}</h3>
              {request.isInternational && (
                <Badge variant="outline" className="text-xs">International</Badge>
              )}
              {request.isAbsence && (
                <Badge variant="destructive" className="text-xs">Absence</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{request.location}</p>
            <p className="text-sm text-gray-500">{request.day} • {request.timeSlot}</p>
            <p className="text-sm font-medium text-green-600">{request.hoursPerWeek} hrs</p>
            <p className="text-xs text-gray-400">Requested: {request.requestedAt}</p>
          </div>
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
        </div>
        
        {request.status === 'pending' && (
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
        )}
      </CardContent>
    </Card>
  );

  const renderDayGroup = (day: string, requestList: ShiftRequest[]) => (
    <div key={day} className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">{day}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requestList.map(renderRequestCard)}
      </div>
    </div>
  );

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
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Locations">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreateBulkShifts} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Shifts
              </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
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

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absences</p>
                  <p className="text-2xl font-bold text-red-600">{absenceRequests}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`hover:shadow-md transition-shadow ${internationalOvertime.length > 0 ? 'border-red-200 bg-red-50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Int'l Overtime</p>
                  <p className={`text-2xl font-bold ${internationalOvertime.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {internationalOvertime.length}
                  </p>
                </div>
                <AlertTriangle className={`w-8 h-8 ${internationalOvertime.length > 0 ? 'text-red-500' : 'text-green-500'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {(internationalOvertime.length > 0 || missingWeekendStudents.length > 0) && (
          <div className="space-y-4 mb-6">
            {internationalOvertime.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-red-800 font-medium">International Student Hour Alert</p>
                      <p className="text-red-700 text-sm">
                        {internationalOvertime.map(([studentId, data]) => 
                          `${studentId} (${data.total}h)`
                        ).join(', ')} working over 20 hours/week
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {missingWeekendStudents.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-orange-800 font-medium">Missing Weekend Shift Alert</p>
                      <p className="text-orange-700 text-sm">
                        {missingWeekendStudents.map(([studentId]) => studentId).join(', ')} missing weekend shifts
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student ID or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Request Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="weekday">Weekday Shifts</TabsTrigger>
            <TabsTrigger value="weekend">Weekend Shifts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="space-y-6">
              {Object.entries(groupRequestsByDay(filteredRequests)).map(([day, requestList]) =>
                renderDayGroup(day, requestList)
              )}
              {filteredRequests.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No requests found matching your search and filters.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="weekday" className="mt-6">
            <div className="space-y-6">
              {Object.entries(groupRequestsByDay(weekdayRequests)).map(([day, requestList]) =>
                renderDayGroup(day, requestList)
              )}
              {weekdayRequests.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No weekday requests found.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="weekend" className="mt-6">
            <div className="space-y-6">
              {Object.entries(groupRequestsByDay(weekendRequests)).map(([day, requestList]) =>
                renderDayGroup(day, requestList)
              )}
              {weekendRequests.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No weekend requests found.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
