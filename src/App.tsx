
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UConnect from "./pages/UConnect";
import NotFound from "./pages/NotFound";
import MessMenu from "./pages/MessMenu";
import NotesHub from "./pages/NotesHub";
import EventCalendar from "./pages/EventCalendar";
import Marketplace from "./pages/Marketplace";
import PGFinder from "./pages/PGFinder";
import Announcements from "./pages/Announcements";
import HelpCenter from "./pages/HelpCenter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UConnect />} />
          <Route path="/uconnect" element={<UConnect />} />
          <Route path="/mess-menu" element={<MessMenu />} />
          <Route path="/notes" element={<NotesHub />} />
          <Route path="/events" element={<EventCalendar />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/pg-finder" element={<PGFinder />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/help" element={<HelpCenter />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
