import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import UConnect from "./pages/UConnect";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import MessMenu from "./pages/MessMenu";
import NotesHub from "./pages/NotesHub";
import EventCalendar from "./pages/EventCalendar";
import Marketplace from "./pages/Marketplace";
import PGFinder from "./pages/PGFinder";
import Announcements from "./pages/Announcements";
import HelpCenter from "./pages/HelpCenter";
import MessMenuAdmin from "./pages/MessMenuAdmin";
import PostClubEvent from "./pages/PostClubEvent";
import ClubDashboard from "./pages/ClubDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PostRoommateRequest from "./pages/PostRoommateRequest";
import ListProduct from "./pages/ListProduct";
import UploadNotes from "./pages/UploadNotes";
import AdminRevenue from "./pages/AdminRevenue";
import AdminAnalytics from "./pages/AdminAnalytics";
import PostNotice from "./pages/PostNotice";
import Settings from "./pages/Settings";
import ProfilePage from "./pages/ProfilePage";
import Notifications from "./pages/Notifications";
import HelpCenterAdmin from "./pages/HelpCenterAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <UConnect />
              </ProtectedRoute>
            } />
            <Route path="/uconnect" element={
              <ProtectedRoute>
                <UConnect />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/mess-menu" element={
              <ProtectedRoute>
                <MessMenu />
              </ProtectedRoute>
            } />
            <Route path="/notes" element={
              <ProtectedRoute>
                <NotesHub />
              </ProtectedRoute>
            } />
            <Route path="/events" element={
              <ProtectedRoute>
                <EventCalendar />
              </ProtectedRoute>
            } />
            <Route path="/marketplace" element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            } />
            <Route path="/pg-finder" element={
              <ProtectedRoute>
                <PGFinder />
              </ProtectedRoute>
            } />
            <Route path="/announcements" element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <HelpCenter />
              </ProtectedRoute>
            } />
            <Route path="/help-admin" element={
              <ProtectedRoute requiredRole={['admin']}>
                <HelpCenterAdmin />
              </ProtectedRoute>
            } />
            <Route path="/mess-menu-admin" element={
              <ProtectedRoute requiredRole={['admin']}>
                <MessMenuAdmin />
              </ProtectedRoute>
            } />
            <Route path="/post-club-event" element={
              <ProtectedRoute>
                <PostClubEvent />
              </ProtectedRoute>
            } />
            <Route path="/club-dashboard" element={
              <ProtectedRoute>
                <ClubDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute requiredRole={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/post-roommate-request" element={
              <ProtectedRoute>
                <PostRoommateRequest />
              </ProtectedRoute>
            } />
            <Route path="/list-product" element={
              <ProtectedRoute>
                <ListProduct />
              </ProtectedRoute>
            } />
            <Route path="/upload-notes" element={
              <ProtectedRoute>
                <UploadNotes />
              </ProtectedRoute>
            } />
            <Route path="/admin-revenue" element={
              <ProtectedRoute requiredRole={['admin']}>
                <AdminRevenue />
              </ProtectedRoute>
            } />
            <Route path="/admin-analytics" element={
              <ProtectedRoute requiredRole={['admin']}>
                <AdminAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/post-notice" element={
              <ProtectedRoute requiredRole={['admin']}>
                <PostNotice />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
