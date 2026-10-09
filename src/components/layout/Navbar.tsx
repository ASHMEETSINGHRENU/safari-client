import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Menu,
  X,
  User as UserIcon,
  Shield,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// --- Types and Navigation Config ---
interface NavLinkItem {
  name: string;
  path: string;
}

// Kept deliberately short — everything else lives in the Footer.
const PRIMARY_LINKS: NavLinkItem[] = [
  { name: 'Reserves', path: '/destinations' },
  { name: 'Our Story', path: '/our-story' },
  { name: 'Journal', path: '/journal' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Map', path: '/map' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // State
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Refs for clicking outside
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection for sticky header transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Lock background scroll while the mobile drawer is open, else the page
  // scrolls behind it and the fixed header draws over content mid-read.
  // ponytail: scrollingElement is <html>, not <body> — locking body alone is a no-op.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [mobileMenuOpen]);

  // Click outside listener for the user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-forest border-b-2 border-gold/40 ${
        isScrolled ? 'shadow-lg py-3' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">

          {/* Brand Identity / Logo */}
          <Link to="/" className="flex items-center group shrink-0">
            <img
              src="/assets/logo/nav-logo.svg"
              alt="Shutter and Stripes Emblem"
              className="h-10 lg:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {PRIMARY_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs font-semibold uppercase tracking-wider transition-colors relative py-1.5 ${
                    isActive
                      ? 'text-gold font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gold'
                      : 'text-sand/80 hover:text-sand'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-3">

            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border border-sand/30 text-sand text-xs font-semibold hover:bg-sand/10 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-gold text-forest flex items-center justify-center font-serif text-xs font-bold">
                    {user?.name.charAt(0)}
                  </div>
                  <span className="max-w-[110px] truncate">{user?.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gold transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-forest/15 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-forest/10">
                      <span className="text-[10px] uppercase font-bold text-forest/40 block">Signed In As</span>
                      <strong className="text-xs text-forest block truncate">{user?.name}</strong>
                      <span className="text-[10px] text-forest/60 block truncate">{user?.email}</span>
                    </div>

                    <Link
                      to="/account"
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-forest hover:bg-sand transition"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-gold" />
                      <span>My Safari Permits</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-forest hover:bg-sand transition"
                      >
                        <Shield className="w-3.5 h-3.5 text-gold" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <div className="border-t border-forest/10 pt-1 mt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-bold uppercase tracking-wider text-sand hover:text-gold transition px-3 py-1.5"
              >
                Sign In
              </Link>
            )}

            {/* Primary CTA: Book Safari */}
            <Link
              to="/booking"
              className="px-5 py-2.5 bg-gold text-forest text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gold-light transition shadow-md flex items-center space-x-2 group"
            >
              <Compass className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
              <span>Book Safari</span>
            </Link>

          </div>

          {/* Mobile Menu Action Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Link
              to="/booking"
              className="px-3 py-1.5 bg-gold text-forest text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-sand hover:bg-sand/10 focus:outline-none"
              aria-label="Toggle Navigation Drawer"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (Responsive Overlay) */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden bg-forest border-b-2 border-gold/40 px-4 pt-3 pb-6 shadow-2xl animate-fadeIn max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold/60 px-3 pt-1 pb-1">
              Explore
            </span>
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-sand hover:bg-sand/10 transition"
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Auth and Admin Block */}
            <div className="border-t border-sand/15 pt-3 mt-3 space-y-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-bold text-forest bg-gold"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Management Console</span>
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold text-sand bg-sand/10"
                  >
                    <UserIcon className="w-4 h-4 text-gold" />
                    <span>My Account ({user?.name})</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-sand/10 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    className="text-center py-2.5 rounded-xl border border-sand/30 text-xs font-bold uppercase tracking-wider text-sand"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-center py-2.5 rounded-xl bg-gold text-forest text-xs font-bold uppercase tracking-wider"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
