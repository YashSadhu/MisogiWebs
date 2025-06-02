import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Header from "components/ui/Header";
import Navigation from "components/ui/Navigation";
import { NotificationToastContainer } from "components/ui/NotificationToast";

// Page imports
import DashboardHome from "pages/dashboard-home";
import AnalyticsDashboard from "pages/analytics-dashboard";
import CalendarIntegration from "pages/calendar-integration";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <div className="min-h-screen bg-background">
          <Header />
          <Navigation />
          <NotificationToastContainer />
          <main className="pt-16 pb-20 md:pb-8">
            <RouterRoutes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/dashboard-home" element={<DashboardHome />} />
              <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
              <Route path="/calendar-integration" element={<CalendarIntegration />} />
              <Route path="*" element={<NotFound />} />
            </RouterRoutes>
          </main>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;