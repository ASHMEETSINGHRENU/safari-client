import axios from 'axios';
import { Destination, Safari, Booking, User, GalleryItem, JournalArticle, FAQItem, ReviewItem, SiteSettings } from '../types';

// One source of truth per environment: .env.development leaves this empty so dev hits
// the Vite proxy in vite.config.ts, and .env.production pins the live API host. There is
// deliberately no hardcoded fallback — a stale baked-in URL is how the frontend ends up
// silently talking to a decommissioned backend.
const envBase = (import.meta.env.VITE_API_BASE_URL || '').trim();
if (import.meta.env.PROD && !envBase) {
  throw new Error('VITE_API_BASE_URL must be set for a production build (see client/.env.production).');
}
const API_BASE = envBase.replace(/\/$/, '') + '/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sns_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A rejected token (expired/rotated) must not leave the app in a half-logged-in
// state. Clear it and send the user to login once, preserving where they were.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';
    const isAuthAttempt = url.includes('/auth/login') || url.includes('/auth/register');
    const hadToken = !!localStorage.getItem('sns_token');
    if (status === 401 && hadToken && !isAuthAttempt) {
      localStorage.removeItem('sns_token');
      localStorage.removeItem('sns_user');
      const { pathname, search } = window.location;
      if (pathname !== '/login') {
        window.location.assign(`/login?redirect=${encodeURIComponent(pathname + search)}&expired=1`);
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('sns_token', res.data.token);
      localStorage.setItem('sns_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  register: async (userData: { name: string; email: string; password: string; phone?: string }) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.token) {
      localStorage.setItem('sns_token', res.data.token);
      localStorage.setItem('sns_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data.user;
  },
  updateProfile: async (data: { name?: string; phone?: string; country?: string }) => {
    const res = await api.put('/auth/profile', data);
    return res.data.user;
  },
  toggleSaveDestination: async (destinationId: string) => {
    const res = await api.post(`/auth/saved-destinations/${destinationId}`);
    return res.data.savedDestinations;
  },
  logout: () => {
    localStorage.removeItem('sns_token');
    localStorage.removeItem('sns_user');
  }
};

// Destination Services
export const destinationService = {
  getAll: async (params?: { state?: string; search?: string; availability?: string; limit?: number }) => {
    const res = await api.get<{ success: boolean; count: number; destinations: Destination[] }>('/destinations', { params });
    return res.data.destinations;
  },
  getBySlug: async (slug: string) => {
    const res = await api.get<{ success: boolean; destination: Destination }>(`/destinations/${slug}`);
    return res.data.destination;
  },
  create: async (data: Partial<Destination>) => {
    const res = await api.post('/destinations', data);
    return res.data.destination;
  },
  update: async (id: string, data: Partial<Destination>) => {
    const res = await api.put(`/destinations/${id}`, data);
    return res.data.destination;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/destinations/${id}`);
    return res.data;
  }
};

// Safari Services
export const safariService = {
  getAll: async (params?: { destinationSlug?: string; state?: string; safariType?: string; slot?: string; maxPrice?: number; search?: string }) => {
    const res = await api.get<{ success: boolean; count: number; safaris: Safari[] }>('/safaris', { params });
    return res.data.safaris;
  },
  getBySlug: async (slug: string) => {
    const res = await api.get<{ success: boolean; safari: Safari }>(`/safaris/${slug}`);
    return res.data.safari;
  },
  create: async (data: Partial<Safari>) => {
    const res = await api.post('/safaris', data);
    return res.data.safari;
  },
  update: async (id: string, data: Partial<Safari>) => {
    const res = await api.put(`/safaris/${id}`, data);
    return res.data.safari;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/safaris/${id}`);
    return res.data;
  }
};

// Booking Services
export const bookingService = {
  create: async (bookingData: any) => {
    const res = await api.post<{ success: boolean; message: string; booking: Booking }>('/bookings', bookingData);
    return res.data.booking;
  },
  getMyBookings: async () => {
    const res = await api.get<{ success: boolean; count: number; bookings: Booking[] }>('/bookings/my-bookings');
    return res.data.bookings;
  },
  getByRef: async (ref: string) => {
    const res = await api.get<{ success: boolean; booking: Booking }>(`/bookings/ref/${ref}`);
    return res.data.booking;
  },
  track: async (data: { ref: string; email?: string; phone?: string }) => {
    const res = await api.post<{ success: boolean; booking: Booking }>('/bookings/track', data);
    return res.data.booking;
  },
  cancel: async (id: string) => {
    const res = await api.put(`/bookings/${id}/cancel`);
    return res.data.booking;
  },
  getAllAdmin: async (params?: { status?: string; search?: string }) => {
    const res = await api.get<{ success: boolean; count: number; bookings: Booking[] }>('/bookings/admin/all', { params });
    return res.data.bookings;
  },
  updateStatus: async (id: string, data: { bookingStatus?: string; paymentStatus?: string; suggestion?: Booking['suggestion'] | null }) => {
    const res = await api.put(`/bookings/admin/${id}/status`, data);
    return res.data.booking;
  }
};

// CMS and Content Services
export const cmsService = {
  getContent: async (key: string) => {
    const res = await api.get(`/cms/content/${key}`);
    return res.data.content;
  },
  updateContent: async (key: string, data: any) => {
    const res = await api.put(`/cms/content/${key}`, { data });
    return res.data.content;
  },
  getGallery: async (params?: { animal?: string; isFeatured?: boolean }) => {
    const res = await api.get<{ success: boolean; gallery: GalleryItem[] }>('/cms/gallery', { params });
    return res.data.gallery;
  },
  getJournals: async (params?: { category?: string }) => {
    const res = await api.get<{ success: boolean; journals: JournalArticle[] }>('/cms/journal', { params });
    return res.data.journals;
  },
  getJournalBySlug: async (slug: string) => {
    const res = await api.get<{ success: boolean; journal: JournalArticle }>(`/cms/journal/${slug}`);
    return res.data.journal;
  },
  getFAQs: async (params?: { category?: string }) => {
    const res = await api.get<{ success: boolean; faqs: FAQItem[] }>('/cms/faqs', { params });
    return res.data.faqs;
  },
  getReviews: async () => {
    const res = await api.get<{ success: boolean; reviews: ReviewItem[] }>('/cms/reviews');
    return res.data.reviews;
  },
  submitInquiry: async (inquiryData: any) => {
    const res = await api.post('/cms/inquiries', inquiryData);
    return res.data;
  },
  getInquiries: async () => {
    const res = await api.get('/cms/inquiries');
    return res.data.inquiries;
  },
  updateInquiryStatus: async (id: string, status: string) => {
    const res = await api.put(`/cms/inquiries/${id}/status`, { status });
    return res.data.inquiry;
  },
  subscribeNewsletter: async (email: string) => {
    const res = await api.post('/cms/newsletter', { email });
    return res.data;
  },
  getSettings: async () => {
    const res = await api.get<{ success: boolean; settings: SiteSettings }>('/cms/settings');
    return res.data.settings;
  }
};

// Admin Services
export const adminService = {
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  getUsers: async (kind?: 'team' | 'customer') => {
    const res = await api.get('/admin/users', { params: kind ? { kind } : {} });
    return res.data.users;
  },
  createUser: async (data: { name: string; email: string; password: string; role: string; phone?: string; country?: string }) => {
    const res = await api.post('/admin/users', data);
    return res.data.user;
  },
  updateUserRole: async (id: string, role?: string, isActive?: boolean) => {
    const res = await api.put(`/admin/users/${id}/role`, { role, isActive });
    return res.data.user;
  }
};
