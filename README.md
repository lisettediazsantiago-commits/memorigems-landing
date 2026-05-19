# MemoriGems — Website

The MemoriGems landing page.
**Tagline:** *Memory may fade. Connection doesn't have to.*

A product of [HuLux Innovations](https://huluxinnovations-web.vercel.app).

---

## 📁 Project Structure

```
memorigems-website/
├── public/
│   └── index.html       ← The whole site (HTML/CSS/JS in one file)
├── vercel.json          ← Vercel deployment config
├── firebase.json        ← Firebase Hosting config (alternative)
├── .gitignore
└── README.md
```

---

## 🚀 Deploy to Vercel (recommended)

1. Push this repo to GitHub via GitHub Desktop
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the GitHub repo
4. Click Deploy — your site is live in ~60 seconds

---

## 🌍 Connecting mymemorigems.com

Once deployed to Vercel:
1. Vercel dashboard → Project → Settings → Domains
2. Add `mymemorigems.com` and `www.mymemorigems.com`
3. Vercel will show you DNS records (an A record and/or CNAME)
4. Add those records at your domain registrar (Tailor Brands)
5. Wait 5–30 minutes for DNS to propagate
6. Vercel auto-issues a free SSL certificate

---

## 🛠 Editing the Site

Everything is in **`public/index.html`** — HTML, CSS, and JavaScript all in one file.

**Common edits:**

- **Founder bios:** Search for `<section class="founder"` or `<section class="cofounders"`
- **Add Edwina's headshot:** Replace the `.cofounder-portrait` div content in the second cofounder block — swap the label for an `<img>` tag
- **Update waitlist email handler:** Search for `function handleSubmit` and replace with your email service endpoint (Formspree, Mailchimp, etc.)
- **Update contact email:** Search for `LisetteDiazSantiago@huluxinnovations.com`

---

## 🎨 Brand Tokens

```css
--beige-cream: #F7F1E4   /* primary background */
--beige-warm:  #F0E7D2   /* alternate section background */
--beige-deep:  #E6D9BC   /* footer background */
--gold:        #B89248   /* mid gold */
--gold-warm:   #C9A66C   /* gold accents */
--gold-deep:   #8C6E32   /* "Gems" wordmark + headlines */
--sage:        #8FA28A   /* sage hint - decorative motes */
--sage-deep:   #5E7359   /* sage italic accent words */
--sage-mist:   #DDE5DA   /* "What You Preserve" background */
--ink:         #2A2317   /* primary text */
--ink-soft:    #524634   /* body text + "Memori" wordmark */
```

Fonts (Google Fonts, already loaded):
- **Cormorant Garamond** — wordmark, headlines, body
- **Cinzel** — eyebrow labels, small caps elements
- **Inter** — nav links, buttons

---

## 📝 License

© 2026 MemoriGems by HuLux Innovations. All rights reserved.
