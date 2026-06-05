// controller/dashboard_con.js

const db = require('../config/db');
const {logerror} =require("../config/helper");

// =====================================
// ADMIN SUMMARY
// =====================================

exports.adminSummary =
async (req, res) => {

  try {

    // Total Students
    const [students] =
    await db.query(`
      SELECT COUNT(*) AS totalStudents
      FROM students
    `);

    // Total Teachers
    const [teachers] =
    await db.query(`
      SELECT COUNT(*) AS totalTeachers
      FROM teachers
    `);

    // Total Enrollment
    const [enrollment] =
    await db.query(`
      SELECT COUNT(*) AS totalEnrollment
      FROM enrollments
    `);

    // Total Payments
    const [payments] =
    await db.query(`
      SELECT
      IFNULL(SUM(Amount),0)
      AS totalPayments
      FROM payments
      WHERE Status='paid'
    `);

    // Pending Payments 
    const [pending] =
    await db.query(`
      SELECT COUNT(*) AS pendingPayments
      FROM payments
      WHERE Status='pending'
    `);

    // Paid Students
    const [paidStudents] =
    await db.query(`
      SELECT COUNT(DISTINCT StudentId)
      AS paidStudents
      FROM payments
      WHERE Status='paid'
    `);

    res.json({

      totalStudents:
      students[0].totalStudents,

      totalTeachers:
      teachers[0].totalTeachers,

      totalEnrollment:
      enrollment[0].totalEnrollment,

      totalPayments:
      payments[0].totalPayments,

      pendingPayments:
      pending[0].pendingPayments,

      paidStudents:
      paidStudents[0].paidStudents,

    });

  } catch (error) {
     logerror("admin Summary staff",error,res);
  }

};

// =====================================
// CHART REVENUE
// =====================================

exports.chartRevenue =
async (req, res) => {

  try {

    const [rows] =
    await db.query(`
      SELECT
      MONTH(PaymentDate) AS month,
      SUM(Amount) AS total
      FROM payments
      WHERE Status='paid'
      GROUP BY MONTH(PaymentDate)
      ORDER BY month ASC
    `);

    res.json(rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
      "Revenue chart failed"
    });

  }

};

// =====================================
// TEACHER SUMMARY
// =====================================

exports.teacherSummary =
async (req, res) => {

  try {

    const [students] =
    await db.query(`
      SELECT COUNT(*) AS totalStudents
      FROM students
    `);

    const [attendance] =
    await db.query(`
      SELECT COUNT(*) AS totalAttendance
      FROM attendance
    `);

    const [classes] =
    await db.query(`
      SELECT COUNT(*) AS totalClasses
      FROM classes
    `);

    res.json({

      totalStudents:
      students[0].totalStudents,

      totalAttendance:
      attendance[0].totalAttendance,

      totalClasses:
      classes[0].totalClasses,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
      "Teacher summary failed"
    });

  }

};

// controller/dashboard_con.js

exports.teacher_Summary = async (req, res) => {
  try {
    const [result] = await db.query(`
SELECT
  COUNT(*) AS totalTeachers,

  SUM(Shift = 'Morning') AS morningTeachers,
  SUM(Shift = 'Afternoon') AS afternoonTeachers,
  SUM(Shift = 'Evening') AS eveningTeachers,

  SUM(Shift = 'Morning + Afternoon') AS morningAfternoonTeachers,
  SUM(Shift = 'Morning + Evening') AS morningEveningTeachers,
  SUM(Shift = 'Afternoon + Evening') AS afternoonEveningTeachers,
  SUM(Shift = 'Morning + Afternoon + Evening') AS allShiftTeachers

FROM teachers
`);
    res.json({
      totalTeachers:
        result[0].totalTeachers || 0,

      morningTeachers:
        result[0].morningTeachers || 0,

      afternoonTeachers:
        result[0].afternoonTeachers || 0,

      eveningTeachers:
        result[0].eveningTeachers || 0,

      morningAfternoonTeachers:
        result[0].morningAfternoonTeachers || 0,

      morningEveningTeachers:
        result[0].morningEveningTeachers || 0,

      afternoonEveningTeachers:
        result[0].afternoonEveningTeachers || 0,

      allShiftTeachers:
        result[0].allShiftTeachers || 0,
    });

  } catch (error) {
    logerror("Teacher Data Summary", error, res);
  }
};
// =====================================
// TODAY CLASSES
// =====================================

exports.todayClasses =
async (req, res) => {

  try {

    const [rows] =
    await db.query(`
      SELECT *
      FROM schedules
      WHERE DayName =
      DAYNAME(NOW())
    `);

    res.json(rows);

  } catch (error) {


  }

};


exports.getDashboardStatsAdmin = async (req, res) => {
  try {
    const [[teacher]] = await db.query(
      `SELECT COUNT(*) AS TotalTeacher FROM teachers`
    );

    const [[student]] = await db.query(
      `SELECT COUNT(*) AS TotalStudent FROM students`
    );

    const [[payment]] = await db.query(
      `SELECT COALESCE(SUM(Amount),0) AS TotalPayment
       FROM payments`
    );

    const [[classes]] = await db.query(
      `SELECT COUNT(*) AS TotalClass FROM classes`
    );

    const [activities] = await db.query(`
      SELECT
        Action,
        CreatedAt
      FROM activity_logs
      ORDER BY CreatedAt DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      stats: {
        totalTeacher: teacher.TotalTeacher,
        totalStudent: student.TotalStudent,
        totalPayment: payment.TotalPayment,
        totalClass: classes.TotalClass,
      },
      activities,
    });
  } catch (error) {
    logerror("Admin Dashboard Data",error,res);
  }
};

exports.getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user.Id;

    // Total Classes
    const [[classes]] = await db.query(
      `
      SELECT COUNT(*) totalClasses
      FROM classes
      WHERE TeacherId = ?
      `,
      [teacherId]
    );

    // Total Students
    const [[students]] = await db.query(
      `
      SELECT COUNT(*) totalStudents
      FROM students
      WHERE TeacherId = ?
      `,
      [teacherId]
    );

    // Today Attendance
    const [[attendance]] = await db.query(
      `
      SELECT COUNT(*) totalAttendance
      FROM student_attendance
      WHERE TeacherId_mark = ?
      AND AttendanceDate = CURDATE()
      `,
      [teacherId]
    );

    // Attendance Rate Today
    const totalStudents =
      students.totalStudents || 0;

    const attendanceRate =
      totalStudents > 0
        ? (
            (attendance.totalAttendance /
              totalStudents) *
            100
          ).toFixed(1)
        : 0;

    // Weekly Attendance
    const [weeklyAttendance] =
      await db.query(
        `
        SELECT
          DATE_FORMAT(
            AttendanceDate,
            '%a'
          ) day,
          COUNT(*) count
        FROM student_attendance
        WHERE TeacherId_mark = ?
        AND AttendanceDate >= DATE_SUB(
          CURDATE(),
          INTERVAL 7 DAY
        )
        GROUP BY AttendanceDate
        ORDER BY AttendanceDate
        `,
        [teacherId]
      );

    // My Classes
    const [todayClasses] =
      await db.query(
        `
        SELECT
          ClassName,
          Shift,
          Room
        FROM classes
        WHERE TeacherId = ?
        ORDER BY ClassName
        `,
        [teacherId]
      );

    res.json({
      success: true,

      totalClasses:
        classes.totalClasses,

      totalStudents:
        students.totalStudents,

      todayAttendance:
        attendance.totalAttendance,

      attendanceRate,

      weeklyAttendance,

      todayClasses,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};