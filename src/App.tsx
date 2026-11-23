/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import { MonsSmokioHero } from './components/MonsSmokioHero';
import { StickyNavbar } from './components/StickyNavbar';
import { LatestDropSection } from './components/LatestDropSection';
import { AboutTimelineSection } from './components/AboutTimelineSection';
import { MusicSection } from './components/MusicSection';
import { VideoGallerySection } from './components/VideoGallerySection';
import { GalleryShowsContact } from './components/GalleryShowsContact';
import { VideoLightbox, type ActiveVideoState } from './components/VideoLightbox';
import type { MusicRelease } from './data/smokio';

export default function App() {
  const [activeVideo, setActiveVideo] = useState<ActiveVideoState | null>(null);

  const handlePlayRelease = useCallback((release: MusicRelease) => {
    setActiveVideo({
      youtubeId: release.youtubeId,
      title: `${release.title} (${release.year})`,
      youtubeUrl: release.youtubeUrl,
    });
  }, []);

  const handlePlayYoutube = useCallback(
    (youtubeId: string, title: string, youtubeUrl: string) => {
      setActiveVideo({ youtubeId, title, youtubeUrl });
    },
    []
  );

  const handleScrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F1EA]">
      <StickyNavbar onScrollToSection={handleScrollToSection} />

      <main>
        <MonsSmokioHero
          onPlayYoutube={handlePlayYoutube}
          onScrollToSection={handleScrollToSection}
        />

        <LatestDropSection />
        <AboutTimelineSection />
        <MusicSection onPlayVideo={handlePlayRelease} />
        <VideoGallerySection onPlayVideo={handlePlayRelease} />
        <GalleryShowsContact onScrollToSection={handleScrollToSection} />
      </main>

      <VideoLightbox
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
}
