// Cloudflare Worker — P2W INTERPLUS Path Router
// Route: p2winterplus.com/influ*

const GITHUB_PAGES = 'https://p2winterplus-oss.github.io/P2W-Influencer'

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

    // /influ (ไม่มี /) → redirect ไป /influ/ เพื่อให้ relative path ของรูปทำงานถูก
    if (path === '/influ') {
      return Response.redirect(url.origin + '/influ/', 301)
    }

    // /influ/* → GitHub Pages (ตัด prefix /influ ออก)
    if (path.startsWith('/influ/')) {
      const stripped = path.slice('/influ'.length)
      return fetch(new Request(GITHUB_PAGES + stripped + url.search, init))
    }

    // อื่นๆ → หน้าหลัก
    return fetch(request)
  },
}
