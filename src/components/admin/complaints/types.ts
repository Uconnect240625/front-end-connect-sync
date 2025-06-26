
export interface Complaint {
  id: string;
  user_id: string;
  university_id: string;
  title: string;
  category: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  file_url?: string | null;
}

export interface ComplaintCardProps {
  complaint: Complaint;
  onStatusUpdate: (complaintId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed') => void;
  onDeleteComplaint: (complaintId: string, fileUrl?: string | null) => void;
  onDownloadFile: (fileUrl: string, fileName: string) => void;
}
