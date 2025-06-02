import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import FindTeam from "./pages/FindTeam";
import CreateTeam from "./pages/CreateTeam";
import Projects from "./pages/Projects";
import Dashboard from '@/pages/Dashboard';
import MyEvents from "./pages/MyEvents";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
// Team related imports
import TeamDetails from "./pages/team/TeamDetails";
import TeamManagement from "./pages/team/TeamManagement";
import TeamRequests from "./pages/team/TeamRequests";
import TeamLeave from "./pages/team/TeamLeave";
import ProjectIdeas from "./pages/team/ProjectIdeas";
import TeamPage from './pages/team/TeamPage';
import HackathonDetailsPage from './pages/hackathon/HackathonDetailsPage';

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Protected Routes */}
            <Route path="/find-team" element={
              <ProtectedRoute>
                <FindTeam />
              </ProtectedRoute>
            } />
            <Route path="/create-team" element={
              <ProtectedRoute>
                <CreateTeam />
              </ProtectedRoute>
            } />
            <Route path="/my-events" element={
              <ProtectedRoute>
                <MyEvents />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Protected Team Routes */}
            <Route path="/team/:teamId" element={
              <ProtectedRoute>
                <TeamDetails />
              </ProtectedRoute>
            } />
            <Route path="/team/:teamId/manage" element={
              <ProtectedRoute>
                <TeamManagement />
              </ProtectedRoute>
            } />
            <Route path="/team/:teamId/requests" element={
              <ProtectedRoute>
                <TeamRequests />
              </ProtectedRoute>
            } />
            <Route path="/team/:teamId/leave" element={
              <ProtectedRoute>
                <TeamLeave />
              </ProtectedRoute>
            } />
            <Route path="/team/:teamId/ideas" element={
              <ProtectedRoute>
                <ProjectIdeas />
              </ProtectedRoute>
            } />
            <Route path="/team/:teamId" element={
              <ProtectedRoute>
                <TeamPage />
              </ProtectedRoute>
            } />
            
            {/* Hackathon Routes */}
            <Route path="/hackathons/:hackathonId" element={<HackathonDetailsPage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
