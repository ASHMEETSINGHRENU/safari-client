import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../types';

const CAMERA_SPECS = [
  {
    body: 'Canon EOS 7D Mark II DSLR camera body',
    lens: 'Tamron SP 150-600mm f/5-6.3 Di VC USD telephoto zoom lens',
  },
  {
    body: 'Nikon D500, 20.9-megapixel APS-C (DX-format) flagship DSLR camera',
    lens: 'Nikon AF-S NIKKOR 200-500mm f/5.6E ED VR',
  },
];

interface GalleryLightboxProps {
  items: GalleryItem[];
  activeItem: GalleryItem | null;
  onClose: () => void;
  onChange: (item: GalleryItem) => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({ items, activeItem, onClose, onChange }) => {
  const step = (dir: number) => {
    if (!activeItem) return;
    const idx = items.findIndex(g => g._id === activeItem._id);
    if (idx === -1) return;
    onChange(items[(idx + dir + items.length) % items.length]);
  };

  useEffect(() => {
    if (!activeItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeItem, items]);

  if (!activeItem) return null;

  const activeIndex = items.findIndex(g => g._id === activeItem._id);
  const camera = CAMERA_SPECS[activeIndex >= 0 && activeIndex >= items.length / 2 ? 1 : 0];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-forest text-sand rounded-3xl overflow-hidden shadow-2xl border border-sand/20"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/70 rounded-full text-sand z-10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative max-h-[60vh] sm:max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
          <img
            src={activeItem.imageUrl}
            alt={activeItem.title}
            className="w-full h-full object-contain"
          />
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-sand transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-sand transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
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
              <span className="text-sand/60 block uppercase">Camera Body</span>
              <span className="font-semibold text-sand">{camera.body}</span>
            </div>
            <div>
              <span className="text-sand/60 block uppercase">Lens</span>
              <span className="font-semibold text-sand">{camera.lens}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryLightbox;
