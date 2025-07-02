import { Notification, NotificationFilter } from './types';
import NotificationCard from './NotificationCard';

interface NotificationListProps {
  notifications: Notification[];
  activeFilter: NotificationFilter;
}

const NotificationList = ({ notifications, activeFilter }: NotificationListProps) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📢</div>
        <h3 className="text-xl font-semibold text-card-foreground mb-2">No Notifications</h3>
        <p className="text-muted-foreground">
          No {activeFilter.toLowerCase()} notifications available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationCard 
          key={notification.id} 
          notification={notification}
        />
      ))}
    </div>
  );
};

export default NotificationList;