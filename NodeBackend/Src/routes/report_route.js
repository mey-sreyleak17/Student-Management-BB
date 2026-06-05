const report_con = require("../controller/report_con");
const auth = require("../middlewares/auth");
const role = require("../middlewares/roles");

const report = (app) => {

  // ===== Attendance =====
  app.get("/api/reports/teacher-attendance", auth, role("staff","admin"), report_con.teacherAttendance);
  app.get("/api/reports/student-attendance", auth, role("staff","admin"), report_con.studentAttendance);
  // ===== Payment =====
  // ===== Summary (for dashboard cards) =====
  app.get("/api/reports/summary", auth, role("staff","admin"), report_con.summary);

  // ===== Chart (for graphs) =====
  app.get("/api/reports/chart", auth, role("staff","admin"), report_con.chart);
  // ===== Export =====
  app.get("/api/payments/report", auth,role("staff","admin"),report_con.getPaymentReport);
  //app.get("/api/payments/export-excel",auth,role("admin", "staff"),report_con.exportPaymentExcel);
  //app.get("/api/payments/export-pdf",auth,role("admin", "staff"),report_con.exportPaymentPDF);
  app.get("/api/students/report",auth, role("admin", "staff"),report_con.getStudentReport);
  app.get("/api/students/attendance-report",auth, role("admin", "staff"),report_con.getStudentAttendanceReport);
  app.get( "/api/teachers/report",auth,role("admin", "staff"),report_con.getTeacherReport);
  app.get("/api/students/export-pdf",auth,report_con.exportStudentPDF);
};

module.exports = report;