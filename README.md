# Intelligent IoT — Website

Enterprise IoT Solutions · East Africa · intelligenceiot.com

## Site Structure

```
intelligent-iot-website/
├── index.html          Homepage (hero, services, stats, testimonials, CTA)
├── services.html       All 9 IoT service areas with detailed feature lists
├── case-studies.html   6 East Africa case studies with real metrics
├── pricing.html        Starter / Business / Enterprise tier comparison + FAQ
├── about.html          Company story, mission, values, team
├── blog.html           6 IoT insights articles (placeholder)
├── contact.html        EmailJS contact form + contact details
├── demo.html           Full-screen demo request form → redirects to live platform
├── privacy.html        Privacy policy
└── assets/
    ├── css/style.css   Complete design system (1,000+ lines)
    ├── js/main.js      All interactions (particles, scroll reveal, forms, etc.)
    └── images/logo.svg SVG network-node logo icon
```

---

## Deploy on Cloudflare Pages (Recommended for East Africa)

**Why Cloudflare Pages?**
- Edge nodes in Nairobi, Lagos, Johannesburg, Cairo → fastest load times for African users
- Unlimited bandwidth (no surprise bills)
- Free SSL certificate automatically provisioned
- Free custom domain connection (point your DNS to Cloudflare)
- Drag-and-drop OR GitHub auto-deploy

### Option A — GitHub Auto-Deploy (Best)

1. **Push this folder to GitHub**
   ```bash
   cd intelligent-iot-website
   git init
   git add .
   git commit -m "Initial website build"
   gh repo create intelligentiot-website --public
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Click **Pages** → **Create a project** → **Connect to Git**
   - Select your GitHub repository
   - Build settings: **Framework preset: None**, Build command: *(leave blank)*, Output directory: *(leave blank)*
   - Click **Save and Deploy**

3. **Every `git push` auto-deploys** — no action needed.

### Option B — Drag and Drop

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create project
2. Click **Upload assets** (drag-and-drop option)
3. Drag the entire `intelligent-iot-website/` folder
4. Click **Deploy site**

### Connect Your Custom Domain

Once deployed on Cloudflare Pages:
1. Pages project → **Custom domains** → **Set up a custom domain**
2. Enter `intelligenceiot.com` (or your actual domain)
3. If your domain is already on Cloudflare: DNS is configured automatically
4. If domain is elsewhere: add a CNAME record → `intelligentiot-website.pages.dev`

---

## Configure EmailJS (Contact Form)

The contact form uses [EmailJS](https://www.emailjs.com) — free for 200 emails/month.

1. Create a free account at emailjs.com
2. Add an email service (Gmail, Outlook, etc.) → note the **Service ID**
3. Create an email template → note the **Template ID**
4. Go to Account → **Public Key** → copy it

5. Update `contact.html` line 8:
   ```html
   <script>emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");</script>
   ```

6. Update `assets/js/main.js` lines 96–98:
   ```js
   SERVICE_ID: 'your_service_id',
   TEMPLATE_ID: 'your_template_id',
   PUBLIC_KEY: 'your_public_key',
   ```

7. In your EmailJS template, use these variables:
   - `{{from_name}}` — sender's name
   - `{{reply_to}}` — sender's email
   - `{{company}}` — company name
   - `{{phone}}` — phone number
   - `{{subject}}` — subject
   - `{{message}}` — message body

---

## Google Analytics Setup

1. Create a GA4 property at analytics.google.com
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Uncomment and update in `<head>` of every HTML file:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

---

## Add Social Media Links

When you create social accounts, search for `href="#"` in each HTML file and replace:

| Placeholder | Replace with |
|---|---|
| LinkedIn `href="#"` | `https://www.linkedin.com/company/intelligentiot` |
| Twitter `href="#"` | `https://x.com/intelligentiot` |

---

## Update Platform URLs

When your platform moves from the current IP to your custom domain, update in all HTML files:

```
http://84.247.133.39:5173  →  https://app.intelligenceiot.com
http://84.247.133.39:5176  →  https://demo.intelligenceiot.com
```

---

## Design System Quick Reference

| Token | Value | Use |
|---|---|---|
| `--navy` | `#0B1F33` | Primary brand / dark backgrounds |
| `--blue` | `#2563EB` | CTAs, links, interactive elements |
| `--teal` | `#0EA5A4` | Accent, secondary CTAs, highlights |
| `--slate` | `#334155` | Body text |
| `--off-white` | `#F8FAFC` | Page background |

Fonts: **Plus Jakarta Sans** (headings) + **Inter** (body) — loaded from Google Fonts.

Dark mode: toggled by `data-theme="dark"` on `<html>`, persisted in `localStorage`.

---

## Performance Notes

- No JavaScript frameworks — vanilla JS only
- Particle animation uses `requestAnimationFrame` — auto-pauses when tab is hidden
- Fonts use `display=swap` — text visible before fonts load
- All images are SVG (vector, no file size)
- CSS custom properties enable instant theme switching without JavaScript layout recalc

---

*Built by Intelligent IoT — Nairobi, Kenya · info@intelligenceiot.com*
