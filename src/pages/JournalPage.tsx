import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Tag, 
  Search, 
  Filter 
} from 'lucide-react';
import { cmsService } from '../services/api';
import { JournalArticle } from '../types';

export const JournalPage: React.FC = () => {
  const [journals, setJournals] = useState<JournalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Wildlife',
    'Photography',
    'Safari Guide',
    'Destinations',
    'Responsible Tourism'
  ];

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true);
        const data = await cmsService.getJournals();
        setJournals(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  const filtered = journals.filter(j => {
    const matchesCat = selectedCat === 'All' || j.category.toLowerCase() === selectedCat.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-sand min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-semibold uppercase tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5 text-gold" />
            <span>Field Dispatches and Ecology</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-forest font-bold tracking-tight mb-4">
            The Shutter And Stripes Wildlife Journal
          </h1>
          <p className="text-forest/80 text-base sm:text-lg leading-relaxed font-sans">
            In-depth guides to tiger tracking, ethical wildlife camera technique, seasonal park entry logistics, and conservation field reports from Madhya Pradesh and Maharashtra.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-4 border-b border-forest/10">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                  selectedCat === cat
                    ? 'bg-forest text-sand shadow-sm'
                    : 'bg-white/80 text-forest/70 hover:text-forest border border-forest/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs">
            <Search className="w-4 h-4 text-forest/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dispatches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/80 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-forest border-t-transparent mb-4"></div>
            <p className="font-serif text-forest">Retrieving field dispatches...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-forest/10">
            <p className="text-forest/70 text-sm">No journal articles match your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(article => (
              <article 
                key={article._id}
                className="bg-white rounded-2xl overflow-hidden border border-forest/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-forest text-sand text-[10px] font-bold uppercase tracking-wider shadow">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-3 text-[11px] text-forest/60 mb-2">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gold" />
                        <span>{article.readTime}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-gold" />
                        <span>{article.author}</span>
                      </span>
                    </div>

                    <h2 className="font-serif text-xl font-bold text-forest mb-2 group-hover:text-gold transition leading-snug">
                      <Link to={`/journal/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-forest/70 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-forest/5 flex items-center justify-between">
                  <span className="text-[11px] text-forest/50">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <Link
                    to={`/journal/${article.slug}`}
                    className="text-xs uppercase font-bold tracking-wider text-forest group-hover:text-gold transition flex items-center space-x-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
export default JournalPage;
