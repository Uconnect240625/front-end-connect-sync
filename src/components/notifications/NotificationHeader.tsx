import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-red-600 text-white p-4">
      <button
        onClick={() => navigate('/uconnect')}
        className="mb-4 flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to U Connect
      </button>
      
      <div className="text-center">
        <h1 className="text-xl font-bold">🔔 Notifications</h1>
      </div>
    </div>
  );
};
export default NotificationHeader;