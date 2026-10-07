# G Force Security — Student Concept Site

A student coursework project: a static website for **G Force Security**, a fictional Zambian security services company (guarding, risk consulting, cash-in-transit and electronic security).

> **Not affiliated with any real company.** All company name, addresses, phone numbers, emails, statistics, quotes and copy are made-up placeholders. The shield logo is an original placeholder icon. The site is marked `noindex, nofollow`, displays a visible disclaimer banner, and should be treated as coursework only — take it down before any public/production use.

## Stack

- Plain HTML, CSS, vanilla JavaScript. No build step, no runtime server, no database.
- Contact form handled by a [Cloudflare Pages Function](https://developers.cloudflare.com/pages/functions/) (`/functions/contact.js`), which forwards submissions to a third-party endpoint (e.g. Formspree) set via an environment variable. If the Page Function is unreachable or unconfigured, the browser falls back to a `mailto:` link (addressed to `gforcesecure11@gmail.com`).
- The page intentionally includes a visible "student concept, not affiliated with any real company" banner and a `noindex, nofollow` robots meta tag.

## Project structure

```
├── index.html            # Single-page site — the "Modernist" v2 design, exported to clean static HTML
├── _ds/                  # "Modernist" design-system tokens + component CSS used by index.html
├── "G Force Security v2.dc.html"   # Design-tool source for the v2 layout (not deployed as homepage)
├── "G Force Security.dc.html"      # Earlier design-tool source version
├── js/
│   └── main.js           # Hero + scroll-reveal animations and contact form logic
├── functions/
│   └── contact.js        # Cloudflare Pages Function → POST /contact
├── assets/
│   ├── favicon.svg
│   └── img/              # hero-guard, lusaka, team, k9 images
├── github.md
└── README.md
```

> The `.dc.html`, `support.js`, `image-slot.js` and `uploads/` files are artifacts of the design tool the v2 layout was created in. `index.html` is a hand-exported, self-contained static version and does not depend on them.

## Run locally

Because this is a static project you can open `index.html` directly, but the Pages Function needs a local runner:

```bash
npx wrangler pages dev .
```

Site: http://localhost:8788. The `/contact` endpoint is only live with the wrangler dev server (or on Cloudflare Pages).

## Deploy to Cloudflare Pages

1. Push this folder to a GitHub repository.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository.
4. Configure the build:
   - **Project name:** e.g. `secureguard-zambia`
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** leave empty (no build step)
   - **Build output directory:** `/` (the site root; the repo already has `index.html` at root)
   - **Root directory:** `/`
5. Click **Save and Deploy**. Cloudflare Pages automatically detects the `/functions` folder and deploys `contact.js` as a Function.
6. On first visit after deploy, Cloudflare will prompt you to assign a URL to the Functions router — accept the suggested `/*` route (this is normal for Pages with Functions).

### Contact form configuration

The function reads the `FORMSPREE_ENDPOINT` environment variable:

1. Create a free form at [formspree.io](https://formspree.io) and copy its endpoint URL (e.g. `https://formspree.io/f/xxxxx`).
2. In the Pages project, go to **Settings → Environment variables** and add `FORMSPREE_ENDPOINT` with that URL (repeat under **Production** and any preview branches).
3. Redeploy. Form submissions on `/contact` will now be forwarded to Formspree and delivered to the email you configured there.

If `FORMSPREE_ENDPOINT` is not set, the Function still returns success in "demo mode" and `main.js` falls back to opening the visitor's email app with a pre-filled message.

### Custom domain

1. In the Pages project, go to **Custom domains → Set up a custom domain**.
2. Type your domain (use a neutral, own domain of your choosing — this is a coursework concept for a fictional brand).
3. Follow the instructions to update DNS at your registrar with the Cloudflare-assigned nameservers (for Cloudflare-registered domains) or the `CNAME` record Cloudflare shows you (external registrar).
4. Wait for propagation (up to a few hours). Cloudflare auto-provisions a TLS certificate.

### Manual / CLI deployment (alternative)

```bash
npx wrangler pages deploy . --project-name secureguard-zambia
```

## Replacing placeholder imagery

Images live in `assets/img/` (`hero-guard.jpg`, `team.png`, `k9-handler.jpg`, `k9-portrait.png`, `lusaka.jpg`). The CCTV and VIP card visuals are SVG placeholders in `index.html`. Replace them with licensed photos when you have access to actual imagery (keep the same filenames or update the references):

1. Add files under `assets/img/`.
2. Update `src` attributes in `index.html`.

## Content notes

- Every fact on the page is fictional placeholder content: the company, founding year, address, phone, email, client names and statistics are illustrative only.
- The copy, layout and behaviour are inspired by the design brief for a fictional security brand; no real company, logo or text is reproduced.
- Images are royalty-free **Wikimedia Commons** photos stored locally under `assets/img/` (hero: South African security guard; about: Lusaka skyline). They were selected from file titles (the author could not preview the images), so treat them as provisional and swap in licensed photos before any wider use.
- Do NOT ship to production, register the brand, or pass any of this off as a real company. The site exists purely to demonstrate front-end skills for coursework.