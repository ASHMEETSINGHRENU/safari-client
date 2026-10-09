import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const NotFoundPage: React.FC = () => (
  <div className="bg-sand min-h-screen pt-28 pb-20 flex items-center justify-center">
    <div className="text-center space-y-4 max-w-md px-4">
      <Compass className="w-12 h-12 text-gold mx-auto" />
      <span className="text-xs uppercase tracking-widest-safari text-earth font-bold block">Error 404</span>
      <h1 className="font-serif text-3xl font-bold text-forest">This trail does not exist</h1>
      <p className="text-xs text-forest/70">
        The page you are looking for has moved or never existed. Let's get you back to the reserves.
      </p>
      <div className="flex items-center justify-center gap-3 pt-2">
        <Link to="/" className="px-5 py-2.5 bg-forest text-sand text-xs font-semibold rounded hover:bg-forest-light transition-colors">
          Return Home
        </Link>
        <Link to="/destinations" className="px-4 py-2.5 bg-sand border border-forest/30 text-forest text-xs font-semibold rounded hover:bg-gold transition-colors">
          Explore Reserves
        </Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
