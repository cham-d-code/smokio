import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Calendar,
  Camera,
  Check,
  Copy,
  Info,
  X,
} from 'lucide-react';
import {
  GALLERY_FRAMES,
  OFFICIAL_SOCIALS,
  type GalleryFrame,
} from '../data/smokio';

interface GalleryShowsContactProps {
  onScrollToSection: (sectionId: string) => void;
}

type EnquiryType = 'Booking' | 'Collaboration' | 'Press' | 'Other';

interface EnquiryState {
  name: string;
  email: string;
  type: EnquiryType;
  message: string;
  website: string; // honeypot
}

const INITIAL_ENQUIRY: EnquiryState = {
  name: '',
  email: '',
  type: 'Booking',
  message: '',
  website: '',
};

export const GalleryShowsContact: React.FC<GalleryShowsContactProps> = ({
  onScrollToSection,
}) => {
  const [activeFrame, setActiveFrame] = useState<GalleryFrame | null>(null);
  const [form, setForm] = useState<EnquiryState>(INITIAL_ENQUIRY);
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryState, string>>>({});
  const [preparedBrief, setPreparedBrief] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Close gallery lightbox on Escape
  useEffect(() => {
    if (!activeFrame) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveFrame(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeFrame]);

  const validateAndPrepare = (e: React.FormEvent) => {
    e.preventDefault();
    setCopied(false);

    // Silent honeypot guard
    if (form.website.trim().length > 0) {
      return;
    }

    const nextErrors: Partial<Record<keyof EnquiryState, string>> = {};
    if (form.name.trim().length < 2) {
      nextErrors.name = 'Please enter your name (at least 2 characters).';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (form.message.trim().length < 12) {
      nextErrors.message = 'Please include a short brief (at least 12 characters).';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setPreparedBrief(null);
      return;
    }

    const formatted = [
      `SMOKIO ENQUIRY (${form.type.toUpperCase()})`,
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      `Category: ${form.type}`,
      `Message:`,
      form.message.trim(),
    ].join('\n');

    setPreparedBrief(formatted);
  };

  const handleCopyBrief = async () => {
    if (!preparedBrief) return;
    try {
      await navigator.clipboard.writeText(preparedBrief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* ── 05. Through the Lens (Editorial Gallery Archive) ── */}
      <section
        id="gallery"
        className="bg-[#0A0A0A] text-[#F4F1EA] border-t border-[#2B2B2B] py-20 sm:py-28"
        aria-labelledby="gallery-heading"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#2B2B2B]">
            <div>
              <div className="flex items-center gap-3 font-mono-hud text-xs tracking-[0.14em] uppercase text-[#9B9B9B]">
                <span className="text-[#E0313F] font-bold">05.</span>
                <span>Visual Archive</span>
              </div>
              <h2
                id="gallery-heading"
                className="mt-3 font-display-x text-4xl sm:text-5xl tracking-tight text-[#F4F1EA] leading-[0.98]"
              >
                THROUGH THE LENS.
              </h2>
              <p className="mt-3 text-[#9B9B9B] text-base max-w-[52ch]">
                Portraits, performances and moments behind the music. Structured for licensed
                photography supplied directly by the artist or credited photographers.
              </p>
            </div>

            <p className="font-mono-hud text-[11px] uppercase tracking-[0.1em] text-[#9B9B9B] max-w-[34ch] md:text-right">
              Rights-First Policy · No Unlicensed Reposting or Fabricated Likenesses
            </p>
          </div>

          {/* Bento Editorial Frames */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-6">
            {GALLERY_FRAMES.map((frame) => {
              const spanClass =
                frame.aspect === 'wide'
                  ? 'md:col-span-7 min-h-[320px] sm:min-h-[420px]'
                  : frame.aspect === 'tall'
                  ? 'md:col-span-5 min-h-[360px] sm:min-h-[420px]'
                  : 'md:col-span-6 min-h-[240px] sm:min-h-[270px]';

              if (frame.imageUrl) {
                return (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => setActiveFrame(frame)}
                    className={`${spanClass} group relative bg-[#151515] border border-[#2B2B2B] hover:border-[#E0313F]/80 transition-colors text-left cursor-pointer overflow-hidden flex flex-col justify-between p-6 sm:p-7`}
                  >
                    <img
                      src={frame.imageUrl}
                      alt={frame.imageAlt || frame.title}
                      loading="lazy"
                      style={{ objectPosition: frame.objectPosition || 'center center' }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />

                    <div className="relative flex items-start justify-between gap-4">
                      <span className="font-mono-hud text-xs font-bold tracking-[0.16em] text-[#E0313F] bg-[#0A0A0A]/80 px-2.5 py-1">
                        FRAME {frame.index}
                      </span>
                      <span className="font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#F4F1EA]/90 bg-[#0A0A0A]/70 px-2.5 py-1 group-hover:text-[#E0313F] transition-colors">
                        Expand
                      </span>
                    </div>

                    <div className="relative">
                      <p className="font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#F4F1EA]/75">
                        {frame.category}
                      </p>
                      <h3 className="mt-1.5 font-display-x text-2xl sm:text-3xl text-[#F4F1EA] leading-tight">
                        {frame.title}
                      </h3>
                      <p className="mt-2 text-sm text-[#F4F1EA]/80 max-w-[44ch] leading-relaxed">
                        {frame.artDirectionNote}
                      </p>
                    </div>
                  </button>
                );
              }

              return (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => setActiveFrame(frame)}
                  className={`${spanClass} group relative bg-[#151515] border border-[#2B2B2B] hover:border-[#E0313F]/80 transition-colors p-6 sm:p-8 flex flex-col justify-between text-left cursor-pointer overflow-hidden`}
                >
                  {/* Subtle Editorial Technical Grid Overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #F4F1EA 1px, transparent 1px), linear-gradient(to bottom, #F4F1EA 1px, transparent 1px)',
                      backgroundSize: '36px 36px',
                    }}
                    aria-hidden="true"
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <span className="font-mono-hud text-xs font-bold tracking-[0.16em] text-[#E0313F]">
                      FRAME {frame.index}
                    </span>
                    <Camera
                      className="w-4 h-4 text-[#9B9B9B] group-hover:text-[#F4F1EA] transition-colors"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="relative my-6">
                    <p className="font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#9B9B9B]">
                      {frame.category}
                    </p>
                    <h3 className="mt-2 font-display-x text-2xl sm:text-3xl text-[#F4F1EA] leading-tight">
                      {frame.title}
                    </h3>
                    <p className="mt-3 text-sm text-[#9B9B9B] max-w-[44ch] leading-relaxed">
                      {frame.artDirectionNote}
                    </p>
                  </div>

                  <div className="relative pt-4 border-t border-[#2B2B2B] flex items-center justify-between gap-4 font-mono-hud text-[11px] uppercase tracking-[0.1em]">
                    <span className="text-[#9B9B9B] truncate">{frame.assetSlot}</span>
                    <span className="text-[#F4F1EA] group-hover:text-[#E0313F] transition-colors shrink-0">
                      Inspect Slot
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Lightbox */}
      {activeFrame && (
        <div
          className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery frame ${activeFrame.title}`}
          onClick={() => setActiveFrame(null)}
        >
          <div
            className="w-full max-w-3xl bg-[#151515] border border-[#2B2B2B] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-[#2B2B2B]">
              <div>
                <p className="font-mono-hud text-[11px] uppercase tracking-[0.14em] text-[#E0313F]">
                  Frame {activeFrame.index} · {activeFrame.category}
                </p>
                <h3 className="mt-1 font-display-x text-xl sm:text-2xl text-[#F4F1EA]">
                  {activeFrame.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveFrame(null)}
                aria-label="Close gallery viewer"
                className="w-9 h-9 inline-flex items-center justify-center border border-[#2B2B2B] text-[#F4F1EA] hover:border-[#E0313F] hover:text-[#E0313F] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeFrame.imageUrl ? (
              <div>
                <div className="bg-[#050507] flex items-center justify-center max-h-[70vh] overflow-hidden">
                  <img
                    src={activeFrame.imageUrl}
                    alt={activeFrame.imageAlt || activeFrame.title}
                    className="w-full max-h-[70vh] object-contain"
                  />
                </div>
                <div className="px-6 py-4 border-t border-[#2B2B2B] text-sm text-[#9B9B9B]">
                  {activeFrame.artDirectionNote}
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-8 space-y-4 text-sm text-[#F4F1EA]/85 leading-relaxed">
                <p>{activeFrame.artDirectionNote}</p>
                <div className="bg-[#0A0A0A] border border-[#2B2B2B] p-4 font-mono-hud text-xs space-y-1.5">
                  <p className="text-[#9B9B9B] uppercase tracking-[0.1em]">Target Local Asset Path</p>
                  <p className="text-[#F4F1EA] break-all">{activeFrame.assetSlot}</p>
                </div>
                <p className="text-xs text-[#9B9B9B]">
                  Place artist-approved WebP or AVIF photography at the path above with
                  photographer credit before public launch.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 06. Live & Loud (Shows — Honest Empty State) ── */}
      <section
        id="shows"
        className="bg-[#0A0A0A] text-[#F4F1EA] border-t border-[#2B2B2B] py-20 sm:py-28"
        aria-labelledby="shows-heading"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-3 font-mono-hud text-xs tracking-[0.14em] uppercase text-[#9B9B9B] pb-8 border-b border-[#2B2B2B]">
            <span className="text-[#E0313F] font-bold">06.</span>
            <span>Live Performances &amp; Appearances</span>
          </div>

          <div className="mt-10 bg-[#151515] border border-[#2B2B2B] p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-[#9B9B9B] font-mono-hud text-xs uppercase tracking-[0.12em]">
                <Calendar className="w-4 h-4 text-[#E0313F]" aria-hidden="true" />
                <span>Schedule Status · No Verified Dates Published</span>
              </div>
              <h2
                id="shows-heading"
                className="mt-4 font-display-x text-4xl sm:text-5xl tracking-tight text-[#F4F1EA] leading-[0.98]"
              >
                LIVE &amp; LOUD.
              </h2>
              <p className="mt-4 text-[#9B9B9B] text-base leading-relaxed">
                No upcoming show dates have been confirmed for this website yet. Check official
                social channels for announcements.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="https://www.instagram.com/kevinsmokioo/"
                target="_blank"
                rel="noopener noreferrer"
                className="chamfer-5 inline-flex items-center gap-2 bg-[#E0313F] hover:bg-[#c82633] text-white font-mono-hud text-xs font-bold tracking-[0.12em] uppercase px-5 py-3.5 transition-colors whitespace-nowrap"
              >
                Follow on Instagram
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => onScrollToSection('contact')}
                className="inline-flex items-center gap-2 border border-[#2B2B2B] hover:border-[#F4F1EA] text-[#F4F1EA] font-mono-hud text-xs uppercase tracking-[0.12em] px-5 py-3.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                Booking Enquiry
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 07. Let's Connect (Official Platforms + Honest Booking Enquiry) ── */}
      <section
        id="contact"
        className="bg-[#0A0A0A] text-[#F4F1EA] border-t border-[#2B2B2B] py-20 sm:py-28"
        aria-labelledby="contact-heading"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-3 font-mono-hud text-xs tracking-[0.14em] uppercase text-[#9B9B9B] pb-8 border-b border-[#2B2B2B]">
            <span className="text-[#E0313F] font-bold">07.</span>
            <span>Channels &amp; Enquiries</span>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Verified Artist Links */}
            <div className="lg:col-span-5">
              <h2
                id="contact-heading"
                className="font-display-x text-4xl sm:text-5xl tracking-tight text-[#F4F1EA] leading-[0.98]"
              >
                LET&apos;S CONNECT.
              </h2>
              <p className="mt-4 text-[#9B9B9B] text-base leading-relaxed">
                For collaborations, performances and business enquiries, prepare a structured
                message using the form or reach verified artist channels below.
              </p>

              <div className="mt-8 border-t border-[#2B2B2B] divide-y divide-[#2B2B2B]">
                {OFFICIAL_SOCIALS.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span className="font-mono-hud text-xs font-bold uppercase tracking-[0.12em] text-[#F4F1EA] group-hover:text-[#E0313F] transition-colors shrink-0">
                        {social.label}
                      </span>
                      <span className="text-xs text-[#9B9B9B] truncate">{social.handle}</span>
                    </div>
                    <ArrowUpRight
                      className="w-4 h-4 text-[#9B9B9B] group-hover:text-[#E0313F] transition-colors shrink-0"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Validated Enquiry Builder (No fake email submission) */}
            <div className="lg:col-span-7 bg-[#151515] border border-[#2B2B2B] p-6 sm:p-8">
              <div className="flex items-start gap-3 pb-5 mb-6 border-b border-[#2B2B2B]">
                <Info className="w-4 h-4 text-[#E0313F] shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-[#9B9B9B] leading-relaxed">
                  <strong className="text-[#F4F1EA] font-semibold">
                    Direct Delivery Pending Authorization:
                  </strong>{' '}
                  No unverified personal email or phone number is published on this concept site.
                  Submitting validates and formats your enquiry so you can copy it cleanly until an
                  approved management inbox is connected.
                </p>
              </div>

              <form onSubmit={validateAndPrepare} noValidate className="space-y-5">
                {/* Honeypot anti-spam field */}
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="enquiry-website">Leave this blank</label>
                  <input
                    id="enquiry-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="enquiry-name"
                      className="block font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#9B9B9B] mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="enquiry-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name or organization"
                      className="w-full bg-[#0A0A0A] border border-[#2B2B2B] focus:border-[#E0313F] focus:outline-none px-4 py-3 text-sm text-[#F4F1EA] placeholder:text-[#9B9B9B]/50 transition-colors"
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-[#E0313F]" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-email"
                      className="block font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#9B9B9B] mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="enquiry-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full bg-[#0A0A0A] border border-[#2B2B2B] focus:border-[#E0313F] focus:outline-none px-4 py-3 text-sm text-[#F4F1EA] placeholder:text-[#9B9B9B]/50 transition-colors"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-[#E0313F]" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="enquiry-type"
                    className="block font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#9B9B9B] mb-2"
                  >
                    Enquiry Type
                  </label>
                  <select
                    id="enquiry-type"
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value as EnquiryType })
                    }
                    className="w-full bg-[#0A0A0A] border border-[#2B2B2B] focus:border-[#E0313F] focus:outline-none px-4 py-3 text-sm text-[#F4F1EA] transition-colors"
                  >
                    <option value="Booking">Booking</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Press">Press</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="enquiry-message"
                    className="block font-mono-hud text-[11px] uppercase tracking-[0.12em] text-[#9B9B9B] mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="enquiry-message"
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Share event dates, location, collaboration details, or press request..."
                    className="w-full bg-[#0A0A0A] border border-[#2B2B2B] focus:border-[#E0313F] focus:outline-none px-4 py-3 text-sm text-[#F4F1EA] placeholder:text-[#9B9B9B]/50 transition-colors resize-y"
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-[#E0313F]" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <button
                    type="submit"
                    className="chamfer-5 bg-[#E0313F] hover:bg-[#c82633] text-white font-mono-hud text-xs font-bold tracking-[0.12em] uppercase px-6 py-3.5 transition-colors cursor-pointer"
                  >
                    Prepare Enquiry
                  </button>

                  {preparedBrief && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm(INITIAL_ENQUIRY);
                        setErrors({});
                        setPreparedBrief(null);
                        setCopied(false);
                      }}
                      className="font-mono-hud text-[11px] uppercase tracking-[0.1em] text-[#9B9B9B] hover:text-[#F4F1EA] transition-colors cursor-pointer"
                    >
                      Clear Form
                    </button>
                  )}
                </div>
              </form>

              {preparedBrief && (
                <div
                  className="mt-6 pt-6 border-t border-[#2B2B2B]"
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <p className="font-mono-hud text-xs uppercase tracking-[0.12em] text-[#F4F1EA]">
                      Validated Enquiry Brief (Not Yet Emailed)
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyBrief}
                      className="inline-flex items-center gap-1.5 border border-[#2B2B2B] hover:border-[#E0313F] text-[#F4F1EA] font-mono-hud text-[11px] uppercase tracking-[0.1em] px-3 py-1.5 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#E0313F]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Enquiry Text
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-[#0A0A0A] border border-[#2B2B2B] p-4 font-mono-hud text-xs text-[#F4F1EA]/85 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {preparedBrief}
                  </pre>
                  <p className="mt-2.5 text-xs text-[#9B9B9B]">
                    Send this copied enquiry via Kevin Smokio&apos;s verified social channels until
                    an authorized management email endpoint is configured.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0A0A0A] text-[#9B9B9B] border-t border-[#2B2B2B] py-12">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#2B2B2B]">
            <div>
              <p className="font-display-x text-2xl tracking-tight text-[#F4F1EA]">SMOKIO</p>
              <p className="mt-1 text-sm text-[#9B9B9B]">
                Sri Lankan hip-hop. Music. Visuals. Culture.
              </p>
            </div>

            <nav
              className="flex flex-wrap items-center gap-6 font-mono-hud text-[11px] uppercase tracking-[0.12em]"
              aria-label="Footer navigation"
            >
              {[
                ['latest-drop', 'Latest Drop'],
                ['about', 'About'],
                ['music', 'Music'],
                ['videos', 'Videos'],
                ['gallery', 'Gallery'],
                ['shows', 'Shows'],
                ['contact', 'Contact'],
              ].map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onScrollToSection(id);
                  }}
                  className="hover:text-[#F4F1EA] transition-colors whitespace-nowrap"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#9B9B9B]">
            <p>
              &copy; {currentYear} Artist Portfolio Concept. All music, videos, and trademarks
              belong to their respective authorized rights holders.
            </p>
            <p className="font-mono-hud text-[11px] uppercase tracking-[0.08em]">
              Research-Backed Concept · Not an Official Artist Site Without Approval
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
