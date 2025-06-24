
import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  UtensilsCrossed, 
  ShoppingCart, 
  Home, 
  Megaphone,
  HelpCircle,
  Settings 
} from 'lucide-react';
import ProfileDebugger from '@/components/ProfileDebugger';
import { useAuth } from '@/hooks/useAuth';

const UConnect = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const features = [
    { 
      title: 'Notes Hub', 
      icon: BookOpen, 
      color: 'bg-blue-500', 
      route: '/notes-hub',
      description: 'Access and share study materials'
    },
    { 
      title: 'Event Calendar', 
      icon: Calendar, 
      color: 'bg-green-500', 
      route: '/event-calendar',
      description: 'View upcoming campus events'
    },
    { 
      title: 'Mess Menu', 
      icon: UtensilsCrossed, 
      color: 'bg-orange-500', 
      route: '/mess-menu',
      description: 'Check daily meal schedules'
    },
    { 
      title: 'Marketplace', 
      icon: ShoppingCart, 
      color: 'bg-purple-500', 
      route: '/marketplace',
      description: 'Buy and sell with students'
    },
    { 
      title: 'PG Finder', 
      icon: Home, 
      color: 'bg-indigo-500', 
      route: '/pg-finder',
      description: 'Find accommodation'
    },
    { 
      title: 'Announcements', 
      icon: Megaphone, 
      color: 'bg-red-500', 
      route: '/announcements',
      description: 'Campus news and updates'
    },
    { 
      title: 'Help Center', 
      icon: HelpCircle, 
      color: 'bg-teal-500', 
      route: '/help-center',
      description: 'Get support and assistance'
    },
    { 
      title: 'Settings', 
      icon: Settings, 
      color: 'bg-gray-500', 
      route: '/settings',
      description: 'Manage your preferences'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to <span className="text-red-600">U</span> Connect
          </h1>
          <p className="text-xl text-gray-600">Your Campus Smart Companion</p>
          {profile && (
            <p className="text-lg text-gray-700 mt-2">
              Hello, {profile.full_name}! ({profile.role})
            </p>
          )}
        </div>

        {/* Debug info - remove this after testing */}
        <div className="mb-8">
          <ProfileDebugger />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                  <Button 
                    onClick={() => navigate(feature.route)}
                    variant="outline" 
                    className="w-full"
                  >
                    Open
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Admin Dashboard Access */}
        {profile?.role === 'admin' && (
          <div className="mt-8 text-center">
            <Card className="max-w-md mx-auto bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">Admin Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    onClick={() => navigate('/admin-dashboard')}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Admin Dashboard
                  </Button>
                  <Button 
                    onClick={() => navigate('/admin-analytics')}
                    variant="outline" 
                    className="w-full"
                  >
                    Analytics
                  </Button>
                  <Button 
                    onClick={() => navigate('/admin-revenue')}
                    variant="outline" 
                    className="w-full"
                  >
                    Revenue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Club Dashboard Access */}
        {profile?.role === 'club' && (
          <div className="mt-8 text-center">
            <Card className="max-w-md mx-auto bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">Club Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/club-dashboard')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Club Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UConnect;
