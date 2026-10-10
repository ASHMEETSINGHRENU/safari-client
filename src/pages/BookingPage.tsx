import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { BookingWizard } from '../components/booking/BookingWizard';
import { useAuth } from '../context/AuthContext';

export const BookingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Booking requires an account; send guests to login and return them here after.
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  return (
    <div className="bg-sand min-h-screen pt-24 pb-20">
      <BookingWizard />
    </div>
  );
};
export default BookingPage;
