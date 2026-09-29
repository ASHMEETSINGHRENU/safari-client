import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  Compass, 
  MessageSquare, 
  ArrowRight 
} from 'lucide-react';
import { cmsService } from '../services/api';
import { FAQItem } from '../types';

export const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const data = await cmsService.getFAQs();
        setFaqs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const categories = ['All', 'Booking & Permits', 'Safari Operations', 'Wildlife & Photography', 'Logistics & Seasons'];

  const filteredFaqs = faqs.filter(f => {
    const matchesCat = selectedCategory === 'All' || f.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-sand min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-semibold uppercase tracking-widest mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-gold" />
            <span>Field Knowledge Base</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-forest font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-forest/80 text-base sm:text-lg leading-relaxed font-sans max-w-2xl mx-auto">
            Everything you need to know about official forest permits, vehicle quotas, photo gear guidelines, and weather in Central India's tiger corridors.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-4 mb-10">
          <div className="relative">
            <Search className="w-5 h-5 text-forest/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, e.g. permits, children, camera lenses, cancellations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-forest/15 rounded-2xl text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-forest text-sand shadow-sm'
                    : 'bg-white/80 text-forest/70 hover:text-forest border border-forest/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion FAQ List */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-forest border-t-transparent mb-3"></div>
            <p className="font-serif text-forest text-sm">Querying field documentation...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-forest/10">
            <p className="text-forest/70 text-sm mb-4">No answers found matching "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-4 py-2 bg-forest text-sand rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === faq._id || openIndex === String(idx);
              return (
                <div 
                  key={faq._id || idx}
                  className="bg-white rounded-2xl border border-forest/10 overflow-hidden shadow-sm transition hover:border-gold/30"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : (faq._id || String(idx)))}
                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gold block mb-1">
                        {faq.category}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-forest leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-forest/60 transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 text-gold' : ''
                    }`} />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-forest/80 leading-relaxed border-t border-forest/5 font-sans">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still have questions? */}
        <div className="mt-16 bg-forest text-sand p-8 rounded-3xl text-center space-y-4">
          <MessageSquare className="w-8 h-8 text-gold mx-auto" />
          <h2 className="font-serif text-2xl font-bold">Have a Specific Expedition Question?</h2>
          <p className="text-sand/80 text-xs sm:text-sm max-w-lg mx-auto">
            Our safari coordination desk is available 7 days a week to answer permit, camera permit, and multi-park routing questions.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="px-6 py-3 bg-gold text-forest rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gold/90 transition inline-block shadow-lg"
            >
              Reach Out to Our Desk
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
export default FAQPage;
