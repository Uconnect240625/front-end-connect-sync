
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';

const PostRoommateRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    requesterName: profile?.full_name || '',
    gender: '',
    budget: '',
    location: '',
    preferences: '',
    contactNumber: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.university_id) {
      toast({
        title: "Error",
        description: "Please complete your profile first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('roommate_requests')
        .insert({
          user_id: profile.id,
          university_id: profile.university_id,
          requester_name: formData.requesterName,
          gender: formData.gender,
          budget: parseFloat(formData.budget),
          location: formData.location,
          preferences: formData.preferences,
          contact_number: formData.contactNumber
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your roommate request has been submitted for approval.",
      });

      navigate('/pg-finder');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Failed to submit roommate request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-2xl mx-auto p-6 pt-20">
        <button
          onClick={() => navigate('/pg-finder')}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to PG Finder
        </button>

        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Users className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-card-foreground">Post Roommate Request</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="requesterName" className="text-card-foreground">👤 Full Name *</Label>
              <Input
                id="requesterName"
                value={formData.requesterName}
                onChange={(e) => setFormData({...formData, requesterName: e.target.value})}
                placeholder="Enter your full name"
                required
                className="mt-1 bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="gender" className="text-card-foreground">⚧ Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                <SelectTrigger className="mt-1 bg-background border-border text-foreground">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget" className="text-card-foreground">💰 Budget (₹/month) *</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                placeholder="e.g., 6000"
                required
                className="mt-1 bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-card-foreground">📍 Preferred Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Near Gate 1, Sector 125"
                required
                className="mt-1 bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="contactNumber" className="text-card-foreground">📞 Contact Number *</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                placeholder="Enter your contact number"
                required
                className="mt-1 bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="preferences" className="text-card-foreground">📝 Additional Preferences</Label>
              <Textarea
                id="preferences"
                value={formData.preferences}
                onChange={(e) => setFormData({...formData, preferences: e.target.value})}
                placeholder="e.g., Non-smoker, Vegetarian, Student preferred..."
                className="mt-1 min-h-[100px] bg-background border-border text-foreground"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Submitting...' : '🏠 Post Roommate Request'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostRoommateRequest;
