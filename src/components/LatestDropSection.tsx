import React, { useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { CATALOG_LINKS, getYoutubeThumb } from '../data/smokio';

export const LatestDropSection: React.FC = () => {
  const [playingInline, setPlayingInline] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <section
      id="latest-drop"
      className="bg-[#0A0A0A] text-[#F4F1EA] border-t border-[#2B2B2B] py-20 sm:py-28"
      aria-labelledby="latest-drop-heading"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        {/* Editorial Kicker */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#2B2B2B]">
          <div className="flex items-center gap-3 font-mono-hud text-xs tracking-[0.14em] uppercase text-[#9B9B9B]">
            <span className="text-[#E0313F] font-bold">01.</span>
            <span>Latest Video</span>
            <span aria-hidden="true">·</span>
            <span>17 Nov 2026</span>
          </div>
          <span className="font-mono-hud text-xs tracking-[0.12em] uppercase text-[#9B9B9B]">
            KALUNIKA 2.0 Reference
          </span>
        </div>

        {/* 2-Column Split with items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-10 items-stretch">
          {/* Left: Editorial Copy */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div>
              <h2
                id="latest-drop-heading"
                className="font-display-x text-5xl sm:text-6xl tracking-tight text-[#F4F1EA] leading-[0.95] text-balance"
              >
                ASAWEN
              </h2>

              <p className="mt-6 text-[#F4F1EA]/85 text-base leading-relaxed max-w-[46ch]">
                Watch the latest verified music video from Smokio, with production by{' '}
                <strong className="font-semibold text-[#F4F1EA]">Adeesha Beats</strong> and
                direction by <strong className="font-semibold text-[#F4F1EA]">Wagmee</strong>. The
                official video description connects the release to{' '}
                <em className="not-italic text-[#F4F1EA] font-medium">KALUNIKA 2.0</em>.
              </p>

              {/* Clean Unboxed Metadata */}
              <dl className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-[#2B2B2B]">
                <div>
                  <dt className="font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#9B9B9B]">
                    Production
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-[#F4F1EA]">Adeesha Beats</dd>
                </div>
                <div>
                  <dt className="font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#9B9B9B]">
                    Direction
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-[#F4F1EA]">Wagmee</dd>
                </div>
                <div>
                  <dt className="font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#9B9B9B]">
                    Uploaded
                  </dt>
                  <dd className="mt-1.5 font-mono-hud text-sm text-[#F4F1EA]">17 Nov 2026</dd>
                </div>
                <div>
                  <dt className="font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#9B9B9B]">
                    Format
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-[#F4F1EA]">
                    Official Music Video
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {!playingInline && (
                <button
                  type="button"
                  onClick={() => setPlayingInline(true)}
                  className="chamfer-5 inline-flex items-center gap-2 bg-[#E0313F] hover:bg-[#c82633] text-white font-mono-hud text-xs font-bold tracking-[0.12em] uppercase px-6 py-3.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  Play Video Here
                </button>
              )}

              <a
                href={CATALOG_LINKS.latestVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-[#2B2B2B] hover:border-[#F4F1EA] text-[#F4F1EA] font-mono-hud text-xs font-medium tracking-[0.12em] uppercase px-5 py-3.5 transition-colors whitespace-nowrap"
              >
                Watch on YouTube
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right: Click-to-Play YouTube Embed */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full aspect-video lg:h-full lg:min-h-[380px] bg-[#151515] border border-[#2B2B2B] overflow-hidden group">
              {playingInline ? (
                <iframe
                  src="https://www.youtube-nocookie.com/embed/80ncN1pHSR8?autoplay=1&rel=0"
                  title="SMOKIO — ASAWEN Official Music Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlayingInline(true)}
                  aria-label="Play SMOKIO ASAWEN official music video"
                  className="relative w-full h-full block text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#E0313F]"
                >
                  {!thumbFailed ? (
                    <img
                      src={getYoutubeThumb('80ncN1pHSR8')}
                      alt="SMOKIO — ASAWEN official music video frame"
                      referrerPolicy="no-referrer"
                      onError={() => setThumbFailed(true)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1C1C1F] via-[#151515] to-[#0A0A0A] flex items-center justify-center">
                      <span className="font-display-x text-4xl sm:text-5xl text-[#F4F1EA]/25 tracking-wider">
                        ASAWEN
                      </span>
                    </div>
                  )}

                  {/* Measured Contrast Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-16 h-16 sm:w-20 sm:h-20 bg-[#E0313F] group-hover:bg-[#F4F1EA] text-white group-hover:text-[#0A0A0A] transition-colors flex items-center justify-center shadow-2xl chamfer-12">
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                    </span>
                  </div>

                  {/* Bottom Caption */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#E0313F]">
                        Official YouTube Premiere
                      </p>
                      <p className="mt-1 font-display-x text-xl sm:text-2xl text-[#F4F1EA]">
                        SMOKIO — ASAWEN
                      </p>
                    </div>
                    <span className="font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#F4F1EA]/80 hidden sm:inline">
                      Click to load player
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
