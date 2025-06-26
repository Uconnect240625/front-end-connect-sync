
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Download, Trash2 } from 'lucide-react';

interface Complaint {
  id: string;
  user_id: string;
  university_id: string;
  title: string;
  category: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  admin_response: string | null;
  created_at: string;
  updated_at: string;
  file_url?: string | null;
}

interface ComplaintsManagerProps {
  complaints: Complaint[];
  onComplaintUpdate: () => void;
}

const ComplaintsManager = ({
  complaints,
  onComplaintUpdate
}: ComplaintsManagerProps) => {
  const [responses, setResponses] = React.useState<Record<string, string>>({});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleStatusUpdate = async (complaintId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed', response?: string) => {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

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

  const handleDeleteComplaint = async (complaintId: string, fileUrl?: string | null) => {
    try {
      // Delete the file from storage if it exists
      if (fileUrl) {
        // Extract the file path from the URL
        const urlParts = fileUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `complaints/${fileName}`;

        const { error: deleteFileError } = await supabase.storage
          .from('complaint-files')
          .remove([filePath]);

        if (deleteFileError) {
          console.error('Error deleting file:', deleteFileError);
          // Continue with complaint deletion even if file deletion fails
        }
      }

      // Delete the complaint from database
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', complaintId);

      if (error) throw error;

      toast.success('Complaint deleted successfully');
      onComplaintUpdate();
    } catch (error) {
      console.error('Error deleting complaint:', error);
      toast.error('Failed to delete complaint');
    }
  };

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'complaint-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'destructive';
      case 'in_progress':
        return 'default';
      case 'resolved':
        return 'secondary';
      case 'closed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      case 'closed':
        return 'Closed';
      default:
        return status;
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
            complaints.map(complaint => (
              <div key={complaint.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getStatusColor(complaint.status)}>
                        {getStatusLabel(complaint.status)}
                      </Badge>
                      <Badge variant="outline">{complaint.category}</Badge>
                    </div>
                    <h4 className="font-semibold text-lg">{complaint.title}</h4>
                    <p className="text-gray-700 mt-2">{complaint.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Submitted: {formatDate(complaint.created_at)}
                    </p>
                    
                    {complaint.file_url && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">📎 Attachment</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadFile(complaint.file_url!, `complaint-${complaint.id}-file`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}

                    {complaint.admin_response && (
                      <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-blue-800">Admin Response:</p>
                        <p className="text-sm text-blue-700">{complaint.admin_response}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {complaint.status !== 'closed' && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add admin response (optional)"
                      value={responses[complaint.id] || ''}
                      onChange={(e) => setResponses(prev => ({ ...prev, [complaint.id]: e.target.value }))}
                      className="min-h-[80px]"
                    />
                    
                    <div className="flex gap-2 flex-wrap">
                      {complaint.status === 'open' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(complaint.id, 'in_progress', responses[complaint.id])}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          🔄 Start Working
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(complaint.id, 'resolved', responses[complaint.id])}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        ✅ Mark as Resolved
                      </Button>
                    </div>
                  </div>
                )}

                {complaint.status === 'resolved' && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteComplaint(complaint.id, complaint.file_url)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Complaint
                    </Button>
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
