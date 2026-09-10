# G4S Zambia — Student Concept Site

A student coursework project: a static website modelled on **G4S Secure Solutions Zambia Ltd** (HQ: Plot 3144, Mukwa Road, Lusaka; operating since 1968; phone +260 211 244 832; sales@zm.g4s.com).

> **Not affiliated with G4S, G4S Secure Solutions Zambia Ltd, or Allied Universal.** All guard/quote imagery, icons, testimonial quotes and statistics beyond the facts listed above are placeholders. The shield logo is an original placeholder icon, NOT the G4S logo. The site is marked `noindex, nofollow` and displays a visible disclaimer banner, and should be treated as coursework only — take it down before any public/production use.

## Stack

- Plain HTML, CSS, vanilla JavaScript. No build step, no runtime server, no database.
- Contact form handled by a [Cloudflare Pages Function](https://developers.cloudflare.com/pages/functions/) (`/functions/contact.js`), which forwards submissions to a third-party endpoint (e.g. Formspree) set via an environment variable. If the Page Function is unreachable or unconfigured, the browser falls back to a `mailto:` link (addressed to `sales@zm.g4s.com`).
- The page intentionally includes a visible "student concept, not affiliated with G4S" banner and a `noindex, nofollow` robots meta tag.

## Project structure

```
├── index.html            # Single-page site (Hero, About, Services, Why Us, Sectors, Testimonials, Contact, Footer)
├── css/
│   └── style.css         # Mobile-first responsive styles
├── js/
│   └── main.js           # Sticky header, mobile nav, scroll reveal, animated counters, form logic
├── functions/
│   └── contact.js        # Cloudflare Pages Function → POST /contact
├── assets/
│   └── favicon.svg
└── README.md
```

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
2. Type your domain (choose a neutral/own domain — do not register `g4s`-infringing domains; it is a coursework concept).
3. Follow the instructions to update DNS at your registrar with the Cloudflare-assigned nameservers (for Cloudflare-registered domains) or the `CNAME` record Cloudflare shows you (external registrar).
4. Wait for propagation (up to a few hours). Cloudflare auto-provisions a TLS certificate.

### Manual / CLI deployment (alternative)

```bash
npx wrangler pages deploy . --project-name secureguard-zambia
```

## Replacing placeholder imagery

The hero and About images live in `assets/img/` (`hero-guard.jpg`, `lusaka.jpg`). Replace them with your own licensed photos when you have access to actual imagery (keep the same filenames or update the references):

1. Add files under `assets/img/` (e.g. `hero-guard.jpg`, `team.jpg`).
2. In `css/style.css`, change the `url(...)` in the `.hero` background rule.
3. In `index.html`, update the `src` of the About `<img>` and its `alt` text.

## Content notes

- Verifiable facts used from G4S Zambia's public site: legal name, founding year (1968), head office address and contact details, broad service categories (guarding, electronic security, cash solution, diplomatic/commercial/government customers), and the "G4S, An Allied Universal Company" parentage.
- All quotes, client names, branch addresses, staff counts and statistics are placeholders — the counters on the page are illustrative, not G4S figures.
- Images are royalty-free **Wikimedia Commons** photos now stored locally under `assets/img/` (hero: South African security guard; about: Lusaka skyline). They were selected from file titles (the author could not preview the images), so treat them as provisional and swap in licensed photos before any wider use.
- Do NOT ship to production, register the brand, or pass any of this off as the real company. The site exists purely to demonstrate front-end skills for coursework.