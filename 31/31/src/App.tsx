
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MyEvents from "./pages/MyEvents";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import SavedHackathons from "./pages/SavedHackathons";
import CreateTeam from "./pages/CreateTeam";
import Teams from "./pages/Teams";
import FindTeam from "./pages/FindTeam";
import NotFound from "./pages/NotFound";
import HackathonDetailsPage from "./pages/hackathon/HackathonDetailsPage";
import TeamPage from "./pages/team/TeamPage";
import TeamDetails from "./pages/team/TeamDetails";
import TeamManagement from "./pages/team/TeamManagement";
import TeamRequests from "./pages/team/TeamRequests";
import TeamLeave from "./pages/team/TeamLeave";
import ProjectIdeas from "./pages/team/ProjectIdeas";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-events" element={<MyEvents />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/saved-hackathons" element={<SavedHackathons />} />
              <Route path="/create-team" element={<CreateTeam />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/find-team" element={<FindTeam />} />
              <Route path="/hackathon/:id" element={<HackathonDetailsPage />} />
              <Route path="/hackathons/:id" element={<HackathonDetailsPage />} />
              <Route path="/team/:teamId" element={<TeamPage />} />
              <Route path="/team/:teamId/details" element={<TeamDetails />} />
              <Route path="/team/:teamId/manage" element={<TeamManagement />} />
              <Route path="/team/:teamId/requests" element={<TeamRequests />} />
              <Route path="/team/:teamId/leave" element={<TeamLeave />} />
              <Route path="/team/:teamId/projects" element={<ProjectIdeas />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
<Route path="/team/:teamId/details" element={<TeamDetails />} />
