export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  user_id: string | null;
}

export const NOTIFICATION_FILTERS = ['All', 'General', 'Urgent', 'Maintenance', 'Academic'] as const;
export type NotificationFilter = typeof NOTIFICATION_FILTERS[number];