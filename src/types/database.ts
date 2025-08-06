

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved';

export interface PGListing {
  id: string;
  user_id: string;
  university_id: string;
  title: string;
  description?: string;
  location: string;
  price: number;
  contact_phone: string;
  contact_email?: string;
  room_type: string;
  facilities?: string[];
  images?: string[];
  approval_status: ApprovalStatus;
  is_paid: boolean;  // This is the actual field in the database
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceItem {
  id: string;
  user_id: string;
  university_id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  condition?: string;
  contact_phone: string;
  contact_email?: string;
  images?: string[];
  approval_status: ApprovalStatus;
  is_paid: boolean;  // This is the actual field in the database
  is_sold: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClubEvent {
  id: string;
  user_id: string;
  university_id: string;
  club_name: string;
  title: string;
  description?: string;
  event_date: string;
  event_time: string;
  location: string;
  max_participants?: number;
  registration_required: boolean;
  contact_info?: string;
  approval_status: ApprovalStatus;
  is_paid: boolean;  // This is the actual field in the database
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: string;
  user_id: string;
  university_id: string;
  title: string;
  description: string;
  category: string;
  priority?: string;  // Make this optional since it might not always be present
  status: ComplaintStatus;
  admin_response?: string;
  created_at: string;
  updated_at: string;
}

