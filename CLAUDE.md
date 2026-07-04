# P2W INTERPLUS — CONTENTS & INFLUENCER Platform

## Architecture รวม
ดู `C:\Users\witta\OneDrive\Claude AI Backup\P2W-ARCHITECTURE.md`

## โปรเจกต์นี้คืออะไร
แพลตฟอร์มสำหรับ Creator/Influencer — ลูกค้าฝากงานรีวิวสินค้า/Content → Admin รับและดูงานใน dashboard

- **Live URL**: https://p2winterplus.com/influ
- **Repo**: https://github.com/p2winterplus-oss/P2W-Influencer
- **Hosted**: GitHub Pages (serve จาก `docs/` folder) — ฟรี
- **Stack**: Static HTML + Tailwind CDN + Google Apps Script (Sheets backend)
- **Routing**: Cloudflare Worker `p2w-review-router` → route `p2winterplus.com/influ*`

## File Structure
```
/
├── docs/                — GitHub Pages serve จาก folder นี้
│   ├── index.html       — หน้าแรก (Landing page)
│   ├── post-job.html    — หน้าฝากงาน (form → Google Sheets)
│   ├── admin.html       — Admin dashboard (อ่าน Sheets, no backend)
│   ├── robots.txt       — อนุญาต bot ทุกตัว รวม AI crawlers
│   ├── sitemap.xml      — Sitemap สำหรับ Google Search Console
│   ├── llms.txt         — AI-readable site description (llms.txt standard)
│   ├── logo.png
│   └── p2w-01.png … p2w-10.png  — Creator/product photos
├── cloudflare-worker.js — Worker code (route /influ* → GitHub Pages)
└── apps-script.js       — Reference code สำหรับ Google Apps Script
```

## Backend: Google Apps Script
- **URL**: `https://script.google.com/macros/s/AKfycbz6ya72gdmELmCECrO28zACTdoVLcchVJXOoluHpjPTKsZnCRmYkRk5B74vvD57jHLB/exec`
- **Google Sheet**: "P2W Visitors" — มี 2 tabs: `Visitors` + `Jobs`

| Method | Payload/Param | Description |
|--------|---------------|-------------|
| POST | `type:'visitor'` | บันทึกผู้เยี่ยมชม |
| POST | `type:'job'` | บันทึกงานที่ฝาก |
| POST | `type:'updateStatus', key, row, status` | อัพเดทสถานะงาน |
| GET | `?action=jobs&key=...` | Admin ดูรายการงาน |
| GET | `?action=visitors&key=...` | Admin ดูผู้เยี่ยมชม |

## Admin Auth
- Key: `p2wAdmin2026` (เก็บใน localStorage ฝั่ง client)
- Validate โดย Apps Script (return `error:'unauthorized'` ถ้า key ผิด)
- เข้าถึงได้ที่ `p2winterplus.com/influ/admin.html`

## Cloudflare Worker
- Worker name: `p2w-review-router`
- Route: `p2winterplus.com/influ*`
- `/influ` → 301 redirect → `/influ/` (เพื่อให้ relative path ของรูปทำงานถูก)
- `/influ/*` → proxy ไป `https://p2winterplus-oss.github.io/P2W-Influencer/` (strip prefix)
- Worker file backup: `cloudflare-worker.js` ในรูท repo

## Design System
- **Primary color**: Bronze `#C5A880`
- **Dark bg**: `#0D0D0C` / **Light bg**: `#F9F8F6`
- **Fonts**: Playfair Display (headings) + Prompt (body)
- **Style**: Luxury architectural fine-line
- **Dark/Light mode**: localStorage key `p2w-review-theme` (default: dark) — ทุกหน้า

## Navigation Flow
```
index.html (หน้าแรก)
  ├── [ฝากงาน] (header + hero CTA + mobile nav) → post-job.html
  └── admin.html เข้าได้โดยตรง (ไม่มี hidden dot แล้ว)
```

## Contact Info
- Phone: 088-788-8364
- Email: p2w.interplus@gmail.com
- Line OA: https://lin.ee/QJax26d

## Email Integration (index.html contact form)
- **Service**: Web3Forms
- **API Key**: `c5363896-f578-4dd8-ad46-f481f5514982`
- **Destination**: `pm.p2w.interplus@gmail.com`

## Images Map (docs/)
| File | Subject | ใช้ที่ไหน |
|------|---------|----------|
| p2w-01 | Content creator sunset workspace | Services strip บน (col 1) |
| p2w-02 | Live streaming 2 women beauty | Portfolio |
| p2w-03 | Outdoor review woman with bottle | Services strip ล่าง (col 2) |
| p2w-04 | Solo live Good Vibes | Portfolio |
| p2w-05 | Dark product photography studio | SRV-01 card + Services strip ล่าง (col 1) |
| p2w-06 | Travel team lake view | Services strip บน (col 2) |
| p2w-07 | MERCI serum outdoor river bg | SRV-02 card + Portfolio |
| p2w-08 | Amber bottle clean studio | Pricing banner |
| p2w-09 | Beige luxury product studio | Portfolio |
| p2w-10 | Build Your Brand neon desk | Hero background (opacity 0.28) |

## Content Structure (index.html)

### Hero Section
- **Badge**: `REVIEW_SVC // P2W_INTERPLUS_V1`
- **H1**: `AUTHENTIC VOICE. REAL IMPACT.` (Playfair Display, "REAL IMPACT." เป็น bronze gradient italic)
- **คำโปรยรอง**: สร้างกระแสด้วยรีวิวที่จริงใจ ปั้นยอดขายด้วยคอนเทนต์คุณภาพ
- **คำอธิบาย**: ยกระดับภาพลักษณ์แบรนด์ผ่านมุมมองของผู้ใช้งานจริง (Authentic User Experience)...
- **Stats** (ไม่เปลี่ยน): 100+ รีวิวสำเร็จ / 3 บริการหลัก / 24h ตอบกลับ

### Services Section (`SERVICES.01`)
| Ref | Label | Title | Image |
|-----|-------|-------|-------|
| SRV-01 | PRODUCT | Product Review & Storytelling | p2w-05 |
| SRV-02 | LIFESTYLE | Destination & Lifestyle Review | p2w-07 |
| SRV-03 | Specialist & Creator Network | Creator Synergy Network | (icon only) |

### Portfolio Section (`PROJECT_FILE.log`)
- Sub: `PROVEN IMPACT & SUCCESS STORIES`
- 4 items: LIVE_CONTENT_01, LIVE_CREATOR_01, PRODUCT_SHOOT_01, STUDIO_SHOT_01

### Pricing Section (`PACKAGES.02`)
- Sub: โซลูชันคอนเทนต์ที่ออกแบบมาเพื่อสเกลธุรกิจทุกระดับ โดยทีมโปรดักชันมืออาชีพ

| Code | Name | Title |
|------|------|-------|
| PKG-01 // MICRO-INFLUENCER | Authentic Review | เจาะกลุ่ม Niche |
| PKG-02 // VIRAL & TRENDING | Viral Content | สร้างกระแสไวรัล ⭐ แนะนำ |
| PKG-03 // BRAND STORYTELLING | Premium Production | ยกระดับองค์กร |

### Contact Section
- **Heading**: `LET'S CREATE SYNERGY`
- **Form fields**: ชื่อ-นามสกุล, **บริษัท/หน่วยงาน** (ใหม่), เบอร์โทร/อีเมล, ประเภทบริการ, รายละเอียดงาน
- **Service dropdown options**: Product Review & Storytelling, Destination & Lifestyle Review, Creator Synergy Network, PKG-01/02/03, อื่นๆ

## SEO & AI Discoverability
- **robots.txt**: Allow all bots incl. GPTBot, Claude-Web, PerplexityBot, Google-Extended, CCBot
- **sitemap.xml**: index.html + post-job.html — submit ที่ Google Search Console
- **llms.txt**: AI-readable description ตาม llms.txt standard
- **Meta tags** (index.html): canonical, OG (title/desc/image), Twitter Card
- **JSON-LD**: ProfessionalService schema + 3 Offer items (ราคาขึ้นอยู่กับประเภทงาน)
- **Google Search Console**: ต้อง submit sitemap manually ที่ `https://p2winterplus.com/influ/sitemap.xml`

## Progress
### Done ✅
- **index.html** — Landing page สมบูรณ์
  - Header + Hero + Services + Portfolio modal + Pricing + Contact Form + Footer
  - PKG-02 card: running border light animation
  - Dark/Light mode, Web3Forms, Visitor tracker, Mobile bottom nav, Toast, Fade-up
  - ปุ่ม CTA "ฝากงาน" → post-job.html (header, hero, mobile nav)
  - Hero h1: AUTHENTIC VOICE. REAL IMPACT. (Playfair + bronze gradient)
  - SEO meta tags: canonical, OG, Twitter Card, JSON-LD ProfessionalService
  - Contact form: เพิ่มช่อง บริษัท/หน่วยงาน
- **post-job.html** — หน้าฝากงาน
  - Form: ชื่อ/แบรนด์, เบอร์, Line/Email, ประเภทงาน, ช่องทาง, รายละเอียด, งบ, กำหนด
  - POST → Apps Script → Google Sheet "Jobs" tab
  - Success state หลัง submit
- **admin.html** — Admin dashboard (Sheets-based, ไม่มี backend)
  - Login ด้วย Admin Key → validate ผ่าน Apps Script GET
  - Dashboard: stat cards (งานรวม, รอติดต่อ, visitors, คนจริง)
  - Tab งานที่ฝาก: table + dropdown อัพเดทสถานะ (รอติดต่อ/ติดต่อแล้ว/ปิดงาน)
  - Tab ผู้เยี่ยมชม: recent 50 visits จาก Sheets
- **robots.txt** — Allow all crawlers + AI bots ✅
- **sitemap.xml** — index.html + post-job.html ✅
- **llms.txt** — AI-readable site description ✅
- **GitHub Pages** — serve จาก `docs/` folder ✅ Live
- **Cloudflare Worker** `p2w-review-router` — route `p2winterplus.com/influ*` ✅ Live
- **Apps Script** — อัพเดทแล้ว รองรับ visitor + job + admin read
- **Railway** — ปิดแล้ว (ไม่มีค่าใช้จ่าย)

### TODO ❌
- เพิ่ม Facebook logo/link ใน index.html (รอ link เพจ/กลุ่ม)
- เพิ่ม Visitor tracker บน post-job.html
- Submit sitemap ใน Google Search Console (ต้องทำเอง)
