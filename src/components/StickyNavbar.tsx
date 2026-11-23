import React, { useEffect, useState } from 'react';
import { ExternalLink, Menu, X } from 'lucide-react';
import { CATALOG_LINKS } from '../data/smokio';

interface StickyNavbarProps {
  onScrollToSection: (sectionId: string) => void;
}

const LINKS = [
  { id: 'latest-drop', label: 'Latest Drop' },
  { id: 'about', label: 'About' },
  { id: 'music', label: 'Music' },
  { id: 'videos', label: 'Videos' },
  { id: 'shows', label: 'Shows' },
  { id: 'contact', label: 'Contact' },
];

export const StickyNavbar: React.FC<StickyNavbarProps> = ({ onScrollToSection }) => {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const threshold = Math.max(360, window.innerHeight * 0.78);
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: string) => {
    setMobileOpen(false);
    onScrollToSection(id);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
      aria-label="Sticky portfolio navigation"
    >
      <div className="bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#2B2B2B]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single line) */}
          <a
            href="#stage"
            onClick={(e) => {
              e.preventDefault();
              setMobileOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-display-x text-lg tracking-tight text-[#F4F1EA] whitespace-nowrap shrink-0 hover:text-[#E0313F] transition-colors"
          >
            SMOKIO
          </a>

          {/* Zone 2: Clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main sections">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.id);
                }}
                className="font-mono-hud text-xs tracking-[0.12em] uppercase text-[#9B9B9B] hover:text-[#F4F1EA] transition-colors whitespace-nowrap shrink-0 py-2"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={CATALOG_LINKS.spotifyArtist}
              target="_blank"
              rel="noopener noreferrer"
              className="chamfer-5 inline-flex items-center gap-1.5 bg-[#E0313F] hover:bg-[#c82633] text-white font-mono-hud text-[11px] font-bold tracking-[0.12em] uppercase px-4 py-2.5 transition-colors whitespace-nowrap shrink-0"
            >
              Listen Now
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              className="md:hidden w-11 h-11 inline-flex items-center justify-center text-[#F4F1EA] border border-[#2B2B2B] hover:border-[#E0313F] transition-colors cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#2B2B2B] bg-[#0A0A0A] px-5 py-4">
            <nav className="flex flex-col divide-y divide-[#2B2B2B]" aria-label="Mobile sections">
              {LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(link.id);
                  }}
                  className="font-mono-hud text-xs tracking-[0.14em] uppercase text-[#F4F1EA] hover:text-[#E0313F] py-3.5 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
