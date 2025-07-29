
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/sonner';
import Auth from '@/pages/Auth';
import UConnect from '@/pages/UConnect';
import NotesHub from '@/pages/NotesHub';
import EventCalendar from '@/pages/EventCalendar';
import MessMenu from '@/pages/MessMenu';
import Marketplace from '@/pages/Marketplace';
import PGFinder from '@/pages/PGFinder';
import Announcements from '@/pages/Announcements';
import HelpCenter from '@/pages/HelpCenter';
import Settings from '@/pages/Settings';
import ProfilePage from '@/pages/ProfilePage';
import Community from '@/pages/Community';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import './App.css';

// Create a client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  console.log('App component mounting...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><UConnect /></ProtectedRoute>} />
              <Route path="/notes" element={<ProtectedRoute><NotesHub /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><EventCalendar /></ProtectedRoute>} />
              <Route path="/mess" element={<ProtectedRoute><MessMenu /></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
              <Route path="/pg-finder" element={<ProtectedRoute><PGFinder /></ProtectedRoute>} />
              <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
