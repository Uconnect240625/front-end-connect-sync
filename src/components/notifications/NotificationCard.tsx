import { Notification } from './types';

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return '🚨';
      case 'maintenance': return '🔧';
      case 'academic': return '📚';
      default: return '📢';
    }
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border transition-all">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getNotificationIcon(notification.type)}</span>
            <h3 className="font-semibold text-lg text-red-600">
              {notification.title}
            </h3>
          </div>
          <p className="text-card-foreground mb-3">{notification.message}</p>
          <div className="text-sm text-muted-foreground">
            {formatDate(notification.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;