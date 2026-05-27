# க.பொ.த (உயர் தரம்) இரசாயனவியல் — தமிழ் வளநூல்

Interactive Tamil-medium GCE Advanced Level Chemistry study platform aligned with the NIE Sri Lanka syllabus.

## Live site

Deploy to [Vercel](https://vercel.com) by importing this repository. No build step is required for deployment—the site is served as static HTML.

## Local development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Regenerate HTML from Markdown

```bash
npm run build
```

This runs `convert.js`, which reads `AL_Chemistry_Tamil_Master.md` and writes `AL_Chemistry_Tamil_Master.html` and `index.html`.

## Project structure

| File | Purpose |
|------|---------|
| `index.html` | Entry point for Vercel (same content as master HTML) |
| `AL_Chemistry_Tamil_Master.html` | Compiled study platform |
| `AL_Chemistry_Tamil_Master.md` | Source markdown |
| `convert.js` | MD → HTML converter |
| `vercel.json` | Vercel routing and headers |

## Deploy on Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New Project** → import the repository.
3. Framework preset: **Other** (static).
4. Build command: leave empty, or `npm run build` if you changed the markdown.
5. Output directory: `.` (root).
6. Deploy.

## Credits

Prepared & analyzed by **J.Abiraj** — BSc (Hons) Computer Science.
