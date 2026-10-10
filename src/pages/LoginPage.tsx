import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Compass, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { info } = useToast();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login({ email, password });
      
      // Check if user is admin to route to admin or redirect
      const savedUser = JSON.parse(localStorage.getItem('sns_user') || '{}');
      if (savedUser.role && savedUser.role !== 'customer') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail: string, pass: string) => {
    setEmail(userEmail);
    setPassword(pass);
  };

  return (
    <div className="bg-sand min-h-screen pt-28 pb-20 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
        
        {/* Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-forest/15 shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-[11px] font-semibold uppercase tracking-widest mb-1">
              <Compass className="w-3 h-3 text-gold" />
              <span>Traveler Portal</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-forest">
              Welcome Back
            </h1>
            <p className="text-forest/60 text-xs">
              Access your official forest permits, bookings, and saved reserves.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest/70 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-forest/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-forest/70">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); info('Please contact enquiries@shutterandstripessafaries.com for manual security key reset.'); }} className="text-[11px] text-earth hover:underline">
                  Forgot Key?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-forest/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-forest text-sand rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-forest/90 transition shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-sand border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </>
              )}
            </button>
          </form>

          {/* Demo Login Shortcuts */}
          <div className="pt-4 border-t border-forest/10 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-forest/50 block text-center">
              Quick Test Autofill
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillCredentials('traveler@shutterandstripes.com', 'Traveler@2026')}
                className="p-2 rounded-xl bg-sand border border-forest/10 text-forest text-[11px] font-semibold hover:bg-forest hover:text-sand transition"
              >
                Customer Login
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin@shutterandstripes.com', 'Safari@2026')}
                className="p-2 rounded-xl bg-forest/10 border border-forest/20 text-forest text-[11px] font-semibold hover:bg-forest hover:text-sand transition"
              >
                Admin Login
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-forest/70">
            <span>Don't have an account? </span>
            <Link to={`/register?redirect=${redirect}`} className="text-earth font-bold hover:underline">
              Create Account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
export default LoginPage;
