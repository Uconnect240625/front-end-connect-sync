
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useComplaintOperations = (onComplaintUpdate: () => void) => {
  const handleStatusUpdate = async (complaintId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    try {
      console.log('Updating complaint status:', { complaintId, status });
      
      const updateData = {
        status,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('complaints')
        .update(updateData)
        .eq('id', complaintId)
        .select();

      if (error) {
        console.error('Status update error:', error);
        throw error;
      }

      console.log('Status updated successfully:', data);
      toast.success('Complaint status updated successfully');
      onComplaintUpdate();
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint status');
    }
  };

  const handleDeleteComplaint = async (complaintId: string, fileUrl?: string | null) => {
    try {
      console.log('Starting complaint deletion:', { complaintId, fileUrl });

      // Delete the file from storage if it exists
      if (fileUrl) {
        try {
          // Extract the file path from the URL
          const url = new URL(fileUrl);
          const pathParts = url.pathname.split('/');
          const fileName = pathParts[pathParts.length - 1];
          const filePath = `complaints/${fileName}`;

          console.log('Attempting to delete complaint file:', filePath);

          const { error: deleteFileError } = await supabase.storage
            .from('complaint-files')
            .remove([filePath]);

          if (deleteFileError) {
            console.error('Error deleting complaint file from storage:', deleteFileError);
            console.error('File deletion error details:', {
              message: deleteFileError.message
            });
            // Continue with complaint deletion even if file deletion fails
          } else {
            console.log('Complaint file deleted successfully from storage');
          }
        } catch (fileError) {
          console.error('Error processing complaint file deletion:', fileError);
          // Continue with complaint deletion
        }
      }

      // Delete the complaint from database
      console.log('Deleting complaint from database:', complaintId);
      
      const { data, error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', complaintId)
        .select();

      if (error) {
        console.error('Database deletion error:', error);
        console.error('Deletion error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('Complaint deleted successfully from database:', data);
      toast.success('Complaint deleted successfully');
      onComplaintUpdate();
    } catch (error) {
      console.error('Error deleting complaint:', error);
      toast.error('Failed to delete complaint');
    }
  };

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      console.log('Downloading complaint file from URL:', fileUrl);
      
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Determine file extension from URL or blob type
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      const originalFileName = pathParts[pathParts.length - 1];
      const fileExtension = originalFileName.split('.').pop() || 'file';
      
      const downloadFileName = `${fileName}.${fileExtension}`;
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading complaint file:', error);
      toast.error('Failed to download file');
    }
  };

  return {
    handleStatusUpdate,
    handleDeleteComplaint,
    handleDownloadFile
  };
};
