import React, { useState } from 'react';
import { ArrowUpRight, Disc3, Play } from 'lucide-react';
import {
  CATALOG_LINKS,
  getYoutubeThumb,
  MUSIC_RELEASES,
  type MusicRelease,
} from '../data/smokio';

interface MusicSectionProps {
  onPlayVideo: (release: MusicRelease) => void;
}

export const MusicSection: React.FC<MusicSectionProps> = ({ onPlayVideo }) => {
  const [failedThumbs, setFailedThumbs] = useState<Record<string, boolean>>({});

  return (
    <section
      id="music"
      className="bg-[#0A0A0A] text-[#F4F1EA] border-t border-[#2B2B2B] py-20 sm:py-28"
      aria-labelledby="music-heading"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#2B2B2B]">
          <div>
            <div className="flex items-center gap-3 font-mono-hud text-xs tracking-[0.14em] uppercase text-[#9B9B9B]">
              <span className="text-[#E0313F] font-bold">03.</span>
              <span>Curated Discography</span>
            </div>
            <h2
              id="music-heading"
              className="mt-3 font-display-x text-4xl sm:text-5xl tracking-tight text-[#F4F1EA] leading-[0.98]"
            >
              THE SOUNDTRACK.
            </h2>
            <p className="mt-3 text-[#9B9B9B] text-base max-w-[54ch]">
              From standout singles to collaborations, discover the music and follow the releases
              on your favorite platform.
            </p>
          </div>

          <a
            href={CATALOG_LINKS.spotifyArtist}
            target="_blank"
            rel="noopener noreferrer"
            className="chamfer-5 inline-flex items-center gap-2 self-start md:self-auto bg-[#E0313F] hover:bg-[#c82633] text-white font-mono-hud text-xs font-bold tracking-[0.12em] uppercase px-5 py-3.5 transition-colors whitespace-nowrap shrink-0"
          >
            Open Spotify
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* 6 Featured Releases Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MUSIC_RELEASES.map((release, index) => {
            const thumbBroken = !!failedThumbs[release.id];
            return (
              <article
                key={release.id}
                className="bg-[#151515] border border-[#2B2B2B] hover:border-[#F4F1EA]/40 transition-colors flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Thumbnail Area */}
                  <button
                    type="button"
                    onClick={() => onPlayVideo(release)}
                    aria-label={`Watch ${release.title} official video`}
                    className="relative w-full aspect-[16/10] block overflow-hidden bg-[#0F0F11] cursor-pointer text-left"
                  >
                    {!thumbBroken ? (
                      <img
                        src={getYoutubeThumb(release.youtubeId)}
                        alt={`${release.title} official video thumbnail`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedThumbs((prev) => ({ ...prev, [release.id]: true }))
                        }
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1D1D20] to-[#0A0A0A] flex items-center justify-center p-4">
                        <span className="font-display-x text-2xl text-[#F4F1EA]/30 text-center">
                          {release.title}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    <div className="absolute bottom-3 right-3 w-10 h-10 bg-[#0A0A0A]/90 group-hover:bg-[#E0313F] text-[#F4F1EA] flex items-center justify-center transition-colors chamfer-5">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>

                    <span className="absolute top-3 left-3 font-mono-hud text-[11px] font-bold tracking-[0.12em] text-[#F4F1EA]/90 bg-[#0A0A0A]/80 px-2 py-0.5">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </button>

                  {/* Track Info (Zero-Pill Unboxed Metadata) */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 font-mono-hud text-[11px] uppercase tracking-[0.1em] text-[#9B9B9B]">
                      <span className="text-[#E0313F] font-semibold">
                        {release.releaseDateLabel || release.year}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{release.eraTag}</span>
                    </div>

                    <h3 className="mt-2 font-sinhala text-xl font-semibold text-[#F4F1EA] leading-snug">
                      {release.title}
                      {release.sinhalaTitle && (
                        <span className="block text-sm font-normal text-[#9B9B9B] mt-0.5">
                          {release.sinhalaTitle}
                        </span>
                      )}
                    </h3>

                    {release.collaborators && (
                      <p className="mt-2 font-mono-hud text-xs text-[#F4F1EA]/75">
                        {release.collaborators}
                      </p>
                    )}

                    <p className="mt-3 text-sm text-[#9B9B9B] leading-relaxed">
                      {release.creditsNote}
                    </p>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-5 py-3.5 border-t border-[#2B2B2B] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onPlayVideo(release)}
                    className="inline-flex items-center gap-1.5 font-mono-hud text-xs font-bold uppercase tracking-[0.1em] text-[#F4F1EA] hover:text-[#E0313F] transition-colors cursor-pointer py-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    Watch
                  </button>

                  <div className="flex items-center gap-4">
                    {release.spotifyUrl && (
                      <a
                        href={release.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono-hud text-[11px] uppercase tracking-[0.1em] text-[#9B9B9B] hover:text-[#F4F1EA] transition-colors"
                      >
                        Spotify
                      </a>
                    )}
                    {release.appleMusicUrl && (
                      <a
                        href={release.appleMusicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono-hud text-[11px] uppercase tracking-[0.1em] text-[#9B9B9B] hover:text-[#F4F1EA] transition-colors"
                      >
                        Apple Music
                      </a>
                    )}
                    <a
                      href={release.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${release.title} on YouTube`}
                      className="text-[#9B9B9B] hover:text-[#E0313F] transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Official Streaming Catalog Strip (Project: KALUNIKA + Direct Singles) */}
        <div className="mt-10 bg-[#151515] border border-[#2B2B2B] p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-[#0A0A0A] border border-[#2B2B2B] flex items-center justify-center shrink-0 text-[#E0313F]">
              <Disc3 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-mono-hud text-[11px] uppercase tracking-[0.14em] text-[#9B9B9B]">
                Verified Streaming Catalog
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[#F4F1EA]">
                Project: KALUNIKA &amp; Official Singles
              </h3>
              <p className="mt-1 text-sm text-[#9B9B9B]">
                Stream the existing Apple Music album <em className="not-italic text-[#F4F1EA]">Project: KALUNIKA</em> alongside verified singles on Spotify and Apple Music.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={CATALOG_LINKS.appleProjectKalunika}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[#2B2B2B] hover:border-[#E0313F] text-[#F4F1EA] font-mono-hud text-[11px] uppercase tracking-[0.1em] px-4 py-2.5 transition-colors whitespace-nowrap"
            >
              Project: KALUNIKA
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={CATALOG_LINKS.spotify100100}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[#2B2B2B] hover:border-[#E0313F] text-[#F4F1EA] font-mono-hud text-[11px] uppercase tracking-[0.1em] px-4 py-2.5 transition-colors whitespace-nowrap"
            >
              100/100 (Spotify)
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={CATALOG_LINKS.appleColomboToMumbai}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[#2B2B2B] hover:border-[#E0313F] text-[#F4F1EA] font-mono-hud text-[11px] uppercase tracking-[0.1em] px-4 py-2.5 transition-colors whitespace-nowrap"
            >
              Colombo To Mumbai
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
