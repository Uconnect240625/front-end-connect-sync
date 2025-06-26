
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Complaint, ComplaintStatus } from '@/types/database';

interface ComplaintsManagerProps {
  complaints: Complaint[];
  onComplaintUpdate: () => void;
}

const ComplaintsManager = ({ complaints, onComplaintUpdate }: ComplaintsManagerProps) => {
  const [responses, setResponses] = React.useState<Record<string, string>>({});

  const handleStatusUpdate = async (complaintId: string, status: ComplaintStatus, response?: string) => {
    try {
      const updateData: any = { status };
      if (response) {
        updateData.admin_response = response;
      }

      const { error } = await supabase
        .from('complaints')
        .update(updateData)
        .eq('id', complaintId);

      if (error) throw error;

      toast.success('Complaint updated successfully');
      setResponses(prev => ({ ...prev, [complaintId]: '' }));
      onComplaintUpdate();
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint');
    }
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'pending': return 'destructive';
      case 'in_progress': return 'default';
      case 'resolved': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🚨</span>
          Complaints Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {complaints.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No complaints to review</p>
          ) : (
            complaints.map((complaint) => (
              <div key={complaint.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getStatusColor(complaint.status)}>
                        {complaint.status}
                      </Badge>
                      <Badge variant="outline">{complaint.category}</Badge>
                      <span className={`text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority} priority
                      </span>
                    </div>
                    <h4 className="font-semibold text-lg">{complaint.title}</h4>
                    <p className="text-gray-700 mt-2">{complaint.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Submitted: {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                    
                    {complaint.admin_response && (
                      <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-blue-800">Admin Response:</p>
                        <p className="text-sm text-blue-700">{complaint.admin_response}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {complaint.status !== 'resolved' && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add response (optional)"
                      value={responses[complaint.id] || ''}
                      onChange={(e) => setResponses(prev => ({ 
                        ...prev, 
                        [complaint.id]: e.target.value 
                      }))}
                      className="min-h-[80px]"
                    />
                    
                    <div className="flex gap-2">
                      {complaint.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(complaint.id, 'in_progress')}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          🔄 Start Working
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(
                          complaint.id, 
                          'resolved', 
                          responses[complaint.id]
                        )}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        ✅ Resolve
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplaintsManager;
