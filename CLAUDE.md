# P2W INTERPLUS — CONTENTS & INFLUENCER Platform

## Architecture รวม
ดู `C:\Users\witta\OneDrive\Claude AI Backup\P2W-ARCHITECTURE.md`

## โปรเจกต์นี้คืออะไร
แพลตฟอร์มสำหรับ Creator/Influencer — รับงานรีวิวสินค้า, งาน Content, งานทั่วไป
Admin โพสต์งาน → Creator สมัคร/login → ดูงานที่เปิดรับ → รับงาน

- **Live URL**: https://p2winterplus.com/influ (GitHub Pages via Cloudflare Worker)
- **Repo**: https://github.com/p2winterplus-oss/P2W-Influencer
- **Hosted**: GitHub Pages (serve จาก `docs/` folder) — ฟรี
- **Stack**: Static HTML/Tailwind CDN + Google Apps Script (Sheets backend)

## File Structure
```
/
├── docs/               — Static files (GitHub Pages serve จาก folder นี้)
│   ├── index.html      — หน้าแรก (Landing page)
│   ├── post-job.html   — หน้าฝากงาน (form → Google Sheets)
│   ├── admin.html      — Admin dashboard (อ่าน Sheets)
│   ├── logo.png
│   └── p2w-01.png … p2w-10.png
├── cloudflare-worker.js — Worker code (route /influ* → GitHub Pages)
└── apps-script.js      — Reference code สำหรับ Google Apps Script
```

## Backend: Google Apps Script
- **URL**: `https://script.google.com/macros/s/AKfycbz6ya72gdmELmCECrO28zACTdoVLcchVJXOoluHpjPTKsZnCRmYkRk5B74vvD57jHLB/exec`
- **Sheet**: "P2W Visitors" (Google Sheets) — มี 2 tabs: Visitors + Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | type=visitor | บันทึกผู้เยี่ยมชม |
| POST | type=job | บันทึกงานที่ฝาก |
| POST | type=updateStatus | อัพเดทสถานะงาน (ต้องมี key) |
| GET | ?action=jobs&key=... | Admin ดูรายการงาน |
| GET | ?action=visitors&key=... | Admin ดูผู้เยี่ยมชม |

## Admin Auth
- Key: `p2wAdmin2026` (เก็บใน localStorage ฝั่ง client)
- Validate โดย Apps Script (return error:'unauthorized' ถ้า key ผิด)

## Cloudflare Worker
- Route: `p2winterplus.com/influ*`
- `/influ` → redirect 301 → `/influ/`
- `/influ/*` → proxy ไป GitHub Pages (strip prefix)

## Design System
- **Primary color**: Bronze `#C5A880`
- **Dark bg**: `#0D0D0C` / **Light bg**: `#F9F8F6`
- **Fonts**: Playfair Display (headings) + Prompt (body)
- **Style**: Luxury architectural fine-line
- **Dark/Light mode**: localStorage key `p2w-review-theme` (default: dark) — ทุกหน้า

## Navigation Flow
```
index.html (หน้าแรก)
  ├── [เข้าสู่ระบบ] → jobs.html (Creator login/portal)
  │     └── [สมัครสมาชิก] → register.html
  └── footer hidden dot → jobs.html → hidden dot below form → admin.html
```

## Hidden Admin Access
- jobs.html: มีจุดเล็กซ่อนใต้ form login → คลิกไปหน้า admin.html
- admin.html: login ด้วย ADMIN_KEY

## Contact Info
- Phone: 088-788-8364
- Email: p2w.interplus@gmail.com
- Line OA: https://lin.ee/QJax26d

## Email Integration (index.html contact form)
- **Service**: Web3Forms
- **API Key**: `c5363896-f578-4dd8-ad46-f481f5514982`
- **Destination**: `pm.p2w.interplus@gmail.com`

## Progress
### Done ✅
- **index.html** — Landing page สมบูรณ์
  - Header (logo ใหญ่ + dark-mode bronze stroke) + Hero + Services + Portfolio modal + Pricing + Contact Form + Footer
  - STANDARD pricing card: running border light animation (conic-gradient, random direction/speed, pause 5-10s)
  - Dark/Light mode, Web3Forms, Visitor tracker (Google Apps Script), Mobile bottom nav, Toast, Fade-up animations
  - ปุ่ม CTA "เข้าสู่ระบบ" → jobs.html (เปลี่ยนจาก "ติดต่อเราเลย")
  - **Images** (p2w-01 … p2w-10):
    - Hero bg: p2w-10 (Build Your Brand neon desk, opacity 0.28)
    - SRV-01 card: p2w-05 (studio product shot)
    - SRV-02 card: p2w-07 (MERCI serum outdoor)
    - Services strip บน: p2w-01 + p2w-06 (2-column)
    - Services strip ล่าง: p2w-05 + p2w-03 (2-column)
    - Portfolio: p2w-02, p2w-04, p2w-07, p2w-09
    - Pricing banner: p2w-08 (amber bottle clean studio)
  - Thai text fix: `leading-[1.45]` + `padding:0.35em 0.25em 0.15em 0.05em; overflow:visible` บน span "วางใจได้"
- **jobs.html** — Creator portal
  - Header P2W INTERPLUS + dark/light toggle
  - Login form (JWT) + job listing (เห็นเฉพาะ approved creators)
  - Hidden admin dot ใต้ login form
- **register.html** — สมัคร Creator
  - Platforms: Instagram, TikTok, YouTube, Facebook, Twitter, Shopee, Lazada, อื่นๆ (free-text)
  - Header P2W INTERPLUS
- **admin.html** — Admin dashboard
  - Login page: P2W INTERPLUS header (มีปุ่มโฮม + dark/light toggle)
  - Dashboard header: P2W ADMIN + ONLINE status + dark/light toggle + ปุ่มโฮม + ปุ่มออก
  - จัดการงาน: เพิ่ม/แก้/ลบ jobs (channels: รวม Shopee, Lazada, อื่นๆ)
  - จัดการ Creator: อนุมัติ/reject
- **Backend** (Railway)
  - Express + PostgreSQL, JWT auth, ADMIN_KEY auth
  - SSL auto-detect (internal vs external Railway URL)
  - Global crash protection (unhandledRejection + uncaughtException)
  - try/catch ใน async routes ทุก route

### TODO ❌
- ส่วนอัพเดทสถานะงานใหม่ๆ → เปลี่ยนเป็น Facebook logo/link (รอ link จากเจ้าของ)
- เพิ่ม Visitor tracker บน post-job.html
