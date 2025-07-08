import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PolicyAcceptance from '@/components/PolicyAcceptance';

export default function Auth() {
  const { signIn, signUp, user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<any[]>([]);
  const [showPolicyAcceptance, setShowPolicyAcceptance] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [universityId, setUniversityId] = useState('');

  useEffect(() => {
    // Check if user is authenticated and their policy acceptance status
    if (user && profile) {
      if (!profile.policies_accepted) {
        setShowPolicyAcceptance(true);
      } else {
        navigate('/uconnect');
      }
    }
  }, [user, profile, navigate]);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase.from('universities').select('*');
      if (error) {
        console.error('Error fetching universities:', error);
        toast({
          title: "Warning",
          description: "Could not load universities. Please refresh the page.",
          variant: "destructive"
        });
      } else {
        setUniversities(data || []);
      }
    } catch (err) {
      console.error('Universities fetch error:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login for:', loginEmail);
      const { error } = await signIn(loginEmail, loginPassword);
      
      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login Failed",
          description: error.message || "An error occurred during login",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully."
        });
        // Navigation will be handled by the useEffect above based on policy acceptance
      }
    } catch (err) {
      console.error('Login catch error:', err);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!fullName || !role || !universityId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting comprehensive signup with data:', {
        email: signupEmail,
        full_name: fullName,
        role,
        university_id: universityId
      });

      // Show progress feedback
      toast({
        title: "Creating Account...",
        description: "Please wait while we set up your profile.",
      });

      const { error } = await signUp(signupEmail, signupPassword, {
        full_name: fullName,
        role,
        university_id: universityId
      });
      
      if (error) {
        console.error('Comprehensive signup error details:', error);
        
        // Provide more specific error messages
        let errorMessage = error.message || "Failed to create account. Please try again.";
        
        if (error.message?.includes('Database error') || error.message?.includes('type') || error.message?.includes('user_role')) {
          errorMessage = "There was a database issue creating your profile. Our team has been notified. Please try again in a few minutes.";
        } else if (error.message?.includes('already registered')) {
          errorMessage = "An account with this email already exists. Please try logging in instead.";
        } else if (error.message?.includes('invalid email')) {
          errorMessage = "Please enter a valid email address.";
        } else if (error.message?.includes('weak password')) {
          errorMessage = "Password must be at least 6 characters long.";
        }
        
        toast({
          title: "Signup Failed",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        console.log('Comprehensive signup successful');
        toast({
          title: "Account Created!",
          description: "Your account has been created successfully. Please accept our policies to continue."
        });
        // Clear form
        setSignupEmail('');
        setSignupPassword('');
        setFullName('');
        setRole('');
        setUniversityId('');
        // Policy acceptance will be shown via useEffect when user state updates
      }
    } catch (err) {
      console.error('Signup comprehensive catch error:', err);
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  // Show policy acceptance page if user is authenticated but hasn't accepted policies
  if (showPolicyAcceptance && user && profile && !profile.policies_accepted) {
    return <PolicyAcceptance />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 light">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-900">
            <span className="px-2 mx-1 rounded">U</span>Connect
          </CardTitle>
          <p className="text-gray-600">Your Campus in One App</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-700">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-700">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name" className="text-gray-700">Full Name</Label>
                  <Input
                    id="full-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-700">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-700">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    placeholder="Choose a secure password (min 6 characters)"
                    minLength={6}
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-700">Role</Label>
                  <Select value={role} onValueChange={setRole} required>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      <SelectItem value="student" className="text-gray-900">Student</SelectItem>
                      <SelectItem value="admin" className="text-gray-900">Admin</SelectItem>
                      <SelectItem value="club" className="text-gray-900">Club</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university" className="text-gray-700">University</Label>
                  <Select value={universityId} onValueChange={setUniversityId} required>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="Select your university" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      {universities.map((uni) => (
                        <SelectItem key={uni.id} value={uni.id} className="text-gray-900">
                          {uni.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
