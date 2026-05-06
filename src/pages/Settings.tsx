
import React from 'react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="bg-card rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-card-foreground">Settings</h1>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <span className="font-medium text-card-foreground">🌙 Dark Mode</span>
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>

            <div 
              className="flex items-center justify-between p-3 border-b border-border cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              onClick={handleEditProfile}
            >
              <span className="font-medium">👤 Edit Profile</span>
              <span className="text-muted-foreground">›</span>
            </div>

            <div className="flex items-center justify-between p-3 border-b border-border cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
              <span className="font-medium">🔐 Change Password</span>
              <span className="text-muted-foreground">›</span>
            </div>

            <div className="flex items-center justify-between p-3 border-b border-border cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
              <span className="font-medium">🔔 Notification Settings</span>
              <span className="text-muted-foreground">›</span>
            </div>

            <div className="flex items-center justify-between p-3 border-b border-border cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
              <span className="font-medium">🔒 Privacy & Security</span>
              <span className="text-muted-foreground">›</span>
            </div>

            <div className="flex items-center justify-between p-3 border-b border-border cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
              <span className="font-medium">🛠 Help & Support</span>
              <span className="text-muted-foreground">›</span>
            </div>
          </div>

          <Button 
            onClick={handleLogout}
            className="w-full bg-destructive text-destructive-foreground py-3 rounded-lg font-semibold mt-6 hover:bg-destructive/90 transition-colors"
          >
            Logout
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-4">
            UConnect v1.0 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
