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

      const statusMessages = {
        'in_progress': 'Complaint marked as in progress',
        'resolved': 'Complaint resolved successfully'
      };

      toast.success(statusMessages[status] || 'Complaint updated successfully');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🚨</span>
          Complaints Management
          <Badge variant="outline" className="ml-auto">
            {complaints.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {complaints.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-lg font-medium text-gray-700 mb-2">No complaints to review</p>
              <p className="text-gray-500">All students are happy! Keep up the great work.</p>
            </div>
          ) : (
            complaints.map((complaint) => (
              <div key={complaint.id} className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={getStatusColor(complaint.status)}>
                        {complaint.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">{complaint.category}</Badge>
                      <span className={`text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority} priority
                      </span>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{complaint.title}</h4>
                    <p className="text-gray-700 mb-3 leading-relaxed">{complaint.description}</p>
                    <p className="text-sm text-gray-500">
                      📅 Submitted: {formatDate(complaint.created_at)}
                    </p>
                    
                    {complaint.admin_response && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-blue-800 mb-1">Admin Response:</p>
                        <p className="text-sm text-blue-700">{complaint.admin_response}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {complaint.status !== 'resolved' && (
                  <div className="space-y-3 border-t pt-4">
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
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
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
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        ✅ Mark as Resolved
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
