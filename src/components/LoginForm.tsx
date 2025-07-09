
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { User, Lock, Coffee } from 'lucide-react';

interface LoginFormProps {
  onLogin: (studentId: string, isAdmin?: boolean) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both Student ID and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      // Check for admin login
      if (studentId === 'admin' && password === 'admin') {
        toast({
          title: "Welcome Admin!",
          description: "Successfully logged in to admin dashboard",
        });
        onLogin(studentId, true);
      }
      // Mock authentication - accept any student ID with password "password"
      else if (password === 'password') {
        toast({
          title: "Welcome back!",
          description: `Successfully logged in as ${studentId}`,
        });
        onLogin(studentId, false);
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid Student ID or password.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">GustieGo</CardTitle>
          <CardDescription>Sign in to view and request shifts</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId" className="text-sm font-medium">Student ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="studentId"
                  type="text"
                  placeholder="Enter your Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-xs text-gray-500 text-center mt-4 space-y-1">
              <p>Demo: Use any Student ID with password "password"</p>
              <p>Admin: Use "admin" / "admin"</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
