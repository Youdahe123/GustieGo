
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { LogOut, Search, Coffee, CheckCircle, X, Check, AlertTriangle, Users, Clock, Plus, Edit, Trash2, Calendar, Settings } from 'lucide-react';
import CalendarComponent from './Calendar';

interface Shift {
  id: string;
  location: string;
  day: string;
  timeSlot: string;
  hoursPerShift: number;
  maxWorkers: number;
  currentWorkers: number;
  status: 'active' | 'inactive' | 'cancelled';
  assignedStudents: string[];
  createdAt: string;
  isRecurring: boolean;
  recurringPattern?: string; // "weekly", "biweekly", "monthly"
  studentDetails?: Array<{
    id: string;
    name: string;
    email: string;
    claimedAt: string;
    status: 'claimed' | 'completed' | 'cancelled';
    notes?: string;
  }>;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const locations = ['Kitchen', 'Salad', 'Bakery', 'Wok', 'Pizza', 'Grill', 'Deli', 'Cashier', 'Rotisserie', 'Dishroom', 'Lunch Buffet', 'Courtyard', 'STEAMery'];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [isCreateShiftDialogOpen, setIsCreateShiftDialogOpen] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    name: string;
    absenceCount: number;
    givenAwayCount: number;
    currentShifts: number;
    totalHours: number;
    shifts: Array<{
      id: string;
      location: string;
      day: string;
      timeSlot: string;
      status: 'claimed' | 'completed' | 'cancelled';
      claimedAt: string;
      notes?: string;
    }>;
  } | null>(null);
  
  // TODO: Replace with API call to fetch shifts
  // API Endpoint: GET /available
  // TODO: Replace with API call to fetch shifts with student details
  // API Endpoint: GET /available?includeStudents=true
  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: '1',
      location: 'Kitchen',
      day: 'Monday',
      timeSlot: '7:00-11:00 AM',
      hoursPerShift: 4,
      maxWorkers: 3,
      currentWorkers: 1,
      status: 'active',
      assignedStudents: ['1100830'],
      createdAt: '2024-01-15',
      isRecurring: true,
      recurringPattern: 'weekly',
      // TODO: Replace with API call to get student details for this shift
      // API Endpoint: GET /analytics/student/{studentId}
      studentDetails: [
        {
          id: '1100830',
          name: 'John Doe',
          email: 'john.doe@gustie.edu',
          claimedAt: '2024-01-15 10:30',
          status: 'claimed',
          notes: 'Regular shift, no issues'
        }
      ]
    },
    {
      id: '2',
      location: 'Salad',
      day: 'Saturday',
      timeSlot: '12:00-4:00 PM',
      hoursPerShift: 4,
      maxWorkers: 2,
      currentWorkers: 2,
      status: 'active',
      assignedStudents: ['1100831', '1100832'],
      createdAt: '2024-01-10',
      isRecurring: false,
      // TODO: Replace with API call to get student details for this shift
      studentDetails: [
        {
          id: '1100831',
          name: 'Jane Smith',
          email: 'jane.smith@gustie.edu',
          claimedAt: '2024-01-10 09:15',
          status: 'claimed',
          notes: 'First time working salad station'
        },
        {
          id: '1100832',
          name: 'Mike Johnson',
          email: 'mike.johnson@gustie.edu',
          claimedAt: '2024-01-10 11:20',
          status: 'claimed',
          notes: 'Experienced with salad prep'
        }
      ]
    },
    {
      id: '3',
      location: 'Pizza',
      day: 'Friday',
      timeSlot: '3:00-7:00 PM',
      hoursPerShift: 4,
      maxWorkers: 2,
      currentWorkers: 0,
      status: 'active',
      assignedStudents: [],
      createdAt: '2024-01-12',
      isRecurring: true,
      recurringPattern: 'weekly',
      studentDetails: []
    },
    {
      id: '4',
      location: 'Courtyard',
      day: 'Sunday',
      timeSlot: '10:00 AM-2:00 PM',
      hoursPerShift: 4,
      maxWorkers: 3,
      currentWorkers: 1,
      status: 'cancelled',
      assignedStudents: ['1100830'],
      createdAt: '2024-01-08',
      isRecurring: false,
      studentDetails: [
        {
          id: '1100830',
          name: 'John Doe',
          email: 'john.doe@gustie.edu',
          claimedAt: '2024-01-08 16:45',
          status: 'cancelled',
          notes: 'Cancelled due to illness'
        }
      ]
    },
    {
      id: '5',
      location: 'Dishroom',
      day: 'Tuesday',
      timeSlot: '7:00-11:00 PM',
      hoursPerShift: 4,
      maxWorkers: 3,
      currentWorkers: 2,
      status: 'active',
      assignedStudents: ['1100833', '1100834'],
      createdAt: '2024-01-14',
      isRecurring: true,
      recurringPattern: 'weekly',
      studentDetails: [
        {
          id: '1100833',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@gustie.edu',
          claimedAt: '2024-01-14 14:30',
          status: 'claimed',
          notes: 'Prefers evening shifts'
        },
        {
          id: '1100834',
          name: 'David Brown',
          email: 'david.brown@gustie.edu',
          claimedAt: '2024-01-14 15:45',
          status: 'claimed',
          notes: 'New to dishroom, needs training'
        }
      ]
    }
  ]);

  // TODO: Replace with API call to create shift
  // API Endpoint: POST /makeShift
  const handleCreateShift = (shiftData: Partial<Shift>) => {
    const newShift: Shift = {
      id: Date.now().toString(),
      location: shiftData.location || 'Kitchen',
      day: shiftData.day || 'Monday',
      timeSlot: shiftData.timeSlot || '7:00-11:00 AM',
      hoursPerShift: shiftData.hoursPerShift || 4,
      maxWorkers: shiftData.maxWorkers || 2,
      currentWorkers: 0,
      status: 'active',
      assignedStudents: [],
      createdAt: new Date().toISOString().split('T')[0],
      isRecurring: shiftData.isRecurring || false,
      recurringPattern: shiftData.recurringPattern
    };

    setShifts(prev => [...prev, newShift]);
    toast({
      title: "Shift Created",
      description: `New shift created for ${newShift.location} on ${newShift.day}`,
    });
    setIsCreateShiftDialogOpen(false);
  };

  // TODO: Replace with API call to update shift status
  // API Endpoint: PUT /makeShift (update existing shift)
  const handleUpdateShiftStatus = (shiftId: string, newStatus: Shift['status']) => {
    setShifts(prevShifts =>
      prevShifts.map(shift =>
        shift.id === shiftId
          ? { ...shift, status: newStatus }
          : shift
      )
    );

    const shift = shifts.find(s => s.id === shiftId);
    toast({
      title: "Status Updated",
      description: `Shift status updated to ${newStatus}`,
    });
  };

  // TODO: Replace with API call to delete shift
  // API Endpoint: DELETE /makeShift/{shiftId}
  const handleDeleteShift = (shiftId: string) => {
    setShifts(prevShifts => prevShifts.filter(shift => shift.id !== shiftId));
    toast({
      title: "Shift Deleted",
      description: "Shift has been permanently deleted",
      variant: "destructive",
    });
  };

  // TODO: Replace with API call to search student analytics
  // API Endpoint: GET /analytics/student/{studentId}
  const handleStudentSearch = () => {
    if (!studentSearchTerm.trim()) return;
    
    // Mock student data - replace with actual API call
    const mockStudent = {
      id: '1100830',
      name: 'John Doe',
      absenceCount: 2,
      givenAwayCount: 3,
      currentShifts: 4,
      totalHours: 16,
      shifts: [
        {
          id: '1',
          location: 'Kitchen',
          day: 'Monday',
          timeSlot: '7:00-11:00 AM',
          status: 'claimed' as const,
          claimedAt: '2024-01-15 10:30',
          notes: 'Regular shift, no issues'
        },
        {
          id: '2',
          location: 'Salad',
          day: 'Wednesday',
          timeSlot: '11:00 AM-3:00 PM',
          status: 'completed' as const,
          claimedAt: '2024-01-10 09:15',
          notes: 'Completed successfully'
        },
        {
          id: '3',
          location: 'Pizza',
          day: 'Friday',
          timeSlot: '3:00-7:00 PM',
          status: 'claimed' as const,
          claimedAt: '2024-01-12 14:20'
        },
        {
          id: '4',
          location: 'Dishroom',
          day: 'Tuesday',
          timeSlot: '7:00-11:00 PM',
          status: 'cancelled' as const,
          claimedAt: '2024-01-08 16:45',
          notes: 'Cancelled due to illness'
        }
      ]
    };
    
    setSelectedStudent(mockStudent);
    toast({
      title: "Student Found",
      description: `Analytics for ${mockStudent.name} (${mockStudent.id})`,
    });
  };

  // Filter shifts
  const filteredShifts = shifts.filter(shift => {
    const matchesSearch = shift.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.day.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'All Locations' || shift.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  // Calculate stats
  const activeShifts = shifts.filter(shift => shift.status === 'active').length;
  const totalAssignedStudents = shifts.reduce((sum, shift) => sum + shift.assignedStudents.length, 0);
  const totalHours = shifts.reduce((sum, shift) => sum + (shift.hoursPerShift * shift.currentWorkers), 0);
  const recurringShifts = shifts.filter(shift => shift.isRecurring).length;

  // Group shifts by day
  const groupShiftsByDay = (shiftList: Shift[]) => {
    return shiftList.reduce((acc, shift) => {
      if (!acc[shift.day]) {
        acc[shift.day] = [];
      }
      acc[shift.day].push(shift);
      return acc;
    }, {} as Record<string, Shift[]>);
  };

  const renderShiftCard = (shift: Shift) => (
    <Card key={shift.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold">{shift.location}</h3>
              {shift.isRecurring && (
                <Badge variant="outline" className="text-xs">Recurring</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{shift.day} • {shift.timeSlot}</p>
            <p className="text-sm font-medium text-green-600">{shift.hoursPerShift} hrs</p>
            <p className="text-sm text-gray-500">
              Workers: {shift.currentWorkers}/{shift.maxWorkers}
            </p>
            <p className="text-xs text-gray-400">Created: {shift.createdAt}</p>
          </div>
          <Badge
            variant={
              shift.status === 'active' ? 'default' :
              shift.status === 'inactive' ? 'secondary' :
              'destructive'
            }
            className={
              shift.status === 'active' ? 'bg-green-100 text-green-800' :
              shift.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }
          >
            {shift.status === 'active' ? 'Active' :
             shift.status === 'inactive' ? 'Inactive' :
             'Cancelled'}
          </Badge>
        </div>
        
        <div className="flex space-x-2 mb-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleUpdateShiftStatus(shift.id, shift.status === 'active' ? 'inactive' : 'active')}
          >
            <Settings className="w-4 h-4 mr-1" />
            {shift.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteShift(shift.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>

        {/* Student Details Collapsible */}
        {shift.studentDetails && shift.studentDetails.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                View Students ({shift.studentDetails.length} assigned)
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="space-y-2">
                {shift.studentDetails.map((student) => (
                  <Card key={student.id} className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">{student.name}</h4>
                          <Badge
                            variant={
                              student.status === 'claimed' ? 'default' :
                              student.status === 'completed' ? 'secondary' :
                              'destructive'
                            }
                            className={
                              student.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                              student.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {student.status === 'claimed' ? 'Claimed' :
                             student.status === 'completed' ? 'Completed' :
                             'Cancelled'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{student.email}</p>
                        <p className="text-xs text-gray-500">Claimed: {student.claimedAt}</p>
                        {student.notes && (
                          <p className="text-xs text-gray-700 mt-1 italic">"{student.notes}"</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {(!shift.studentDetails || shift.studentDetails.length === 0) && (
          <div className="text-center py-2">
            <p className="text-sm text-gray-500">No students assigned to this shift</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderDayGroup = (day: string, shiftList: Shift[]) => (
    <div key={day} className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">{day}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shiftList.map(renderShiftCard)}
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
              <Button
                variant="ghost"
                className="p-0 h-auto hover:bg-transparent"
                onClick={() => window.location.href = '/'}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-white" />
                </div>
              </Button>
              <Button
                variant="ghost"
                className="p-0 h-auto text-xl font-bold text-gray-800 hover:text-gray-600 hover:bg-transparent"
                onClick={() => window.location.href = '/'}
              >
                GustieGo Admin
              </Button>
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
              <Dialog open={isCreateShiftDialogOpen} onOpenChange={setIsCreateShiftDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsCreateShiftDialogOpen(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Shift
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Shift</DialogTitle>
                  </DialogHeader>
                  <CreateShiftForm onSubmit={handleCreateShift} />
                </DialogContent>
              </Dialog>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('/calendar', '_blank')}
                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendar View
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
        {/* Student Analytics Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Student Analytics Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by student name or ID..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button onClick={handleStudentSearch} disabled={!studentSearchTerm.trim()}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              
              {selectedStudent && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {selectedStudent.absenceCount}
                        </div>
                        <div className="text-sm text-gray-600">Absences</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedStudent.givenAwayCount}
                        </div>
                        <div className="text-sm text-gray-600">Shifts Given Away</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedStudent.currentShifts}
                        </div>
                        <div className="text-sm text-gray-600">Current Shifts</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedStudent.totalHours}
                        </div>
                        <div className="text-sm text-gray-600">Total Hours</div>
                      </div>
                    </CardContent>
                                     </Card>
                 </div>
               )}
               
               {/* Shift Details Collapsible */}
               {selectedStudent && selectedStudent.shifts.length > 0 && (
                 <Collapsible className="mt-4">
                   <CollapsibleTrigger asChild>
                     <Button variant="outline" className="w-full">
                       <Users className="w-4 h-4 mr-2" />
                       View Shift Details ({selectedStudent.shifts.length} shifts)
                     </Button>
                   </CollapsibleTrigger>
                   <CollapsibleContent className="mt-4">
                     <div className="space-y-3">
                       {selectedStudent.shifts.map((shift) => (
                         <Card key={shift.id} className="p-4">
                           <div className="flex justify-between items-start">
                             <div className="flex-1">
                               <div className="flex items-center space-x-2 mb-2">
                                 <h4 className="font-semibold">{shift.location}</h4>
                                 <Badge
                                   variant={
                                     shift.status === 'claimed' ? 'default' :
                                     shift.status === 'completed' ? 'secondary' :
                                     'destructive'
                                   }
                                   className={
                                     shift.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                                     shift.status === 'completed' ? 'bg-green-100 text-green-800' :
                                     'bg-red-100 text-red-800'
                                   }
                                 >
                                   {shift.status === 'claimed' ? 'Claimed' :
                                    shift.status === 'completed' ? 'Completed' :
                                    'Cancelled'}
                                 </Badge>
                               </div>
                               <p className="text-sm text-gray-600">{shift.day} • {shift.timeSlot}</p>
                               <p className="text-xs text-gray-500">Claimed: {shift.claimedAt}</p>
                               {shift.notes && (
                                 <p className="text-sm text-gray-700 mt-2 italic">"{shift.notes}"</p>
                               )}
                             </div>
                           </div>
                         </Card>
                       ))}
                     </div>
                   </CollapsibleContent>
                 </Collapsible>
               )}
             </div>
           </CardContent>
         </Card>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by location or day..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Shift Management Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Shifts</TabsTrigger>
            <TabsTrigger value="active">Active Shifts</TabsTrigger>
            <TabsTrigger value="recurring">Recurring Shifts</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="space-y-6">
              {Object.entries(groupShiftsByDay(filteredShifts)).map(([day, shiftList]) =>
                renderDayGroup(day, shiftList)
              )}
              {filteredShifts.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No shifts found matching your search and filters.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="mt-6">
            <div className="space-y-6">
              {Object.entries(groupShiftsByDay(filteredShifts.filter(s => s.status === 'active'))).map(([day, shiftList]) =>
                renderDayGroup(day, shiftList)
              )}
              {filteredShifts.filter(s => s.status === 'active').length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No active shifts found.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recurring" className="mt-6">
            <div className="space-y-6">
              {Object.entries(groupShiftsByDay(filteredShifts.filter(s => s.isRecurring))).map(([day, shiftList]) =>
                renderDayGroup(day, shiftList)
              )}
              {filteredShifts.filter(s => s.isRecurring).length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No recurring shifts found.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-6">
            <CalendarComponent requests={shifts.map(shift => ({
              id: shift.id,
              studentId: shift.assignedStudents.join(', ') || 'Unassigned',
              location: shift.location,
              day: shift.day,
              shiftType: ['Saturday', 'Sunday'].includes(shift.day) ? 'weekend' : 'weekday',
              timeSlot: shift.timeSlot,
              hoursPerWeek: shift.hoursPerShift,
              status: shift.status === 'active' ? 'approved' : 'denied',
              requestedAt: shift.createdAt,
              isInternational: false,
              isAbsence: false
            }))} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Create Shift Form Component
const CreateShiftForm = ({ onSubmit }: { onSubmit: (data: Partial<Shift>) => void }) => {
  const [formData, setFormData] = useState({
    location: 'Kitchen',
    day: 'Monday',
    timeSlot: '7:00-11:00 AM',
    hoursPerShift: 4,
    maxWorkers: 2,
    isRecurring: false,
    recurringPattern: 'weekly',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['Kitchen', 'Salad', 'Bakery', 'Wok', 'Pizza', 'Grill', 'Deli', 'Cashier', 'Rotisserie', 'Dishroom', 'Lunch Buffet', 'Courtyard', 'STEAMery'].map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="day">Day</Label>
          <Select value={formData.day} onValueChange={(value) => setFormData(prev => ({ ...prev, day: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <SelectItem key={day} value={day}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="timeSlot">Time Slot</Label>
          <Select value={formData.timeSlot} onValueChange={(value) => setFormData(prev => ({ ...prev, timeSlot: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['6:00-10:00 AM', '7:00-11:00 AM', '8:00-12:00 PM', '10:00 AM-2:00 PM', '12:00-4:00 PM', '3:00-7:00 PM', '4:00-8:00 PM', '7:00-11:00 PM'].map(time => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="hoursPerShift">Hours per Shift</Label>
          <Input
            type="number"
            value={formData.hoursPerShift}
            onChange={(e) => setFormData(prev => ({ ...prev, hoursPerShift: parseInt(e.target.value) }))}
            min="1"
            max="8"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maxWorkers">Max Workers</Label>
          <Input
            type="number"
            value={formData.maxWorkers}
            onChange={(e) => setFormData(prev => ({ ...prev, maxWorkers: parseInt(e.target.value) }))}
            min="1"
            max="10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isRecurring"
            checked={formData.isRecurring}
            onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
          />
          <Label htmlFor="isRecurring">Recurring Shift</Label>
        </div>
      </div>
      
      {formData.isRecurring && (
        <div>
          <Label htmlFor="recurringPattern">Recurring Pattern</Label>
          <Select value={formData.recurringPattern} onValueChange={(value) => setFormData(prev => ({ ...prev, recurringPattern: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any special instructions or notes for this shift..."
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Create Shift
        </Button>
      </div>
    </form>
  );
};

export default AdminDashboard;
