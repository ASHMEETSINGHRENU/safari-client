import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';

// Pages
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import SafarisPage from './pages/SafarisPage';
import ComparePage from './pages/ComparePage';
import CorridorMapPage from './pages/CorridorMapPage';
import OurStoryPage from './pages/OurStoryPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import GalleryPage from './pages/GalleryPage';
import JournalPage from './pages/JournalPage';
import JournalDetailPage from './pages/JournalDetailPage';
import ResponsibleTourismPage from './pages/ResponsibleTourismPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerAccountPage from './pages/CustomerAccountPage';

// Admin Pages (Rendered with dedicated AdminLayout, NO public navbar/footer)
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminDestinationsPage from './pages/admin/AdminDestinationsPage';
import AdminSafarisPage from './pages/admin/AdminSafarisPage';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';
import AdminOurStoryCMSPage from './pages/admin/AdminOurStoryCMSPage';

// Scroll to top helper on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Helper component to wrap public pages with PublicLayout (Navbar + Footer)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <PublicLayout>{children}</PublicLayout>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Consumer Facing Pages (With Public Navbar & Footer) */}
          <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
          <Route path="/destinations" element={<PublicRoute><DestinationsPage /></PublicRoute>} />
          <Route path="/destinations/:slug" element={<PublicRoute><DestinationDetailPage /></PublicRoute>} />
          <Route path="/safaris" element={<PublicRoute><SafarisPage /></PublicRoute>} />
          <Route path="/compare" element={<PublicRoute><ComparePage /></PublicRoute>} />
          <Route path="/map" element={<PublicRoute><CorridorMapPage /></PublicRoute>} />
          <Route path="/our-story" element={<PublicRoute><OurStoryPage /></PublicRoute>} />
          <Route path="/about" element={<PublicRoute><AboutPage /></PublicRoute>} />
          <Route path="/how-it-works" element={<PublicRoute><HowItWorksPage /></PublicRoute>} />
          <Route path="/gallery" element={<PublicRoute><GalleryPage /></PublicRoute>} />
          <Route path="/journal" element={<PublicRoute><JournalPage /></PublicRoute>} />
          <Route path="/journal/:slug" element={<PublicRoute><JournalDetailPage /></PublicRoute>} />
          <Route path="/responsible-tourism" element={<PublicRoute><ResponsibleTourismPage /></PublicRoute>} />
          <Route path="/faqs" element={<PublicRoute><FAQPage /></PublicRoute>} />
          <Route path="/contact" element={<PublicRoute><ContactPage /></PublicRoute>} />

          {/* Booking & Account */}
          <Route path="/booking" element={<PublicRoute><BookingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/account" element={<PublicRoute><CustomerAccountPage /></PublicRoute>} />

          {/* DEDICATED ADMIN PANEL ROUTES (ZERO PUBLIC NAVBAR, ZERO PUBLIC FOOTER) */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/destinations" element={<AdminDestinationsPage />} />
          <Route path="/admin/safaris" element={<AdminSafarisPage />} />
          <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />
          <Route path="/admin/cms" element={<AdminOurStoryCMSPage />} />

          {/* Fallback */}
          <Route path="*" element={<PublicRoute><HomePage /></PublicRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
