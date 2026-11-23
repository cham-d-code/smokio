export type MusicRelease = {
  id: string;
  title: string;
  sinhalaTitle?: string;
  year: number;
  releaseDateLabel?: string;
  featured?: boolean;
  collaborators?: string;
  creditsNote: string;
  category: 'featured' | 'recent' | 'archive';
  youtubeId: string;
  youtubeUrl: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  eraTag: string;
};

export type TimelineMilestone = {
  year: string;
  title: string;
  detail: string;
  attribution?: string;
};

export type SocialLink = {
  id: string;
  label: string;
  handle: string;
  url: string;
  group: 'music' | 'social' | 'hub';
};

export type HeroHotspot = {
  id: string;
  label: string;
  tagCode?: string;
  title: string;
  specs: [string, string, string];
  primaryActionLabel: string;
  primaryActionUrl: string;
  youtubeId?: string;
  secondaryActionLabel?: string;
  secondaryActionUrl?: string;
  hitTest: (x: number, y: number) => boolean;
};

export type GalleryFrame = {
  id: string;
  index: string;
  title: string;
  category: string;
  aspect: 'wide' | 'tall' | 'square';
  artDirectionNote: string;
  assetSlot: string;
  imageUrl?: string;
  imageAlt?: string;
  objectPosition?: string;
  photoCredit?: string;
};

// User-provided Kevin Smokio artist photography
export const HERO_MEDIA = {
  portraitUrl: '/assets/hooded-streetwear-portrait.png',
  cinemaStillUrl: '/assets/aistudio/image_c08686c3.png',
  alt: 'Kevin Smokio wearing a black hoodie and gold-framed sunglasses',
};

export const ARTIST_PROFILE = {
  stageName: 'SMOKIO',
  fullStageName: 'Kevin Smokio',
  eyebrow: 'SRI LANKAN HIP-HOP / SINHALA RAP',
  heroHeadlineLine1: 'Real rhymes.',
  heroHeadlineLine2: 'Raw energy.',
  heroSubcopy:
    "A distinct voice from Sri Lanka's Sinhala hip-hop scene. Explore the tracks, visuals and creative journey of Kevin Smokio.",
  roles: 'Rapper, Singer & Lyricist',
  scene: 'Colombo, Sri Lanka · Sinhala Hip-Hop',
  estLabel: 'EST. IN THE SCENE · 2010',
  aboutShortHeading: 'BUILT IN THE CULTURE.',
  aboutShortCopy:
    "Known as Smokio, Kevin Smokio is a Sri Lankan rapper, singer and lyricist whose work spans solo tracks and collaborations across Sinhala hip-hop. From his early days in the local rap scene to releases such as Kamini, Colombo Rebellion, 100/100 and KUDDAH, his music has been part of the genre's evolving sound.",
  aboutLongHeading: 'THE STORY BEHIND THE SOUND.',
  aboutLongCopy:
    "Smokio's involvement in Sinhala rap dates back to the early 2010s, a period he described in a 2015 interview about recording with friends and contributing to the 44 Kalliya crew. Across subsequent years he released solo material, worked with artists including Ramesses Reezy and Tee Cee, and developed a catalog that includes Kamini and Colombo Rebellion. More recent releases such as 100/100, KUDDAH, Colombo To Mumbai and ASAWEN show the continuing pace of his work.",
};

export const MUSIC_RELEASES: MusicRelease[] = [
  {
    id: 'asawen',
    title: 'ASAWEN',
    year: 2026,
    releaseDateLabel: '17 NOV 2026',
    featured: true,
    collaborators: 'Adeesha Beats · Wagmee',
    creditsNote:
      'Production by Adeesha Beats; direction by Wagmee. Video description connects the release to KALUNIKA 2.0.',
    category: 'featured',
    youtubeId: '80ncN1pHSR8',
    youtubeUrl: 'https://www.youtube.com/watch?v=80ncN1pHSR8',
    spotifyUrl: 'https://open.spotify.com/artist/6NgfAmWM9yXAtnqvlmEkpc',
    eraTag: 'KALUNIKA 2.0 ERA',
  },
  {
    id: 'kuddah',
    title: 'KUDDAH (Reply Diss)',
    year: 2026,
    releaseDateLabel: 'JAN 2026',
    featured: true,
    creditsNote:
      'Official music video. The Source (Jan 2026) reported the release drew wide attention across Sri Lankan hip-hop.',
    category: 'featured',
    youtubeId: 'QIUu0qeHY1w',
    youtubeUrl: 'https://www.youtube.com/watch?v=QIUu0qeHY1w',
    spotifyUrl: 'https://open.spotify.com/artist/6NgfAmWM9yXAtnqvlmEkpc',
    eraTag: 'OFFICIAL VIDEO',
  },
  {
    id: 'colombo-to-mumbai',
    title: 'Colombo To Mumbai',
    sinhalaTitle: 'අත් උඩ',
    year: 2026,
    releaseDateLabel: 'MAY 2026',
    featured: true,
    collaborators: 'Chamath Sangeeth · MC Soul',
    creditsNote:
      'Cross-border collaboration credited to Kevin Smokio, Chamath Sangeeth and MC Soul.',
    category: 'recent',
    youtubeId: 'VSk0SYvRCGU',
    youtubeUrl: 'https://www.youtube.com/watch?v=VSk0SYvRCGU',
    appleMusicUrl:
      'https://music.apple.com/us/album/colombo-to-mumbai-single/6767604593',
    eraTag: 'COLLAB SINGLE',
  },
  {
    id: '100-100',
    title: '100/100',
    year: 2025,
    releaseDateLabel: '2025',
    collaborators: 'Feat. SYKO KYAN',
    creditsNote: 'Single and official music video featuring SYKO KYAN.',
    category: 'recent',
    youtubeId: 'iXFPp3dU4GE',
    youtubeUrl: 'https://www.youtube.com/watch?v=iXFPp3dU4GE',
    spotifyUrl: 'https://open.spotify.com/album/6O1GwKskkYfkSizmqcLZtI',
    eraTag: 'SINGLE + VIDEO',
  },
  {
    id: 'colombo-rebellion',
    title: 'Colombo Rebellion',
    sinhalaTitle: 'කොළඹ කැරැල්ල',
    year: 2022,
    releaseDateLabel: '2022',
    creditsNote: 'Solo official music video rooted in Colombo street culture.',
    category: 'archive',
    youtubeId: 'niONT_-a8uw',
    youtubeUrl: 'https://www.youtube.com/watch?v=niONT_-a8uw',
    spotifyUrl: 'https://open.spotify.com/artist/6NgfAmWM9yXAtnqvlmEkpc',
    eraTag: 'SOLO ANTHEM',
  },
  {
    id: 'kamini',
    title: 'Kamini',
    sinhalaTitle: 'කාමිණී',
    year: 2021,
    releaseDateLabel: '2021',
    collaborators: 'Feat. Ramesses Reezy & Tee Cee',
    creditsNote:
      'Official music video featuring Ramesses Reezy and Tee Cee; directed by Wagmee.',
    category: 'archive',
    youtubeId: '9pmjTLTL4sc',
    youtubeUrl: 'https://www.youtube.com/watch?v=9pmjTLTL4sc',
    spotifyUrl: 'https://open.spotify.com/artist/6NgfAmWM9yXAtnqvlmEkpc',
    eraTag: 'CATALOG CLASSIC',
  },
];

export const CATALOG_LINKS = {
  spotifyArtist: 'https://open.spotify.com/artist/6NgfAmWM9yXAtnqvlmEkpc',
  spotify100100: 'https://open.spotify.com/album/6O1GwKskkYfkSizmqcLZtI',
  appleProjectKalunika:
    'https://music.apple.com/us/album/project-kalunika/1787169942',
  appleColomboToMumbai:
    'https://music.apple.com/us/album/colombo-to-mumbai-single/6767604593',
  youtubeChannel: 'https://www.youtube.com/channel/UCIy8KA-a5QM_xF-mmwOrj9g',
  youtubeHandle: 'https://www.youtube.com/@Z30K10',
  latestVideo: 'https://www.youtube.com/watch?v=80ncN1pHSR8',
};

export const CAREER_TIMELINE: TimelineMilestone[] = [
  {
    year: '2010',
    title: 'Early Sinhala Rap Roots',
    detail:
      'Began creating Sinhala rap and recording early tracks alongside friends in the Colombo-area underground scene.',
    attribution: 'Recalled in 2015 Wagmee interview',
  },
  {
    year: '2015',
    title: '44 Kalliya Crew',
    detail:
      'Discussed his work and creative chemistry with the 44 Kalliya crew in an interview hosted by Wagmee.',
  },
  {
    year: '2016',
    title: 'Mudukkuwen Eliyata',
    detail:
      'Featured alongside Iraj on Mudukkuwen Eliyata, documented in Decibel coverage and public Sinhala hip-hop archives.',
  },
  {
    year: '2021',
    title: 'Kamini (කාමිණී)',
    detail:
      'Released Kamini featuring Ramesses Reezy and Tee Cee with an official music video.',
  },
  {
    year: '2022',
    title: 'Colombo Rebellion',
    detail:
      'Dropped Colombo Rebellion (කොළඹ කැරැල්ල) as a solo official music video statement.',
  },
  {
    year: '2025',
    title: '100/100',
    detail:
      'Released 100/100 featuring SYKO KYAN as a single on streaming platforms and an official music video.',
  },
  {
    year: 'JAN 2026',
    title: 'KUDDAH (Reply Diss)',
    detail:
      'KUDDAH drew wide attention across the scene; The Source reported over one million views within 24 hours.',
    attribution: 'Historical press report, not a live counter',
  },
  {
    year: 'MAY 2026',
    title: 'Colombo To Mumbai',
    detail:
      'Joined forces with Chamath Sangeeth and MC Soul for the single and video Colombo To Mumbai (අත් උඩ).',
  },
  {
    year: 'NOV 2026',
    title: 'ASAWEN',
    detail:
      'Released the official video for ASAWEN (17 Nov 2026), produced by Adeesha Beats and directed by Wagmee, referencing KALUNIKA 2.0.',
  },
];

// 5 interactive hit-test zones mapped directly onto Kevin Smokio's portrait (left 440..1000, top 32..900)
export const HERO_HOTSPOTS: HeroHotspot[] = [
  {
    id: 'asawen',
    label: 'ASAWEN (2026)',
    tagCode: 'TRK 01 / ASAWEN',
    title: 'ASAWEN · 17 NOV 2026',
    specs: [
      'PROD. ADEESHA BEATS · DIR. WAGMEE',
      'VIDEO REFERENCES KALUNIKA 2.0',
      'LATEST VERIFIED OFFICIAL VIDEO',
    ],
    primaryActionLabel: 'WATCH ON YOUTUBE',
    primaryActionUrl: 'https://www.youtube.com/watch?v=80ncN1pHSR8',
    youtubeId: '80ncN1pHSR8',
    secondaryActionLabel: 'SPOTIFY',
    secondaryActionUrl: 'https://open.spotify.com/artist/6NgfAmWM9yXAtnqvlmEkpc',
    // Red cap & crown zone
    hitTest: (x, y) => x >= 610 && x <= 865 && y >= 130 && y <= 265,
  },
  {
    id: 'kuddah',
    label: 'KUDDAH (REPLY DISS)',
    tagCode: 'TRK 02 / KUDDAH + CATALOG',
    title: 'KUDDAH · JAN 2026',
    specs: [
      'OFFICIAL REPLY DISS MUSIC VIDEO',
      'COVERED BY THE SOURCE (JAN 2026)',
      'SINHALA HIP-HOP BREAKOUT MOMENT',
    ],
    primaryActionLabel: 'WATCH ON YOUTUBE',
    primaryActionUrl: 'https://www.youtube.com/watch?v=QIUu0qeHY1w',
    youtubeId: 'QIUu0qeHY1w',
    secondaryActionLabel: 'ALL VIDEOS',
    secondaryActionUrl: '#videos',
    // Tinted aviator sunglasses & profile face zone
    hitTest: (x, y) => x >= 605 && x <= 835 && y >= 265 && y <= 390,
  },
  {
    id: 'kalunika',
    label: 'PROJECT: KALUNIKA',
    title: 'PROJECT: KALUNIKA',
    specs: [
      'ALBUM CATALOG ON APPLE MUSIC',
      'RAPPER · SINGER · LYRICIST',
      'COLOMBO / SINHALA RAP SCENE',
    ],
    primaryActionLabel: 'OPEN APPLE MUSIC',
    primaryActionUrl:
      'https://music.apple.com/us/album/project-kalunika/1787169942',
    secondaryActionLabel: 'EXPLORE MUSIC',
    secondaryActionUrl: '#music',
    // Hooded collar & upper shoulders
    hitTest: (x, y) => x >= 530 && x <= 905 && y >= 340 && y <= 495,
  },
  {
    id: 'colombo-to-mumbai',
    label: 'COLOMBO TO MUMBAI',
    title: 'COLOMBO TO MUMBAI (2026)',
    specs: [
      'WITH CHAMATH SANGEETH & MC SOUL',
      'RELEASED MAY 2026 · OFFICIAL VIDEO',
      'AVAILABLE ON YOUTUBE & APPLE MUSIC',
    ],
    primaryActionLabel: 'WATCH ON YOUTUBE',
    primaryActionUrl: 'https://www.youtube.com/watch?v=VSk0SYvRCGU',
    youtubeId: 'VSk0SYvRCGU',
    secondaryActionLabel: 'APPLE MUSIC',
    secondaryActionUrl:
      'https://music.apple.com/us/album/colombo-to-mumbai-single/6767604593',
    // Jacket chest graphic zone
    hitTest: (x, y) => x >= 635 && x <= 865 && y >= 495 && y <= 670,
  },
  {
    id: 'colombo-rebellion',
    label: 'CATALOG: 2010–2025',
    title: 'COLOMBO REBELLION & 100/100',
    specs: [
      '44 KALLIYA ROOTS · EST. ~2010',
      'KAMINI (2021) · COLOMBO REBELLION (2022)',
      '100/100 FEAT. SYKO KYAN (2025)',
    ],
    primaryActionLabel: 'WATCH 100/100',
    primaryActionUrl: 'https://www.youtube.com/watch?v=iXFPp3dU4GE',
    youtubeId: 'iXFPp3dU4GE',
    secondaryActionLabel: 'TIMELINE',
    secondaryActionUrl: '#about',
    // Lower jacket & sleeve silhouette inside portrait monolith
    hitTest: (x, y) => x >= 460 && x <= 980 && y >= 495 && y <= 890,
  },
];

export const OFFICIAL_SOCIALS: SocialLink[] = [
  {
    id: 'spotify',
    label: 'Spotify',
    handle: 'Smokio Artist Profile',
    url: 'https://open.spotify.com/artist/6NgfAmWM9yXAtnqvlmEkpc',
    group: 'music',
  },
  {
    id: 'apple-music',
    label: 'Apple Music',
    handle: 'Project: KALUNIKA',
    url: 'https://music.apple.com/us/album/project-kalunika/1787169942',
    group: 'music',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '@Z30K10 Official Channel',
    url: 'https://www.youtube.com/@Z30K10',
    group: 'music',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@kevinsmokioo',
    url: 'https://www.instagram.com/kevinsmokioo/',
    group: 'social',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    handle: '@kevin_smokio',
    url: 'https://www.tiktok.com/@kevin_smokio',
    group: 'social',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    handle: 'smokathareal',
    url: 'https://www.facebook.com/smokathareal',
    group: 'social',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    handle: 'KevinSmokioo Feed',
    url: 'https://t.me/s/KevinSmokioo',
    group: 'social',
  },
  {
    id: 'linktree',
    label: 'Linktree',
    handle: 'linktr.ee/KevinSmokio',
    url: 'https://linktr.ee/KevinSmokio',
    group: 'hub',
  },
  {
    id: 'featurefm',
    label: 'Feature.fm',
    handle: 'ffm.bio/kevinsmokio',
    url: 'https://ffm.bio/kevinsmokio',
    group: 'hub',
  },
];

export const GALLERY_FRAMES: GalleryFrame[] = [
  {
    id: 'front-row',
    index: '01',
    title: 'Front Row',
    category: 'Live Performance',
    aspect: 'tall',
    artDirectionNote: 'Black-and-white photo of Smokio reaching for fans in a white outfit.',
    assetSlot: '/assets/gallery/smokio-front-row.jpg',
    imageUrl: '/assets/gallery/smokio-front-row.jpg',
    imageAlt: 'Black-and-white photo of Smokio reaching for fans in a white outfit.',
    objectPosition: 'center 30%',
    photoCredit: 'Photo by Nadula De Silva Photography.',
  },
  {
    id: 'under-the-lights',
    index: '02',
    title: 'Under the Lights',
    category: 'Live Performance',
    aspect: 'wide',
    artDirectionNote: 'Smokio in a teal outfit and white cap performing in front of a crowd.',
    assetSlot: '/assets/gallery/smokio-under-the-lights.jpg',
    imageUrl: '/assets/gallery/smokio-under-the-lights.jpg',
    imageAlt: 'Smokio in a teal outfit and white cap performing in front of a crowd.',
    objectPosition: 'center 52%',
  },
  {
    id: 'on-the-mic',
    index: '03',
    title: 'On the Mic',
    category: 'Live Performance',
    aspect: 'square',
    artDirectionNote: 'Smokio rapping into a microphone in a red-and-white bandana.',
    assetSlot: '/assets/gallery/smokio-on-the-mic.jpg',
    imageUrl: '/assets/gallery/smokio-on-the-mic.jpg',
    imageAlt: 'Smokio rapping into a microphone in a red-and-white bandana.',
    objectPosition: 'center 26%',
  },
  {
    id: 'stage-portrait',
    index: '04',
    title: 'Stage Portrait',
    category: 'Live Performance',
    aspect: 'square',
    artDirectionNote: 'Smokio onstage in sunglasses and a black leather jacket.',
    assetSlot: '/assets/gallery/smokio-stage-portrait.jpg',
    imageUrl: '/assets/gallery/smokio-stage-portrait.jpg',
    imageAlt: 'Smokio onstage in sunglasses and a black leather jacket.',
    objectPosition: 'center 15%',
  },
];

export function getYoutubeThumb(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}
