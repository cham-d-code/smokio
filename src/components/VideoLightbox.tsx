import React, { useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';

export interface ActiveVideoState {
  youtubeId: string;
  title: string;
  youtubeUrl: string;
}

interface VideoLightboxProps {
  video: ActiveVideoState | null;
  onClose: () => void;
}

export const VideoLightbox: React.FC<VideoLightboxProps> = ({ video, onClose }) => {
  useEffect(() => {
    if (!video) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${video.title}`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[#151515] border border-[#2B2B2B] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[#2B2B2B]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2 h-2 bg-[#E0313F] shrink-0" aria-hidden="true" />
            <h3 className="font-mono-hud text-xs sm:text-sm font-bold tracking-[0.1em] uppercase text-[#F4F1EA] truncate">
              {video.title}
            </h3>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 font-mono-hud text-[11px] uppercase tracking-[0.1em] text-[#9B9B9B] hover:text-[#F4F1EA] transition-colors"
            >
              Open YouTube
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close video player"
              className="w-9 h-9 inline-flex items-center justify-center border border-[#2B2B2B] text-[#F4F1EA] hover:border-[#E0313F] hover:text-[#E0313F] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};
