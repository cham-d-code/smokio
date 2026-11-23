import React from 'react';
import { ARTIST_PROFILE, CAREER_TIMELINE, HERO_MEDIA } from '../data/smokio';

export const AboutTimelineSection: React.FC = () => {
  return (
    <section
      id="about"
      className="bg-[#0A0A0A] text-[#F4F1EA] border-t border-[#2B2B2B] py-20 sm:py-28"
      aria-labelledby="about-heading"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#2B2B2B]">
          <div className="flex items-center gap-3 font-mono-hud text-xs tracking-[0.14em] uppercase text-[#9B9B9B]">
            <span className="text-[#E0313F] font-bold">02.</span>
            <span>Artist Profile &amp; Trajectory</span>
          </div>
          <span className="font-mono-hud text-xs tracking-[0.12em] uppercase text-[#9B9B9B]">
            {ARTIST_PROFILE.estLabel}
          </span>
        </div>

        {/* Bio Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2
                id="about-heading"
                className="font-display-x text-4xl sm:text-5xl tracking-tight text-[#F4F1EA] leading-[0.98] text-balance"
              >
                {ARTIST_PROFILE.aboutShortHeading}
              </h2>

              <p className="mt-6 text-[#F4F1EA]/90 text-base sm:text-lg leading-relaxed">
                {ARTIST_PROFILE.aboutShortCopy}
              </p>
            </div>

            {/* Key Verified Facts Strip */}
            <div className="mt-8 pt-6 border-t border-[#2B2B2B] space-y-3 font-mono-hud text-xs">
              <div className="flex items-baseline justify-between gap-4">
                <span className="uppercase tracking-[0.12em] text-[#9B9B9B]">Identity</span>
                <span className="text-[#F4F1EA] text-right">Smokio / Kevin Smokio</span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="uppercase tracking-[0.12em] text-[#9B9B9B]">Roles</span>
                <span className="text-[#F4F1EA] text-right">{ARTIST_PROFILE.roles}</span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="uppercase tracking-[0.12em] text-[#9B9B9B]">Scene</span>
                <span className="text-[#F4F1EA] text-right">{ARTIST_PROFILE.scene}</span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="uppercase tracking-[0.12em] text-[#9B9B9B]">Early Crew</span>
                <span className="text-[#F4F1EA] text-right">44 Kalliya</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Editorial Still of Kevin Smokio */}
            <figure className="relative overflow-hidden border border-[#2B2B2B] bg-[#151515] aspect-[16/9]">
              <img
                src={HERO_MEDIA.cinemaStillUrl}
                alt="Kevin Smokio close-up in black hoodie and gold-trimmed sunglasses"
                className="w-full h-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 px-5 py-3.5 flex items-center justify-between gap-4 font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#F4F1EA]/90">
                <span>Kevin Smokio · Visual Archive</span>
                <span className="text-[#E0313F]">Colombo, LK</span>
              </figcaption>
            </figure>

            <div className="bg-[#151515] border border-[#2B2B2B] p-6 sm:p-8 flex-1">
              <p className="font-mono-hud text-[11px] uppercase tracking-[0.14em] text-[#E0313F]">
                {ARTIST_PROFILE.aboutLongHeading}
              </p>
              <p className="mt-4 text-[#F4F1EA]/80 text-base leading-[1.75]">
                {ARTIST_PROFILE.aboutLongCopy}
              </p>
              <p className="mt-5 font-mono-hud text-[11px] tracking-[0.06em] text-[#9B9B9B] leading-relaxed">
                Note: In a 2026 interview, Smokio noted roots in Piliyandala, Colombo. Timeline
                entries below reflect publicly documented interviews, press coverage, and official
                releases.
              </p>
            </div>
          </div>
        </div>

        {/* Chronological Career Timeline */}
        <div className="mt-16 pt-12 border-t border-[#2B2B2B]">
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
            <h3 className="font-mono-hud text-xs uppercase tracking-[0.16em] text-[#F4F1EA]">
              Verified Release &amp; Scene Milestones (2010–2026)
            </h3>
            <span className="font-mono-hud text-[11px] uppercase tracking-[0.1em] text-[#9B9B9B]">
              9 Documented Entries
            </span>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0 border-t border-[#2B2B2B]">
            {CAREER_TIMELINE.map((item) => (
              <li
                key={`${item.year}-${item.title}`}
                className="py-6 border-b border-[#2B2B2B] flex flex-col justify-between gap-2"
              >
                <div>
                  <span className="font-mono-hud text-xs font-bold tracking-[0.14em] text-[#E0313F]">
                    {item.year}
                  </span>
                  <h4 className="mt-2 font-sinhala text-base font-semibold text-[#F4F1EA]">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm text-[#9B9B9B] leading-relaxed">{item.detail}</p>
                </div>
                {item.attribution && (
                  <p className="mt-2 font-mono-hud text-[10px] uppercase tracking-[0.08em] text-[#9B9B9B]/75">
                    {item.attribution}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
