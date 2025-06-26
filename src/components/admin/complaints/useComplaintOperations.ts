
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useComplaintOperations = (onComplaintUpdate: () => void) => {
  const handleStatusUpdate = async (complaintId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('complaints')
        .update(updateData)
        .eq('id', complaintId);

      if (error) throw error;

      toast.success('Complaint updated successfully');
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

  return {
    handleStatusUpdate,
    handleDeleteComplaint,
    handleDownloadFile
  };
};
