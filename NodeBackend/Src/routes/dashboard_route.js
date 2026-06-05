const dashboard_con =
require("../controller/dashboard_con");

const adminOnly =
require("../middlewares/adminOnly");

const auth = require("../middlewares/auth");
const role=require("../middlewares/roles");

const teacherOnly =
require("../middlewares/teacherOnly");

const dashboard = (app) => {

  // =========================
  // Admin Dashboard
  // =========================

  app.get(
    "/api/dashboard/admin/summary",
    auth,
    role("staff","admin"),
    dashboard_con.adminSummary
  );
  
  app.get(
  "/api/dashboard/admin-summary",
  auth,adminOnly,
  dashboard_con.getDashboardStatsAdmin
);
  app.get(
    "/api/dashboard/admin-chart",
    auth,
    adminOnly,
    dashboard_con.chartRevenue
  );

  // =========================
  // Teacher Dashboard
  // =========================

  app.get(
    "/api/dashboard/teacher/summary",
    auth,
    teacherOnly,
    dashboard_con.teacherSummary
  );
  app.get("/api/dashboard/teacher-sumary",auth,teacherOnly,dashboard_con.getTeacherDashboard);
  app.get(
    "/api/dashboard/teacher/summary-staff",
    auth,
    role("staff","admin"),
    dashboard_con.teacher_Summary
  );

  app.get(
    "/api/dashboard/teacher/today-classes",
    auth,
    teacherOnly,
    dashboard_con.todayClasses
  );

};

module.exports = dashboard;