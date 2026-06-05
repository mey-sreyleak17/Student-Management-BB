const adminOnly = require("../middlewares/adminOnly");
const teacherOnly = require("../middlewares/teacherOnly");
const staffOnly = require("../middlewares/staffOnly");
const  studentOnly = require("../middlewares/studentOnly");
const role = require("../middlewares/roles");
const auth = require("../middlewares/auth");

const attendance_con = require("../controller/attendance_con");

const attendance = (app) => {

  // ===== TEACHER =====
  app.post("/api/attendance/teacher/check-in", auth, teacherOnly, attendance_con.checkIn);
  app.post("/api/attendance/teacher/check-out", auth, teacherOnly, attendance_con.checkOut);
  app.get("/api/attendance/teacher/today-summary", auth, teacherOnly, attendance_con.todaySummary);
  app.get("/api/attendance/classes/by-Teacher",auth,teacherOnly,attendance_con.getTeacherClasses);
  app.get("/api/attendance/teacher/history",auth,teacherOnly,attendance_con.getTeacherAttendanceHistory);

  // STUDENTS
  app.get("/api/students/attendance/getlist-stu/:classId",auth,teacherOnly,attendance_con.getStudentsByClass);
  app.get("/api/my-attendance",auth,studentOnly,attendance_con.getMyAttendance);
// ATTENDANCE
  app.get( "/api/attendance",auth,role("staff", "teacher"),attendance_con.getStudentAttendance);

  app.post("/api/attendance/student/save",auth,teacherOnly,attendance_con.saveStudentAttendance);

// STATS
  app.get(
  "/api/attendance/student-summary",auth,role("staff", "teacher"),attendance_con.todayStudentSummary);
  // ===== REPORT (SECURED) =====
  app.get("/api/attendance/student/daily", auth, role("teacher","staff"), attendance_con.getDailyAttendance);
  app.get("/api/attendance/student/monthly", auth, role("teacher","staff"), attendance_con.getMonthlyAttendance);
  app.get("/api/attendance/student/summary", auth, role("teacher","staff"), attendance_con.getSummaryAttendance);
  app.get("/api/attendance/student/history", auth, role("teacher","staff"), attendance_con.getStudentHistory);

  // ===== EXPORT =====
  app.get("/api/attendance/student/export/excel", auth, role("teacher","staff"), attendance_con.exportStudentExcel);
  app.get("/api/attendance/student/export/pdf", auth, role("teacher","staff"), attendance_con.exportStudentPDF);

  // ===== STAFF =====
  app.get("/api/attendance/teacher", auth, staffOnly, attendance_con.getTeacherAttendance);
  app.get("/api/attendance/teacher/count", auth, staffOnly, attendance_con.getAttendanceCount);
  app.get("/api/attendance/student/getlist",auth,staffOnly,attendance_con.getStudentAttendanceStaffList)
  // ===== ADMIN =====
  app.get("/api/attendance/admin/today-summary", auth, staffOnly, attendance_con.todaySummary);
  app.get("/api/attendance/admin/report", auth, adminOnly, attendance_con.attendanceReport);
};

module.exports = attendance;