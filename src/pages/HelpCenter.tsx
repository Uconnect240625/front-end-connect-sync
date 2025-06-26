
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload } from 'lucide-react';

const HelpCenter = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    issueCategory: '',
    issueTitle: '',
    description: '',
    screenshot: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast.error('Please log in to submit a complaint');
      return;
    }

    if (!formData.studentName || !formData.issueCategory || !formData.issueTitle || !formData.description) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('complaints')
        .insert({
          user_id: user.id,
          university_id: profile.university_id,
          title: formData.issueTitle,
          category: formData.issueCategory,
          description: formData.description,
          status: 'open'
        });

      if (error) throw error;

      toast.success('✅ Issue submitted successfully! We will review your complaint and get back to you soon.');
      
      // Reset form
      setFormData({
        studentName: '',
        issueCategory: '',
        issueTitle: '',
        description: '',
        screenshot: null
      });
      
      // Clear file input
      const fileInput = document.getElementById('screenshot') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, screenshot: file }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/uconnect')}
                className="text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to U Connect
              </Button>
            </div>
            <CardTitle className="text-3xl font-bold text-center text-red-600">
              🚨 Help Centre
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="studentName">👤 Student Name *</Label>
                <Input
                  id="studentName"
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueCategory">📂 Issue Category *</Label>
                <Input
                  id="issueCategory"
                  type="text"
                  value={formData.issueCategory}
                  onChange={(e) => handleInputChange('issueCategory', e.target.value)}
                  placeholder="e.g., Bug, UI, Suggestion, Technical Issue"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueTitle">📌 Issue Title *</Label>
                <Input
                  id="issueTitle"
                  type="text"
                  value={formData.issueTitle}
                  onChange={(e) => handleInputChange('issueTitle', e.target.value)}
                  placeholder="Short descriptive title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">📝 Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Explain the issue in detail..."
                  rows={4}
                  className="resize-vertical"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="screenshot">📎 Upload Screenshot (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <Upload className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                disabled={loading}
              >
                {loading ? 'Submitting...' : '✅ Submit Issue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;
