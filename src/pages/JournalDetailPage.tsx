import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  User, 
  Calendar, 
  ArrowLeft, 
  Share2, 
  Tag, 
  Bookmark, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { cmsService } from '../services/api';
import { JournalArticle } from '../types';

export const JournalDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<JournalArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await cmsService.getJournalBySlug(slug);
        setArticle(data);
      } catch (err: any) {
        setError(err.message || 'Article could not be found.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!article) return;
    const prevTitle = document.title;
    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    const title = article.metaTitle || `${article.title} | Shutter and Stripes`;
    const description = article.metaDescription || article.excerpt;
    document.title = title;
    setMeta('name', 'description', description);
    if (article.keywords?.length) setMeta('name', 'keywords', article.keywords.join(', '));
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'article');
    if (article.coverImage) setMeta('property', 'og:image', window.location.origin + article.coverImage);
    return () => {
      document.title = prevTitle;
    };
  }, [article]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-sand min-h-screen pt-36 pb-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-forest border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-forest">Loading dispatch...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-sand min-h-screen pt-36 pb-20 container mx-auto px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-forest mb-4">Article Not Found</h2>
        <Link to="/journal" className="text-earth underline text-sm font-semibold">
          Return to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-sand min-h-screen pt-28 pb-20">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Back Link */}
        <Link
          to="/journal"
          className="inline-flex items-center space-x-2 text-forest/70 hover:text-forest text-xs font-bold uppercase tracking-wider mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Dispatches</span>
        </Link>

        {/* Header Block */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-forest text-sand text-[10px] font-bold uppercase tracking-widest">
              {article.category}
            </span>
            {article.destinationTag && (
              <span className="px-2.5 py-0.5 rounded-full bg-sand-light text-forest text-[10px] font-medium border border-forest/10">
                {article.destinationTag}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-forest font-bold tracking-tight mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-forest/10 text-xs text-forest/70">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5 font-semibold text-forest">
                <User className="w-3.5 h-3.5 text-gold" />
                <span>{article.author}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-gold" />
                <span>{article.readTime} read</span>
              </span>
              <span>•</span>
              <span>
                {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 bg-white border border-forest/15 rounded-xl hover:bg-forest hover:text-sand transition flex items-center space-x-1.5 font-semibold"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </div>

        {/* Cover Photo */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-forest/15 mb-10 h-72 sm:h-96">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Lead Excerpt */}
        <div className="border-l-4 border-gold pl-6 py-2 mb-10">
          <p className="font-serif text-lg sm:text-xl text-forest italic leading-relaxed">
            "{article.excerpt}"
          </p>
        </div>

        {/* Main Article Content */}
        <div className="prose prose-lg prose-forest max-w-none text-forest/85 leading-relaxed space-y-6 text-base sm:text-lg font-sans">
          {article.content.split('\n\n').map((block, i) => {
            const match = /^(#{2,4})\s+(.*)$/.exec(block.trim());
            if (match) {
              const level = match[1].length;
              const Tag = `h${level}` as 'h2' | 'h3' | 'h4';
              const size = level === 2 ? 'text-2xl sm:text-3xl' : level === 3 ? 'text-xl sm:text-2xl' : 'text-lg';
              return React.createElement(
                Tag,
                { key: i, className: `font-serif font-bold text-forest ${size}` },
                match[2]
              );
            }
            return <p key={i}>{block.trim()}</p>;
          })}
        </div>

        {/* Author Bio Box */}
        <div className="mt-16 p-8 bg-white rounded-3xl border border-forest/10 shadow-sm flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-16 h-16 rounded-full bg-forest text-gold flex items-center justify-center font-serif text-2xl font-bold shrink-0">
            {article.author.charAt(0)}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gold block mb-1">
              Field Chronicler
            </span>
            <h3 className="font-serif text-xl font-bold text-forest mb-1">{article.author}</h3>
            <p className="text-forest/70 text-xs sm:text-sm leading-relaxed">
              Senior expedition tracker and conservation contributor at Shutter And Stripes. Focused on Central Indian carnivore dynamics, camera trapping, and forest department community initiatives.
            </p>
          </div>
        </div>

        {/* CTA to Safari Booking */}
        <div className="mt-12 bg-forest text-sand p-8 rounded-3xl text-center space-y-4">
          <h3 className="font-serif text-2xl font-bold">Inspired by This Dispatch?</h3>
          <p className="text-sand/80 text-sm max-w-xl mx-auto">
            Experience these landscapes with our certified local naturalists on a custom-tailored tiger safari.
          </p>
          <div className="pt-2">
            <Link
              to="/destinations"
              className="px-6 py-3 bg-gold text-forest rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gold/90 transition inline-block shadow-lg"
            >
              Discover Reserves
            </Link>
          </div>
        </div>

      </article>
    </div>
  );
};
export default JournalDetailPage;
