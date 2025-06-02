import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import { NotificationToastContainer } from './components/ui/NotificationToast';
import './styles/tailwind.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <div className="App">
          <Routes />
          <NotificationToastContainer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;