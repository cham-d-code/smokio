# Asset & Launch Setup Guide — SMOKIO Portfolio Concept

This project is built as a research-backed artist portfolio concept for **Kevin Smokio (SMOKIO)**. Before publishing publicly or representing the site as official, complete the following asset and authorization steps.

## 1. Approved Artist Photography (`public/images/`)
Per rights-first guidelines, third-party social/streaming CDN photographs are not hotlinked and no fabricated likenesses of the artist are used. Once licensed high-resolution photos are provided by the artist or photographer, place WebP/AVIF assets in `public/images/` and wire them in `src/data/smokio.ts`:

- `public/images/press-portrait-01.webp` — Primary editorial press portrait
- `public/images/live-stage-02.webp` — Live performance photograph (with photographer credit)
- `public/images/studio-session-03.webp` — Recording studio still
- `public/images/set-stills-04.webp` — Music video behind-the-scenes photography

### Optional Custom Hero Unmask Cutouts
The interactive WebGL unmask hero currently uses the stylized streetwear masked-to-unmasked cutout pair from the MONS brief as visual art direction. If the artist provides a pixel-aligned masked/unmasked studio shoot (2048×1360 transparent WebP), replace `HERO_MEDIA.maskedUrl` and `HERO_MEDIA.unmaskedUrl` in `src/data/smokio.ts`.

## 2. Verified Management & Booking Contact
Currently, the Contact section validates enquiries and formats a copy-ready brief without pretending to send an email. Once an authorized management email endpoint is approved:
1. Connect a server-side email route with rate-limiting and honeypot checks.
2. Update the form submit handler in `src/components/GalleryShowsContact.tsx` to display confirmation only after a verified HTTP 2xx server response.

## 3. Shows & Legal Attribution
- Add confirmed upcoming concert dates to the Shows section only when officially announced.
- Update the footer copyright owner once site ownership and artist authorization are confirmed.
