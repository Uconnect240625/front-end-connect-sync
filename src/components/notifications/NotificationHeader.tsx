import { useNavigate } from 'react-router-dom';

const NotificationHeader = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate('/uconnect')}
        className="mb-6 text-blue-600 hover:text-blue-800 transition-colors"
      >
        ← Back to U Connect
      </button>
      
      <div className="text-white p-4 text-center">
        <h1 className="text-xl font-bold">🔔 Notifications</h1>
      </div>
    </div>
  );
};
export default NotificationHeader;