import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Filter, 
  Eye, 
  Sparkles, 
  Compass, 
  Check, 
  Share2
} from 'lucide-react';
import { cmsService } from '../services/api';
import { GalleryItem } from '../types';
import { PaginatedGrid } from '../components/PaginatedGrid';
import { GalleryLightbox } from '../components/GalleryLightbox';

export const GalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const data = await cmsService.getGallery();
        setGallery(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filtered = gallery;

  return (
    <div className="bg-sand min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-semibold uppercase tracking-widest mb-4">
            <Camera className="w-3.5 h-3.5 text-gold" />
            <span>Field Photography Archive</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-forest font-bold tracking-tight mb-4">
            Wild Encounters in Natural Light
          </h1>
          <p className="text-forest/80 text-base sm:text-lg leading-relaxed font-sans">
            Every photograph is an ethical capture from our expeditions in Madhya Pradesh and Maharashtra. No artificial lighting, no baiting, and no harassment of wildlife.
          </p>
        </div>

        {/* Masonry / Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-forest border-t-transparent mb-4"></div>
            <p className="font-serif text-forest">Loading field imagery...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-forest/10">
            <p className="text-forest/70 text-sm">No photos found in this category.</p>
          </div>
        ) : (
          <PaginatedGrid
            label="Photo gallery"
            rows={2}
            baseCols={2}
            lgCols={4}
            gridClassName="grid grid-cols-2 lg:grid-cols-4 gap-6"
            items={filtered.map(item => (
              <div 
                key={item._id}
                onClick={() => setActiveItem(item)}
                className="group relative h-96 rounded-2xl overflow-hidden border border-forest/15 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-forest"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[1.02] contrast-[1.02]"
                  loading="lazy"
                />
              </div>
            ))}
          />
        )}

        <GalleryLightbox
          items={filtered}
          activeItem={activeItem}
          onClose={() => setActiveItem(null)}
          onChange={setActiveItem}
        />

      </div>
    </div>
  );
};
export default GalleryPage;
