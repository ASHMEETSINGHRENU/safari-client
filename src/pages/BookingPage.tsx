import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookingWizard } from '../components/booking/BookingWizard';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const safariSlug = searchParams.get('safari') || undefined;

  return (
    <div className="bg-sand min-h-screen pt-24 pb-20">
      <BookingWizard initialSafariSlug={safariSlug} />
    </div>
  );
};
export default BookingPage;
