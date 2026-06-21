# P2W INTERPLUS — CONTENTS & INFLUENCER Platform

## Architecture รวม
ดู `C:\Users\witta\OneDrive\Claude AI Backup\P2W-ARCHITECTURE.md`

## โปรเจกต์นี้คืออะไร
แพลตฟอร์มสำหรับ Creator/Influencer — รับงานรีวิวสินค้า, งาน Content, งานทั่วไป
Admin โพสต์งาน → Creator สมัคร/login → ดูงานที่เปิดรับ → รับงาน

- **Live URL**: https://p2winterplus.com (Railway)
- **Repo**: https://github.com/p2winterplus-oss/P2W-Influencer
- **Hosted**: Railway (auto-deploy จาก GitHub main branch)
- **Stack**: Node.js + Express + PostgreSQL (Railway) + HTML/Tailwind CDN frontend

## File Structure
```
/
├── server.js           — Express app entry point
├── package.json
├── db/
│   ├── index.js        — PostgreSQL pool (pg)
│   └── schema.sql      — CREATE TABLE creators, jobs
├── routes/
│   ├── auth.js         — POST /api/auth/register, /login, /me
│   ├── jobs.js         — GET /api/jobs (creator: ดูงาน)
│   └── admin.js        — Admin CRUD jobs + creators (x-admin-key header)
├── middleware/
│   └── auth.js         — JWT verify middleware
└── public/             — Static files served by Express
    ├── index.html      — หน้าแรก (Landing page)
    ├── jobs.html       — Creator portal (login + ดูงาน)
    ├── register.html   — สมัครสมาชิก Creator
    ├── admin.html      — Admin dashboard (ซ่อน)
    └── logo.png
```

## API Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | - | สมัคร Creator |
| POST | /api/auth/login | - | Creator login → JWT |
| GET | /api/auth/me | JWT | ดูข้อมูลตัวเอง |
| GET | /api/jobs | JWT | Creator ดูงานทั้งหมด |
| GET | /api/admin/jobs | x-admin-key | Admin ดูงาน |
| POST | /api/admin/jobs | x-admin-key | Admin เพิ่มงาน |
| PATCH | /api/admin/jobs/:id | x-admin-key | Admin แก้งาน |
| DELETE | /api/admin/jobs/:id | x-admin-key | Admin ลบงาน |
| GET | /api/admin/creators | x-admin-key | Admin ดู creators |
| PATCH | /api/admin/creators/:id | x-admin-key | Admin อนุมัติ/reject |
| GET | /api/health | - | Health check |

## Database Schema
- **creators**: id, name, email, phone, password(bcrypt), platforms[], followers, category, status(pending/approved/rejected), created_at
- **jobs**: id, code(P2W-001), title, description, content_type[], duration, deadline, location, channels[], budget, requirements, contact_note, status(open/urgent/very_urgent/taken/completed/cancelled), created_at, updated_at

## Auth System
- Creator: JWT (7 วัน) — `Authorization: Bearer <token>`
- Admin: `x-admin-key` header — ตรวจกับ `process.env.ADMIN_KEY`

## Railway Environment Variables
| Variable | Value |
|----------|-------|
| DATABASE_URL | postgresql://postgres:...@postgres.railway.internal:5432/railway |
| ADMIN_KEY | p2wAdmin2026 |
| PORT | (Railway inject อัตโนมัติ) |

## SSL Note
- Internal Railway hostname (`postgres.railway.internal`) → SSL disabled
- External proxy URL → SSL enabled
- Logic: `(DATABASE_URL).includes('.railway.internal') ? false : { rejectUnauthorized: false }`

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
- ลบ `/api/debug-key` endpoint ออกจาก server.js (ค้างไว้ชั่วคราว)
- เพิ่ม Visitor tracker บน jobs.html และ register.html
- ซื้อโดเมน p2winterplus.com แล้ว point ไป Railway
