import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../types';

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
      </div>
    </div>
  );
};

export default GalleryLightbox;
