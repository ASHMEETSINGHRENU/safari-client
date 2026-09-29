import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Filter, 
  X, 
  MapPin, 
  Eye, 
  Sparkles, 
  Compass, 
  Check, 
  Share2 
} from 'lucide-react';
import { cmsService } from '../services/api';
import { GalleryItem } from '../types';

export const GalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    'All',
    'Tiger',
    'Leopard',
    'Elephant',
    'Birds',
    'Safari Life',
    'Forest Landscape'
  ];

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

  const filtered = gallery.filter(item => {
    if (selectedAnimal === 'All') return true;
    return item.animal.toLowerCase() === selectedAnimal.toLowerCase();
  });

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

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-10 border-b border-forest/10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedAnimal(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                selectedAnimal === cat
                  ? 'bg-forest text-sand shadow-sm'
                  : 'bg-white/80 text-forest/70 hover:text-forest hover:bg-white border border-forest/10'
              }`}
            >
              {cat}
            </button>
          ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-sand/95 backdrop-blur-md text-forest text-[10px] font-bold uppercase tracking-wider shadow">
                    {item.animal}
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-serif text-xl font-bold mb-1 leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-sand/90 drop-shadow">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-gold" />
                      <span>{item.destinationName || 'Central India'}</span>
                    </span>
                    <span className="text-[11px] text-gold font-medium">
                      {item.photographer || 'SNS Expedition Team'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {activeItem && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveItem(null)}
          >
            <div 
              className="relative max-w-4xl w-full bg-forest text-sand rounded-3xl overflow-hidden shadow-2xl border border-sand/20"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/70 rounded-full text-sand z-10 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[60vh] sm:max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand/15 pb-4">
                  <div>
                    <span className="text-gold text-xs font-bold uppercase tracking-widest block mb-1">
                      {activeItem.animal} • {activeItem.destinationName} ({activeItem.state || 'India'})
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                      {activeItem.title}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-sand/60 block uppercase">Photographer</span>
                    <span className="font-semibold text-sand">{activeItem.photographer || 'Shutter And Stripes Team'}</span>
                  </div>
                  <div>
                    <span className="text-sand/60 block uppercase">Field Gear</span>
                    <span className="font-semibold text-sand">{activeItem.cameraGear || 'Canon EOS R5 / RF 100-500mm'}</span>
                  </div>
                  <div>
                    <span className="text-sand/60 block uppercase">Lighting</span>
                    <span className="font-semibold text-sand">100% Natural Ambient Light</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default GalleryPage;
