
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Navigation from '@/components/Navigation';

const HelpCenter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: profile?.full_name || '',
    category: '',
    title: '',
    description: '',
    screenshot: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.university_id) {
      toast({
        title: "Error",
        description: "Please log in to submit a complaint",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('complaints')
        .insert({
          student_name: formData.studentName,
          category: formData.category,
          title: formData.title,
          description: formData.description,
          university_id: profile.university_id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your complaint has been submitted successfully",
      });

      setFormData({
        studentName: profile?.full_name || '',
        category: '',
        title: '',
        description: '',
        screenshot: null
      });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast({
        title: "Error",
        description: "Failed to submit complaint",
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
          onClick={() => navigate('/uconnect')}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to U Connect
        </button>

        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          <div className="flex items-center justify-center gap-2 mb-6">
            <AlertCircle className="text-red-600" size={28} />
            <h1 className="text-2xl font-bold text-card-foreground">Help Centre</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="studentName" className="text-card-foreground">👤 Student Name *</Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                placeholder="Enter your name"
                required
                className="mt-1 bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-card-foreground">📂 Issue Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g., Bug, UI, Suggestion, Technical Issue"
                required
                className="mt-1 bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="title" className="text-card-foreground">📌 Issue Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Short descriptive title"
                required
                className="mt-1 bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-card-foreground">📝 Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Explain the issue in detail..."
                required
                className="mt-1 min-h-[120px] bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="screenshot" className="text-card-foreground">📎 Upload Screenshot (Optional)</Label>
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, screenshot: e.target.files?.[0] || null})}
                className="mt-1 bg-background border-border text-foreground"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Accepted formats: Images, PDF, Word documents
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Submitting...' : '✅ Submit Issue'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
