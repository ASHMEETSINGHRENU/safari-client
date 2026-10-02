import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen selection:bg-forest selection:text-sand bg-sand">
      <div className="print:hidden"><Navbar /></div>
      <main className="flex-grow">
        {children}
      </main>
      <div className="print:hidden"><Footer /></div>
    </div>
  );
};

export default PublicLayout;
