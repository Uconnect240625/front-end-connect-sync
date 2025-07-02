import { Button } from '@/components/ui/button';
import { NOTIFICATION_FILTERS, NotificationFilter } from './types';

interface NotificationFiltersProps {
  activeFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
}

const NotificationFilters = ({ activeFilter, onFilterChange }: NotificationFiltersProps) => {
  return (
    <div className="flex overflow-x-auto p-3 bg-card border-b border-border gap-2">
      {NOTIFICATION_FILTERS.map((filter) => (
        <Button
          key={filter}
          variant={activeFilter === filter ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter)}
          className={`whitespace-nowrap ${
            activeFilter === filter 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-muted hover:bg-accent'
          }`}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
};

export default NotificationFilters;