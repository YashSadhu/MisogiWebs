import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import HackathonListingsScreen from "./pages/hackathon-listings-screen";
import HackathonDetailsRegistrationScreen from "./pages/hackathon-details-registration-screen";
import TeamFormationScreen from "./pages/team-formation-screen";
import TeamDashboardScreen from "./pages/team-dashboard-screen";
import NotFound from "./pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<HackathonListingsScreen />} />
          <Route path="/hackathon-listings-screen" element={<HackathonListingsScreen />} />
          <Route path="/hackathon-details-registration-screen" element={<HackathonDetailsRegistrationScreen />} />
          <Route path="/team-formation-screen" element={<TeamFormationScreen />} />
          <Route path="/team-dashboard-screen" element={<TeamDashboardScreen />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;