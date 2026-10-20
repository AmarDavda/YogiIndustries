# Yogi Industries website (Angular 20, frontend only)

Company website with category pages, product pages, cart, WhatsApp / e-mail ordering and an 8-language switcher
(English default; Gujarati, Hindi, Malayalam, Telugu, Tamil, Bengali, Assamese). No server, no database.

## Run
```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build in dist/yogi-website/browser  -> upload that folder to any static host
```
Routing uses `#/` URLs, so it works on any static hosting without rewrite rules, even in a sub-folder.

## ALL website data lives in JSON  (`public/data/`)
Edit these files - no code change needed. Refresh the page to see changes (`ng serve` reloads automatically).

| File | What it controls |
|---|---|
| `data/site.json` | company name, phone / WhatsApp / e-mail / address, map, social links, logo + image paths, menu links, footer links, language list, commitments, stats, FAQ count, policy sections, **WhatsApp / e-mail message templates**, quick messages, currency, slider speed |
| `data/catalog.json` | categories and products: id, category, price, mrp (old price -> shows SALE badge), `hero: true` (show in home slider), image paths (1-4), specs, feature keys |
| `data/i18n/<lang>.json` | every text on the website in that language (product names/descriptions, FAQ, policy, buttons...) |

Images: put files in `public/assets/images/` and use the path (e.g. `assets/images/sev1.png`) in the JSON.

### Add a product
1. Add an entry to `catalog.json` -> `products` (new unique `id`).
2. Add `p<id>.name`, `p<id>.short`, `p<id>.desc` to each file in `data/i18n/` (missing keys fall back to English).
   Use `en.json` product names - they are also used in the WhatsApp message.

### Add a category
Add `{ "id": "x", "image": "..." }` to `categories`, then `cat.x.name` and `cat.x.desc` in the i18n files.

### Add / change a language
Add it to `languages` in `site.json` and create `data/i18n/<code>.json` (copy `en.json`).

### Add FAQ / policy items
Raise `faqCount` and add `faq.q7` / `faq.a7` in the i18n files. Policy: add `{ "n": 6, "icon": "tag" }` to `policySections`
and `pol.h6` / `pol.t6`.

## Before going live - replace sample data
`site.json`: phone, WhatsApp number (digits only with country code), e-mail, address, social links.
`catalog.json`: prices, `mrp` (sample sale prices), specs. Translations were written by AI - please have a native
speaker review them.
