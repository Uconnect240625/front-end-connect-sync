
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';

const HelpCenter = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    screenshot: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      toast.error('Please log in to submit a complaint');
      return;
    }

    if (!formData.title || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('complaints')
        .insert({
          user_id: profile.id,
          university_id: profile.university_id,
          title: formData.title,
          category: formData.category,
          description: formData.description,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Complaint submitted successfully! Our admin team will review it soon.');
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        screenshot: null
      });

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
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/uconnect')}
                className="text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft size={20} />
                Back to U Connect
              </Button>
            </div>
            <CardTitle className="text-center text-3xl font-bold text-red-600">
              🚨 Help Centre
            </CardTitle>
            <p className="text-center text-gray-600">
              Submit your issues and complaints here
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  📌 Issue Title *
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Short descriptive title"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  📂 Issue Category *
                </label>
                <Input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="e.g., Bug, UI, Suggestion, Hostel, Academics"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  📝 Description *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Explain the issue in detail..."
                  rows={4}
                  required
                  className="w-full resize-vertical"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  📎 Upload Screenshot (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                  />
                  <Upload size={20} className="text-gray-400" />
                </div>
                {formData.screenshot && (
                  <p className="text-sm text-green-600 mt-1">
                    File selected: {formData.screenshot.name}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </div>
                ) : (
                  '✅ Submit Issue'
                )}
              </Button>
            </form>

            {!profile && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-center">
                  Please log in to submit a complaint
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;
