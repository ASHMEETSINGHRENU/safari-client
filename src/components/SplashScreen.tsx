import { useEffect, useState } from 'react';

const MIN_MS = 1600;
const MAX_MS = 9000;
export const SPLASH_SEEN_KEY = 'sas_splash_seen';

export const SplashScreen: React.FC<{
  getVideo: () => HTMLVideoElement | null;
  onDone: () => void;
}> = ({ getVideo, onDone }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const video = getVideo();
    let finished = false;
    let fadeTimer = 0;

    const finish = () => {
      if (finished) return;
      finished = true;
      setFading(true);
      fadeTimer = window.setTimeout(onDone, 500);
    };

    const minTimer = window.setTimeout(() => {
      if (!video || video.readyState >= 4 || video.error) finish();
    }, MIN_MS);

    const capTimer = window.setTimeout(finish, MAX_MS);

    const onReady = () => finish();
    if (video && video.readyState < 4) video.addEventListener('canplaythrough', onReady);

    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(capTimer);
      window.clearTimeout(fadeTimer);
      if (video) video.removeEventListener('canplaythrough', onReady);
      document.body.style.overflow = '';
    };
  }, [getVideo, onDone]);

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-forest transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img src="/assets/logo/nav-logo.svg" alt="Shutter and Stripes" className="h-16 w-auto object-contain" />
      <p className="mt-5 font-serif text-lg sm:text-xl font-bold tracking-wider text-sand">
        SHUTTER AND STRIPES
      </p>
      <p className="mt-1 text-[9px] tracking-widest-safari uppercase text-gold/80">
        Loading the wild&hellip;
      </p>
      <div className="mt-8 h-px w-48 bg-forest-deep overflow-hidden">
        <div className="h-full w-16 bg-gold animate-pulse" />
      </div>
    </div>
  );
};