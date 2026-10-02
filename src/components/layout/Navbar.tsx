import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, 
  Menu, 
  X, 
  User as UserIcon, 
  Shield, 
  Bookmark, 
  LogOut, 
  ChevronDown,
  MapPin,
  Camera,
  BookOpen,
  HelpCircle,
  Phone,
  Scale,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MAP_LABEL, MAP_ROUTE, YEARS_OF_EXPERIENCE } from '../../lib/site';

// --- Types and Navigation Config ---
interface NavLinkItem {
  name: string;
  path: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label: string;
  items: NavLinkItem[];
}

const PRIMARY_LINKS: NavLinkItem[] = [
  { name: 'Destinations', path: '/destinations' },
  { name: 'Safaris', path: '/safaris' },
  { name: MAP_LABEL, path: MAP_ROUTE },
  { name: 'Our Story', path: '/our-story' },
  { name: 'Journal', path: '/journal' },
  { name: 'Gallery', path: '/gallery' },
];

const MORE_LINKS: NavLinkItem[] = [
  { name: 'Compare Reserves', path: '/compare', icon: Scale, description: 'Side-by-side habitat and permit matrix' },
  { name: 'How It Works', path: '/how-it-works', icon: Compass, description: '6-step permit and entry guide' },
  { name: 'Responsible Tourism', path: '/responsible-tourism', icon: Shield, description: 'NTCA ethics and tribal empowerment' },
  { name: 'About Shutter And Stripes', path: '/about', icon: Sparkles, description: 'Brand heritage and conservation vision' },
  { name: 'Field FAQs', path: '/faqs', icon: HelpCircle, description: 'Everything regarding park gates and permits' },
  { name: 'Contact Concierge', path: '/contact', icon: Phone, description: 'Jabalpur and Nagpur naturalist desks' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // State
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Refs for clicking outside
  const userMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

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
    setMoreDropdownOpen(false);
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

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-sand/95 backdrop-blur-md shadow-md py-3 border-b border-forest/10' 
          : 'bg-sand/85 backdrop-blur-sm py-4 border-b border-forest/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          
          {/* Brand Identity / Logo */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <img
              src="/assets/logo/nav-logo.png"
              alt="Shutter and Stripes Emblem"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
            />
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-forest block leading-none">
                SHUTTER <span className="text-earth text-sm font-normal tracking-normal">And</span> STRIPES
              </span>
              <span className="text-[9px] tracking-widest-safari uppercase text-forest/70 font-semibold block mt-1">
                {YEARS_OF_EXPERIENCE}+ Years in the Indian Wild
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-4">
            {PRIMARY_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs font-semibold uppercase tracking-wider transition-colors relative py-1.5 ${
                    isActive 
                      ? 'text-forest font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gold' 
                      : 'text-forest/75 hover:text-forest'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* "More Explore" Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors py-1.5 flex items-center space-x-1 ${
                  moreDropdownOpen ? 'text-forest font-bold' : 'text-forest/75 hover:text-forest'
                }`}
                aria-expanded={moreDropdownOpen}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180 text-gold' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-forest/15 py-3 z-50 animate-fadeIn">
                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-forest/40 border-b border-forest/5 mb-1">
                    Expedition and Planning
                  </div>
                  {MORE_LINKS.map((item) => {
                    const Icon = item.icon || Compass;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-start space-x-3 px-4 py-2.5 hover:bg-sand/40 transition group"
                      >
                        <Icon className="w-4 h-4 text-gold mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-xs font-bold text-forest group-hover:text-gold transition">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-[10px] text-forest/60 leading-tight mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            


            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border border-forest/20 text-forest text-xs font-semibold hover:bg-forest/5 transition bg-white/50"
                >
                  <div className="w-6 h-6 rounded-full bg-forest text-gold flex items-center justify-center font-serif text-xs font-bold">
                    {user?.name.charAt(0)}
                  </div>
                  <span className="max-w-[110px] truncate">{user?.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-forest/60 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
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
                className="text-xs font-bold uppercase tracking-wider text-forest hover:text-earth transition px-3 py-1.5"
              >
                Sign In
              </Link>
            )}

            {/* Primary CTA: Book Safari */}
            <Link 
              to="/booking" 
              className="px-5 py-2.5 bg-forest text-sand text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-forest/90 transition shadow-md flex items-center space-x-2 group"
            >
              <Compass className="w-3.5 h-3.5 text-gold group-hover:rotate-45 transition-transform" />
              <span>Book Safari</span>
            </Link>

          </div>

          {/* Mobile Menu Action Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Link 
              to="/booking" 
              className="px-3 py-1.5 bg-forest text-sand text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm"
            >
              Book
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-forest hover:bg-forest/5 focus:outline-none"
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
        <div id="mobile-nav-drawer" className="lg:hidden bg-sand border-b border-forest/15 px-4 pt-3 pb-6 shadow-2xl animate-fadeIn max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-forest/40 px-3 pt-1 pb-1">
              Primary Destinations and Wild
            </span>
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-forest hover:bg-white/60 transition"
              >
                {link.name}
              </Link>
            ))}

            <span className="text-[10px] font-bold uppercase tracking-widest text-forest/40 px-3 pt-3 pb-1">
              Planning and Ethics
            </span>
            {MORE_LINKS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-2 rounded-xl text-sm font-medium text-forest/80 hover:bg-white/60 transition flex items-center justify-between"
              >
                <span>{item.name}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold" />
              </Link>
            ))}

            {/* Mobile Auth and Admin Block */}
            <div className="border-t border-forest/10 pt-3 mt-3 space-y-2">
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-bold text-sand bg-forest"
                >
                  <Shield className="w-4 h-4 text-gold" />
                  <span>Admin Management Console</span>
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link 
                    to="/account" 
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold text-forest bg-white/60"
                  >
                    <UserIcon className="w-4 h-4 text-gold" />
                    <span>My Account ({user?.name})</span>
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link 
                    to="/login" 
                    className="text-center py-2.5 rounded-xl border border-forest/20 text-xs font-bold uppercase tracking-wider text-forest bg-white"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-center py-2.5 rounded-xl bg-forest text-sand text-xs font-bold uppercase tracking-wider"
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
