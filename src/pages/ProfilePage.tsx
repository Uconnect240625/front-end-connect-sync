
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { User, FileText, Building, Calendar, ShoppingBag, LogOut, Shield, UtensilsCrossed, BarChart3 } from 'lucide-react';

const ProfilePage = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const profileActions = [
    { icon: User, label: 'Edit Profile', action: () => navigate('/settings') },
    { icon: ShoppingBag, label: 'My Listings', action: () => navigate('/marketplace') },
    { icon: FileText, label: 'My Notes', action: () => navigate('/notes') },
    { icon: Building, label: 'My PGs', action: () => navigate('/pg-finder') },
    { icon: Calendar, label: 'My Events', action: () => navigate('/events') },
  ];

  // Add admin-specific actions
  if (profile.role === 'admin') {
    profileActions.splice(1, 0, 
      { icon: Shield, label: 'Admin Dashboard', action: () => navigate('/admin') },
      { icon: UtensilsCrossed, label: 'Manage Mess Menu', action: () => navigate('/mess-menu-admin') },
      { icon: BarChart3, label: 'Analytics', action: () => navigate('/admin/analytics') }
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-md mx-auto pt-8 px-4">
        <div className="bg-card rounded-2xl p-8 shadow-lg text-center border border-border">
          <div className={`w-24 h-24 ${profile.role === 'admin' ? 'bg-red-600' : 'bg-blue-900'} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4`}>
            {getInitials(profile.full_name)}
          </div>
          
          <h2 className="text-2xl font-bold text-card-foreground mb-2">{profile.full_name}</h2>
          <p className="text-muted-foreground mb-2 flex items-center justify-center gap-1">
            Role: 
            <span className="capitalize font-medium flex items-center gap-1 text-card-foreground">
              {profile.role === 'admin' && <Shield size={16} className="text-red-600" />}
              {profile.role}
            </span>
          </p>
          <p className="text-muted-foreground mb-6">University ID: <span className="font-medium text-card-foreground">{profile.university_id}</span></p>

          <div className="space-y-3">
            {profileActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                variant="outline"
                className={`w-full flex items-center justify-center space-x-2 py-3 border-border hover:bg-accent hover:text-accent-foreground ${
                  action.label.includes('Admin') || action.label.includes('Manage Mess') || action.label.includes('Analytics') 
                    ? 'text-red-600 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950' 
                    : ''
                }`}
              >
                <action.icon size={20} />
                <span>{action.label}</span>
              </Button>
            ))}
            
            <Button
              onClick={signOut}
              variant="destructive"
              className="w-full flex items-center justify-center space-x-2 py-3 mt-6"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
