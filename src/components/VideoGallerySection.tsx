import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import {
  CATALOG_LINKS,
  getYoutubeThumb,
  MUSIC_RELEASES,
  type MusicRelease,
} from '../data/smokio';

interface VideoGallerySectionProps {
  onPlayVideo: (release: MusicRelease) => void;
}

type VideoFilter = 'all' | 'featured' | 'recent' | 'archive';

const FILTERS: { id: VideoFilter; label: string }[] = [
  { id: 'all', label: 'All Videos (6)' },
  { id: 'featured', label: 'Featured' },
  { id: 'recent', label: '2025–2026' },
  { id: 'archive', label: '2021–2022' },
];

export const VideoGallerySection: React.FC<VideoGallerySectionProps> = ({ onPlayVideo }) => {
  const [filter, setFilter] = useState<VideoFilter>('all');
  const [failedThumbs, setFailedThumbs] = useState<Record<string, boolean>>({});

  const filteredVideos = useMemo(() => {
    if (filter === 'all') return MUSIC_RELEASES;
    if (filter === 'featured') return MUSIC_RELEASES.filter((v) => v.featured);
    if (filter === 'recent') return MUSIC_RELEASES.filter((v) => v.year >= 2025);
    return MUSIC_RELEASES.filter((v) => v.year <= 2022);
  }, [filter]);

  return (
    <section
      id="videos"
      className="bg-[#0A0A0A] text-[#F4F1EA] border-t border-[#2B2B2B] py-20 sm:py-28"
      aria-labelledby="videos-heading"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        {/* Header & Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-[#2B2B2B]">
          <div>
            <div className="flex items-center gap-3 font-mono-hud text-xs tracking-[0.14em] uppercase text-[#9B9B9B]">
              <span className="text-[#E0313F] font-bold">04.</span>
              <span>Official Visuals</span>
            </div>
            <h2
              id="videos-heading"
              className="mt-3 font-display-x text-4xl sm:text-5xl tracking-tight text-[#F4F1EA] leading-[0.98]"
            >
              WATCH THE MOVEMENT.
            </h2>
            <p className="mt-3 text-[#9B9B9B] text-base max-w-[50ch]">
              Official videos. Stories in motion. See the visuals that bring the tracks to life.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Segmented Interactive Filter Buttons */}
            <div
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#151515] border border-[#2B2B2B]"
              role="tablist"
              aria-label="Filter official videos"
            >
              {FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(f.id)}
                    className={`px-3.5 py-2 font-mono-hud text-[11px] uppercase tracking-[0.1em] transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#E0313F] text-white font-bold'
                        : 'text-[#9B9B9B] hover:text-[#F4F1EA]'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <a
              href={CATALOG_LINKS.youtubeChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[#2B2B2B] hover:border-[#F4F1EA] text-[#F4F1EA] font-mono-hud text-[11px] uppercase tracking-[0.12em] px-4 py-3 transition-colors whitespace-nowrap"
            >
              YouTube Channel
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Responsive Video Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVideos.map((video) => {
            const broken = !!failedThumbs[video.id];
            return (
              <div
                key={video.id}
                className="group bg-[#151515] border border-[#2B2B2B] hover:border-[#E0313F]/70 transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => onPlayVideo(video)}
                  aria-label={`Play ${video.title} (${video.year})`}
                  className="relative w-full aspect-video block bg-black overflow-hidden cursor-pointer text-left"
                >
                  {!broken ? (
                    <img
                      src={getYoutubeThumb(video.youtubeId)}
                      alt={`${video.title} music video still`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedThumbs((prev) => ({ ...prev, [video.id]: true }))
                      }
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1E1E22] to-[#0A0A0A] flex items-center justify-center p-6">
                      <span className="font-display-x text-3xl text-[#F4F1EA]/25 text-center">
                        {video.title}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-14 h-14 bg-[#0A0A0A]/85 group-hover:bg-[#E0313F] text-white border border-white/20 group-hover:border-[#E0313F] transition-colors flex items-center justify-center chamfer-5">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#E0313F]">
                        {video.releaseDateLabel || video.year} · YouTube
                      </p>
                      <h3 className="mt-1 font-sinhala text-lg sm:text-xl font-semibold text-[#F4F1EA]">
                        {video.title}
                        {video.sinhalaTitle ? ` (${video.sinhalaTitle})` : ''}
                      </h3>
                    </div>
                  </div>
                </button>

                <div className="px-5 py-3.5 border-t border-[#2B2B2B] flex items-center justify-between gap-4">
                  <p className="text-xs text-[#9B9B9B] truncate">
                    {video.collaborators || 'Official Solo Release'}
                  </p>
                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono-hud text-[11px] uppercase tracking-[0.1em] text-[#F4F1EA] hover:text-[#E0313F] transition-colors whitespace-nowrap shrink-0"
                  >
                    YouTube
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
