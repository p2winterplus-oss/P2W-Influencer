// ============================================================
// P2W INTERPLUS — Google Apps Script
// ใส่ code นี้แทน code เดิมทั้งหมดใน Apps Script Editor
// แล้ว Deploy > Manage Deployments > สร้าง Version ใหม่
// ============================================================

const ADMIN_KEY = 'p2wAdmin2026';

// ─────────────────────────────────────────
// POST Handler
// ─────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.type === 'visitor')      return handleVisitor(data);
    if (data.type === 'job')          return handleJob(data);
    if (data.type === 'updateStatus') return handleUpdateStatus(data);
    return jsonResp({ error: 'unknown type' });
  } catch (err) {
    return jsonResp({ error: err.message });
  }
}

// ─────────────────────────────────────────
// GET Handler  (Admin only — ต้องส่ง key)
// ─────────────────────────────────────────
function doGet(e) {
  try {
    const action = e.parameter.action;
    const key    = e.parameter.key;
    if (key !== ADMIN_KEY) return jsonResp({ error: 'unauthorized' });

    if (action === 'jobs')     return getJobs();
    if (action === 'visitors') return getVisitors();
    return jsonResp({ error: 'unknown action' });
  } catch (err) {
    return jsonResp({ error: err.message });
  }
}

// ─────────────────────────────────────────
// บันทึกผู้เยี่ยมชม
// ─────────────────────────────────────────
function handleVisitor(data) {
  const sheet = getOrCreateSheet('Visitors', [
    'วันที่/เวลา','IP','ประเทศ','เมือง','ISP','หน้า','อุปกรณ์','Browser','OS','Referrer','ประเภท'
  ]);
  sheet.appendRow([
    thaiNow(),
    data.ip       || '',
    data.country  || '',
    data.city     || '',
    data.isp      || '',
    data.page     || '/',
    data.device   || '',
    data.browser  || '',
    data.os       || '',
    data.referrer || '',
    data.isBot ? 'บอท' : 'มนุษย์',
  ]);
  return jsonResp({ success: true });
}

// ─────────────────────────────────────────
// บันทึกงานที่ฝาก
// ─────────────────────────────────────────
function handleJob(data) {
  const sheet = getOrCreateSheet('Jobs', [
    'วันที่/เวลา','ชื่อ/แบรนด์','เบอร์','Line/Email','ประเภทงาน','ช่องทาง','รายละเอียด','งบประมาณ','กำหนดเวลา','สถานะ'
  ]);
  sheet.appendRow([
    thaiNow(),
    data.name        || '',
    data.phone       || '',
    data.contact     || '',
    data.jobTypes    || '',
    data.channels    || '',
    data.description || '',
    data.budget      || '',
    data.deadline    || '',
    'รอติดต่อ',
  ]);
  return jsonResp({ success: true });
}

// ─────────────────────────────────────────
// อัพเดทสถานะงาน
// ─────────────────────────────────────────
function handleUpdateStatus(data) {
  if (data.key !== ADMIN_KEY) return jsonResp({ error: 'unauthorized' });
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Jobs');
  if (!sheet) return jsonResp({ error: 'no Jobs sheet' });
  const row = parseInt(data.row);
  if (isNaN(row) || row < 2) return jsonResp({ error: 'invalid row' });
  sheet.getRange(row, 10).setValue(data.status); // col 10 = สถานะ
  return jsonResp({ success: true });
}

// ─────────────────────────────────────────
// ดึงรายการงาน (Admin)
// ─────────────────────────────────────────
function getJobs() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Jobs');
  if (!sheet) return jsonResp({ jobs: [] });
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return jsonResp({ jobs: [] });
  const headers = rows[0];
  const jobs = rows.slice(1).map((row, i) => {
    const obj = { _row: i + 2 };
    headers.forEach((h, j) => { obj[h] = fmtCell(row[j]); });
    return obj;
  }).reverse(); // ใหม่สุดก่อน
  return jsonResp({ jobs });
}

// ─────────────────────────────────────────
// ดึงข้อมูลผู้เยี่ยมชม (Admin)
// ─────────────────────────────────────────
function getVisitors() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Visitors');
  if (!sheet) return jsonResp({ visitors: [], total: 0, humans: 0 });
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return jsonResp({ visitors: [], total: 0, humans: 0 });
  const headers  = rows[0];
  const dataRows = rows.slice(1);
  const total    = dataRows.length;
  const humans   = dataRows.filter(r => r[10] !== 'บอท').length;
  const recent   = dataRows.slice(-50).reverse().map(row => {
    const obj = {};
    headers.forEach((h, j) => { obj[h] = fmtCell(row[j]); });
    return obj;
  });
  return jsonResp({ visitors: recent, total, humans });
}

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
         .setFontWeight('bold')
         .setBackground('#C5A880')
         .setFontColor('#0D0D0C');
  }
  return sheet;
}

function thaiNow() {
  return Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss');
}

function fmtCell(v) {
  if (v instanceof Date) return Utilities.formatDate(v, 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss');
  return v;
}

function jsonResp(data) {
  return ContentService
    .createTextResponse(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
