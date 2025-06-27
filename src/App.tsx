import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import DarkModeInit from "./components/DarkModeInit";
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
import CreateAnnouncement from "./pages/CreateAnnouncement";
import ManageAnnouncementsPage from "./pages/ManageAnnouncementsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <DarkModeInit />
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/uconnect"
                element={
                  <ProtectedRoute>
                    <UConnect />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute>
                    <AdminAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/revenue"
                element={
                  <ProtectedRoute>
                    <AdminRevenue />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/announcements"
                element={
                  <ProtectedRoute>
                    <Announcements />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/announcements/create"
                element={
                  <ProtectedRoute>
                    <CreateAnnouncement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/announcements/manage"
                element={
                  <ProtectedRoute>
                    <ManageAnnouncementsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/event-calendar"
                element={
                  <ProtectedRoute>
                    <EventCalendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/help-center"
                element={
                  <ProtectedRoute>
                    <HelpCenter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute>
                    <Marketplace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/list-product"
                element={
                  <ProtectedRoute>
                    <ListProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mess-menu"
                element={
                  <ProtectedRoute>
                    <MessMenu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mess-menu-admin"
                element={
                  <ProtectedRoute>
                    <MessMenuAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <NotesHub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload-notes"
                element={
                  <ProtectedRoute>
                    <NotesHub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pg-finder"
                element={
                  <ProtectedRoute>
                    <PGFinder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-club-event"
                element={
                  <ProtectedRoute>
                    <PostClubEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-notice"
                element={
                  <ProtectedRoute>
                    <PostNotice />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-roommate-request"
                element={
                  <ProtectedRoute>
                    <PostRoommateRequest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/club-dashboard"
                element={
                  <ProtectedRoute>
                    <ClubDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
