// Cloudflare Worker — P2W INTERPLUS Path Router
// Route: p2winterplus.com/*
// Deploy ที่: Cloudflare Dashboard → Workers & Pages → Create Worker

// GitHub Pages URL (หลัง enable GitHub Pages จาก docs/ folder)
const GITHUB_PAGES = 'https://p2winterplus-oss.github.io/P2W-Influencer'

// หน้า + asset ที่อยู่ใน Review (internal links จะใช้ absolute path /xxx)
const REVIEW_PAGES = ['/post-job.html', '/admin.html', '/logo.png']

export default {
  async fetch(request) {
    const url  = new URL(request.url)
    const path = url.pathname
    const init = {
      method:   request.method,
      headers:  request.headers,
      body:     ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'follow',
    }

    // /review หรือ /review/* → GitHub Pages (ตัด prefix /review ออก)
    if (path === '/review' || path.startsWith('/review/')) {
      const stripped = path === '/review' ? '/' : path.slice('/review'.length)
      return fetch(new Request(GITHUB_PAGES + stripped + url.search, init))
    }

    // หน้าและรูปที่ index.html อ้างถึงด้วย absolute path
    const isPage  = REVIEW_PAGES.includes(path)
    const isAsset = /^\/p2w-\d+\.png$/.test(path)

    if (isPage || isAsset) {
      return fetch(new Request(GITHUB_PAGES + path + url.search, init))
    }

    // อื่นๆ ทั้งหมด → หน้าหลัก (GitHub Pages P2W-Main)
    return fetch(request)
  },
}
