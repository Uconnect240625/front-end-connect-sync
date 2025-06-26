
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu, X, Home, BookOpen, Calendar, UtensilsCrossed, ShoppingCart, Building, Megaphone, HelpCircle, Settings, Shield } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navigation() {
  const { profile, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  if (!profile) return null;

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Notes Hub', path: '/notes' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: UtensilsCrossed, label: 'Mess Menu', path: '/mess-menu' },
    { icon: ShoppingCart, label: 'Marketplace', path: '/marketplace' },
    { icon: Building, label: 'PG Finder', path: '/pg-finder' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    { icon: HelpCircle, label: 'Help Center', path: '/help' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  // Add admin-specific navigation items
  if (profile.role === 'admin') {
    navigationItems.splice(-1, 0, 
      { icon: Shield, label: 'Admin Dashboard', path: '/admin' },
      { icon: UtensilsCrossed, label: 'Manage Mess Menu', path: '/mess-menu-admin' }
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 relative z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-900 cursor-pointer" onClick={() => navigate('/')}>
              <span className="px-1 mx-1 rounded">U</span>Connect
            </h1>
            <span className="text-sm text-gray-600 capitalize flex items-center gap-1">
              {profile.role === 'admin' && <Shield size={14} className="text-red-600" />}
              {profile.role} Dashboard
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={toggleProfileDropdown}
              >
                <div className={`w-8 h-8 ${profile.role === 'admin' ? 'bg-red-600' : 'bg-blue-900'} text-white rounded-full flex items-center justify-center text-sm font-medium`}>
                  {getInitials(profile.full_name)}
                </div>
                <span className="text-sm font-medium hidden md:block">{profile.full_name}</span>
              </div>
              
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-medium text-sm">{profile.full_name}</p>
                    <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                      {profile.role === 'admin' && <Shield size={12} className="text-red-600" />}
                      {profile.role}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { navigate('/profile'); setIsProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <User size={16} />
                      <span>View Profile</span>
                    </button>
                    {profile.role === 'admin' && (
                      <button
                        onClick={() => { navigate('/admin'); setIsProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                      >
                        <Shield size={16} />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                    <button
                      onClick={() => { navigate('/settings'); setIsProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Menu</h2>
          <Button variant="ghost" size="sm" onClick={toggleSidebar}>
            <X size={20} />
          </Button>
        </div>
        
        <div className="py-4">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full text-left px-6 py-3 hover:bg-gray-50 flex items-center space-x-3 text-gray-700 hover:text-blue-900 ${
                item.label === 'Admin Dashboard' || item.label === 'Manage Mess Menu' ? 'text-red-600 hover:text-red-700' : ''
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
