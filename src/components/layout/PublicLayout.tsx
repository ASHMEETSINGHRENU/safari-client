import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen selection:bg-forest selection:text-sand bg-sand">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
