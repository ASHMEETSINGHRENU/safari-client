import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Compass, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await register(formData);
      navigate(redirect);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-sand min-h-screen pt-28 pb-20 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
        
        {/* Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-forest/15 shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-[11px] font-semibold uppercase tracking-widest mb-1">
              <Compass className="w-3 h-3 text-gold" />
              <span>Traveler Registration</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-forest">
              Create Your Account
            </h1>
            <p className="text-forest/60 text-xs">
              Manage safari permits, save favorite reserves, and view booking documents.
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
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-forest/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="As per Government ID"
                  className="w-full pl-10 pr-4 py-2.5 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest/70 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-forest/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest/70 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-forest/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest/70 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-forest/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
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
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-forest/70">
            <span>Already registered? </span>
            <Link to={`/login?redirect=${redirect}`} className="text-earth font-bold hover:underline">
              Sign In Here
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
export default RegisterPage;
