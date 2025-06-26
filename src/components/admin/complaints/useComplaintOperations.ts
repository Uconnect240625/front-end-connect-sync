
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

      toast.success('Complaint status updated successfully');
      onComplaintUpdate();
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint status');
    }
  };

  const handleDeleteComplaint = async (complaintId: string, fileUrl?: string | null) => {
    try {
      // Delete the file from storage if it exists
      if (fileUrl) {
        try {
          // Extract the file path from the URL
          const urlParts = fileUrl.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const filePath = `complaints/${fileName}`;

          console.log('Attempting to delete file:', filePath);

          const { error: deleteFileError } = await supabase.storage
            .from('complaint-files')
            .remove([filePath]);

          if (deleteFileError) {
            console.error('Error deleting file from storage:', deleteFileError);
            // Continue with complaint deletion even if file deletion fails
          } else {
            console.log('File deleted successfully from storage');
          }
        } catch (fileError) {
          console.error('Error processing file deletion:', fileError);
          // Continue with complaint deletion
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
      console.log('Downloading file from URL:', fileUrl);
      
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'complaint-attachment';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully');
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
