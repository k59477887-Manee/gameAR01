// ==========================================
// เครื่องชั่งมหัศจรรย์ AR - Google Apps Script Backend (Code.gs)
// ==========================================

// รหัส Google Spreadsheet (รองรับทั้งเปิดจากชีตโดยตรง หรือ Standalone Web App)
const SPREADSHEET_ID = "1Z7_IcnxZzo7z2KWJU57CEMV2yzFB41yEtygjQqn4jMQ";

// ชื่อชีตที่ต้องการบันทึกข้อมูลคะแนน (ถ้าไม่มีระบบจะสร้างให้เอง)
const SHEET_NAME = "Leaderboard";

/**
 * ฟังก์ชันช่วยดึง Spreadsheet
 */
function getSpreadsheet() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch(e) {}
  
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  throw new Error("ไม่พบ Google Spreadsheet");
}

// ==========================================
// 1. ฟังก์ชันเสิร์ฟหน้าเว็บ (เปิดเกม)
// ==========================================
function doGet(e) {
  var html = HtmlService.createHtmlOutputFromFile("index");
  html.setTitle("เครื่องชั่งมหัศจรรย์ AR");
  html.addMetaTag("viewport", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
  html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return html;
}

// ==========================================
// 2. ฟังก์ชันตั้งค่าชีตอัตโนมัติ (เพิ่มหัวคอลัมน์)
// ==========================================
function setupSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // สร้างหัวคอลัมน์
    var headers = [
      "Timestamp", "SessionID", "PlayerName", "Score", 
      "HighestLevel", "CorrectAnswers", "WrongAttempts", "PlayTime"
    ];
    sheet.appendRow(headers);
    // ทำตัวหนาที่แถวแรกและใส่สีส้มธีมเกม
    sheet.getRange("A1:H1")
         .setFontWeight("bold")
         .setBackground("#F97316")
         .setFontColor("#FFFFFF")
         .setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ==========================================
// 3. ฟังก์ชันบริการข้อมูลอันดับ (รองรับ google.script.run)
// ==========================================
function getLeaderboardData() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) { sheet = setupSheet(); }
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  data.shift(); // ตัดแถวหัวตารางออก
  var players = [];
  for (var i = 0; i < data.length; i++) {
    var name = data[i][2]; // คอลัมน์ C: PlayerName
    if (name && String(name).trim() !== "") {
      players.push({
        name: String(name),
        score: parseInt(data[i][3]) || 0, // คอลัมน์ D: Score
        time: parseInt(data[i][7]) || 0   // คอลัมน์ H: PlayTime
      });
    }
  }
  
  // เรียงลำดับ: คะแนนมากไปน้อย -> ถ้าคะแนนเท่ากันดูเวลาที่น้อยกว่า
  players.sort(function(a, b) {
    if (b.score !== a.score) { return b.score - a.score; }
    return a.time - b.time;
  });
  
  return players.slice(0, 10).map(function(p, index) {
    return { rank: index + 1, name: p.name, score: p.score, time: p.time };
  });
}

function saveScoreData(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) { sheet = setupSheet(); }
  
  var nowStr = Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyy-MM-dd HH:mm:ss");
  var d = data || {};
  var rowData = [
    d.Timestamp || nowStr,
    d.SessionID || "",
    d.PlayerName || "ผู้เล่น",
    d.Score || 0,
    d.HighestLevel || 1,
    d.CorrectAnswers || 0,
    d.WrongAttempts || 0,
    d.PlayTime || 0
  ];
  sheet.appendRow(rowData);
  return { status: "success" };
}

// ==========================================
// 4. ฟังก์ชันรับข้อมูล POST (doPost)
// ==========================================
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var contents = e.postData ? e.postData.contents : "{}";
    var payload = JSON.parse(contents);
    
    if (payload.action === "getLeaderboard") {
      var top10 = getLeaderboardData();
      return ContentService.createTextOutput(JSON.stringify(top10)).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (payload.action === "saveScore") {
      var res = saveScoreData(payload.data);
      return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": "Unknown action"})).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()})).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
