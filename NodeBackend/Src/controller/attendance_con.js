const db=require("../config/db");
const { logerror } = require("../config/helper");
const {sendCheckInAlert}=require("../services/telegram_service");
//const {logerror,isEmptyorNull,}=require("../config/helper");
const ExcelJS = require("exceljs");
const axios = require('axios'); // កុំភ្លេច npm install axios
const PDFDocument = require("pdfkit");

const todaySummary = async (req, res) => {
    try {
        // 1. Total teachers from the master teacher table
        const [totalTeachers] = await db.query(
            `SELECT COUNT(*) as total FROM teachers`
        );

        // 2. Count unique teachers who checked in today
        const [checkedIn] = await db.query(
            `SELECT 
                COUNT(DISTINCT TeacherId) as total_present,
                COUNT(CASE WHEN Status = 'Late' THEN 1 END) as total_late,
                COUNT(CASE WHEN CheckOutTime IS NOT NULL THEN 1 END) as total_checked_out
             FROM teacher_attendance
             WHERE DATE(AttendanceDate) = CURDATE()`
        );

        const totalCount = totalTeachers[0].total || 0;
        const presentCount = checkedIn[0].total_present || 0;
        const lateCount = checkedIn[0].total_late || 0;
        const checkedOutCount = checkedIn[0].total_checked_out || 0;

        // 3. Logic for Permission/Rate
        // Calculation: (OnTime / TotalPresent) * 100
        const onTimeCount = presentCount - lateCount;
        const rate = presentCount > 0 
            ? Math.round((onTimeCount / presentCount) * 100) + "%" 
            : "0%";

        res.json({
            total_teachers: totalCount,
            checked_in_today: presentCount,
            checked_out_today: checkedOutCount,
            absent_today: totalCount - presentCount, // True absence
            late_today: lateCount,
            permission_rate: rate
        });

    } catch (error) {
        // Use your custom logerror helper
        logerror("Today summary Data", error, res);
    }
};
const attendanceReport = async (req, res) => {
    try {
        const { from, to } = req.query;

        const [rows] = await db.query(
            `SELECT * FROM teacher_attendance
             WHERE DATE(Created_at) BETWEEN ? AND ?`,
            [from, to]
        );

        res.json(rows);

    } catch (error) {
       logerror("attendance Report",error,res);
    }
};

// =======================================
// 2. GET ATTENDANCE BY MONTH + CLASS
// =======================================
const getStudentAttendance = async (req, res) => {
  const { month, classId } = req.query;

  try {
    if (!month || !classId) {
      return res.status(400).json({
        message: "month and classId are required",
      });
    }

    const [rows] = await db.execute(
      `
      SELECT
        a.studentId,
        a.date,
        a.status
      FROM attendance a
      INNER JOIN students s ON s.Id = a.studentId
      WHERE DATE_FORMAT(a.date, '%Y-%m') = ?
      AND s.ClassId = ?
      `,
      [month, classId]
    );

    res.json(rows);
  } catch (err) {
    logerror("Get student attendance",err,res);
  }
};

//  1. Check In (only once per day)  time from 7:30 to 9:00 can check in < 50 km from school
// រូបមន្តគណនាចម្ងាយ Haversine (ដាក់ខាងក្រៅ function)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // កាំផែនដី (ម៉ែត្រ)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
}
//one per day
const checkIn = async (req, res) => {
    try {
        const teacherId = req.user?.Id;
        const { lat, lng } = req.body;

        // ១. ត្រួតពិនិត្យទិន្នន័យបញ្ជូនមក
        if (!lat || !lng) {
            return res.status(400).json({ message: "រកមិនឃើញទីតាំងរបស់អ្នកឡើយ!" });
        }

        // ២. កំណត់ទីតាំងសាលា (ប្តូរលេខនេះតាមសាលាជាក់ស្តែង) 11.078026151460309, 105.80586048842925
       const SCHOOL_LAT = 11.100054701588551; // 11.082884290318427, 105.80113085146257​
       const SCHOOL_LNG = 105.76717435146286; // 11.100054701588551, 105.76717435146286 SRU
        const distance = getDistance(lat, lng, SCHOOL_LAT, SCHOOL_LNG);

        if (distance >200) { // បើលើស ១០០ម៉ែត្រ
            return res.status(403).json({ message: `អ្នកនៅឆ្ងាយពីសាលាពេក (${Math.round(distance)} ម៉ែត្រ)` });
        }

        // ៣. ត្រួតពិនិត្យម៉ោង (7:30 - 10:30)
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const totalMinutes = hour * 60 + minute;

        if (totalMinutes < (11 * 60 + 30) || totalMinutes > ( 1 * 60 +30)) {
            return res.status(400).json({ message: "ការ Check-in អនុញ្ញាតតែចន្លោះម៉ោង 11:30 ដល់ 1:30 ប៉ុណ្ណោះ" });
        }

        // ៤. ឆែកមើលក្នុង Database ក្រែងលោគាត់ Check-in រួចហើយ
        const [exist] = await db.execute(
            "SELECT Id FROM teacher_attendance WHERE TeacherId = ? AND DATE(AttendanceDate) = CURDATE()",
            [teacherId]
        );
        if (exist.length > 0) {
            return res.status(400).json({ message: "អ្នកបាន Check-in រួចហើយសម្រាប់ថ្ងៃនេះ" });
        }

        // ៥. Insert ចូល Database
        await db.execute(
            `INSERT INTO teacher_attendance (TeacherId, AttendanceDate, CheckInTime, CheckInLat, CheckInLng, Status) 
             VALUES (?, NOW(), NOW(), ?, ?, 'OnTime')`,
            [teacherId, lat, lng]
        );

        // ៦. ផ្ញើ Alert (Telegram)
        const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
        await sendCheckInAlert(`
            Teacher Check-In
            ID: ${teacherId}
            Time: ${now.toLocaleTimeString()}
            Distance: ${Math.round(distance)}m
            Link: ${mapLink}
        `);

        res.json({ message: "Check-in បានជោគជ័យ!" });

    } catch (err) {
        logerror("Teacher Check In",err,res);
    }
};

const todayStudentSummary = async (req, res) => {
  try {

    const { ClassId } = req.query;

    // =========================
    // Total Students
    // =========================
    let totalSql = `
      SELECT COUNT(*) AS total
      FROM students
      WHERE 1=1
    `;

    const totalParams = [];

    if (ClassId) {
      totalSql += ` AND ClassId = ?`;
      totalParams.push(ClassId);
    }

    const [totalStudents] = await db.query(
      totalSql,
      totalParams
    );

    // =========================
    // Attendance Today
    // =========================
    let attendanceSql = `
      SELECT

        COUNT(DISTINCT StudentId) AS total_present,

        COUNT(
          CASE
            WHEN Status = 'Late'
            THEN 1
          END
        ) AS total_late,

        COUNT(
          CASE
            WHEN Status = 'Absent'
            THEN 1
          END
        ) AS total_absent,

        COUNT(
          CASE
            WHEN Status = 'Permission'
            THEN 1
          END
        ) AS total_permission

      FROM student_attendance
      WHERE DATE(AttendanceDate) = CURDATE()
    `;

    const attendanceParams = [];

    if (ClassId) {
      attendanceSql += ` AND ClassId = ?`;
      attendanceParams.push(ClassId);
    }

    const [attendance] = await db.query(
      attendanceSql,
      attendanceParams
    );

    // =========================
    // Final Data
    // =========================
    const totalCount =
      totalStudents[0].total || 0;

    const presentCount =
      attendance[0].total_present || 0;

    const lateCount =
      attendance[0].total_late || 0;

    const absentCount =
      attendance[0].total_absent || 0;

    const permissionCount =
      attendance[0].total_permission || 0;

    // real absent
    const realAbsent =
      totalCount -
      presentCount -
      absentCount -
      permissionCount;

    res.status(200).json({
      total_students: totalCount,
      present_today: presentCount,
      absent_today: absentCount + realAbsent,
      late_today: lateCount,
      permission_today: permissionCount
    });

  } catch (error) {

    logerror(
      "Today Student Summary",
      error,
      res
    );
  }
};
//ត្រូវកែ មួយថ្ងៃបានតែម្ដង​ ក្រោយពេល logined
const checkOut = async (req, res) => {
  try {
    const teacherId = req.user?.Id;
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: "រកមិនឃើញទីតាំងរបស់អ្នកឡើយ!" });
    }

    // 1. Distance Check
     const SCHOOL_LAT = 11.100054701588551; // 11.082884290318427, 105.80113085146257​
     const SCHOOL_LNG = 105.76717435146286; // 11.100054701588551, 105.76717435146286 SRU
     const distance = getDistance(lat, lng, SCHOOL_LAT, SCHOOL_LNG);

    if (distance > 5000) { 
      return res.status(403).json({ message: `អ្នកនៅឆ្ងាយពីសាលាពេក (${Math.round(distance)}m)!` });
    }

    // 2. Fetch today's attendance record
    const [attendance] = await db.execute(
      "SELECT Id, CheckOutTime FROM teacher_attendance WHERE TeacherId = ? AND DATE(AttendanceDate) = CURDATE()",
      [teacherId]
    );

    // 3. Validation: Must have checked in first
    if (attendance.length === 0) {
      return res.status(400).json({ message: "អ្នកមិនទាន់បាន Check-in សម្រាប់ថ្ងៃនេះនៅឡើយទេ!" });
    }

    // 4. NEW Validation: Prevent duplicate Check-out
    if (attendance[0].CheckOutTime !== null) {
      return res.status(400).json({ message: "អ្នកបាន Check-out រួចរាល់ហើយសម្រាប់ថ្ងៃនេះ!" });
    }

    // 5. Update Check-out data
    await db.execute(
      `UPDATE teacher_attendance 
       SET CheckOutTime = NOW(), CheckOutLat = ?, CheckOutLng = ? 
       WHERE TeacherId = ? AND DATE(AttendanceDate) = CURDATE()`,
      [lat, lng, teacherId]
    );

    // 6. Send Alert
    const mapLink = `https://maps.google.com/maps?q=${lat},${lng}`;
    await sendCheckInAlert(`
      🔴 Teacher Check-Out
      Teacher ID: ${teacherId}
      Time : ${new Date().toLocaleTimeString()}
      Distance :${Math.round(distance)}m
      Location : ${mapLink}
    `);

    res.json({ message: "Check-out ជោគជ័យ! សូមសម្រាកឱ្យសប្បាយ។" });

  } catch (err) {
    logerror("Check Out Teacher", err, res);
  }
};
// 3. Get My Students (SECURE)
const getStudentsByClass = async (req, res) => {
    const { classId } = req.params;
    const { month } = req.query; // ទទួលខែពី Frontend (ឧទាហរណ៍: 2026-05)

    try {
        const sql = `
            SELECT 
                s.Id, s.StudentCode, s.Name, s.Gender,
                a.AttendanceDate, a.Status
            FROM students s
            LEFT JOIN student_attendance a ON s.Id = a.StudentId 
                AND DATE_FORMAT(a.AttendanceDate, '%Y-%m') = ?
            WHERE s.ClassId = ?
            ORDER BY s.Name ASC`;

        const [rows] = await db.execute(sql, [month, classId]);

        // បំប្លែងទិន្នន័យពី Row ច្រើន ឱ្យមកជា Object សិស្សម្នាក់ៗវិញ
        const studentMap = {};
        rows.forEach(row => {
            if (!studentMap[row.Id]) {
                studentMap[row.Id] = {
                    key: row.Id,
                    id: row.StudentCode || row.Id,
                    name: row.Name,
                    gender: row.Gender,
                };
            }
            // ប្រសិនបើមានវត្តមានថ្ងៃចាស់ វានឹងរុញចូលទៅក្នុង key 'day_X'
            if (row.AttendanceDate) {
                const day = new Date(row.AttendanceDate).getDate();
                studentMap[row.Id][`day_${day}`] = row.Status.toLowerCase();
            }
        });

        res.json(Object.values(studentMap));
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};
// 4. Mark Attendance (SECURE + NO DUPLICATE) okay test
const saveStudentAttendance = async (req, res) => {
    try {
        const { classId, month, attendanceData } = req.body;
        const teacherId = req.user?.Id; // ប្រើ optional chaining ការពារ error

        if (!classId || !month || !attendanceData || !Array.isArray(attendanceData)) {
            return res.status(400).json({ message: "ទិន្នន័យបញ្ជូនមកមិនគ្រប់គ្រាន់ ឬខុសទម្រង់!" });
        }

        // ១. លុបទិន្នន័យចាស់ក្នុងខែនោះ និងថ្នាក់នោះ ដើម្បីឱ្យការ Update ថ្មីចូលទៅជំនួស
        // វិធីនេះមានប្រសិទ្ធភាពជាងការឆែក checkExist ម្នាក់ៗក្នុង Loop
        await db.execute(
            `DELETE FROM student_attendance 
             WHERE ClassId = ? AND DATE_FORMAT(AttendanceDate, '%Y-%m') = ?`,
            [classId, month]
        );

        // ២. រៀបចំទិន្នន័យសម្រាប់ Bulk Insert (ផ្ញើទៅ Database តែម្តងគត់)
        const values = [];
        attendanceData.forEach(student => {
            Object.keys(student).forEach(key => {
                // ឆែកយកតែ key ណាដែលជាថ្ងៃ (ឧទាហរណ៍: day_1, day_2...)
                if (key.startsWith("day_") && student[key]) {
                    const day = key.split("_")[1];
                    const fullDate = `${month}-${day.padStart(2, '0')}`;
                    
                    // កែសម្រួលអក្សរ Status ឱ្យត្រូវតាម ENUM: Present, Absent, Late, Permission
                    let rawStatus = student[key];
                    let status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

                    // បញ្ចូលទៅក្នុង Array ធំ
                    // លំដាប់ Column: StudentId, AttendanceDate, TeacherId_mark, ClassId, Status
                    values.push([student.key, fullDate, teacherId, classId, status]);
                }
            });
        });

        // ៣. បាញ់ទិន្នន័យចូល Database ក្នុង Query តែមួយ (Bulk Insert)
        if (values.length > 0) {
            const sql = `INSERT INTO student_attendance (StudentId, AttendanceDate, TeacherId_mark, ClassId, Status) VALUES ?`;
            await db.query(sql, [values]);
        }

        // ៤. ផ្ញើលទ្ធផលជោគជ័យទៅកាន់ Frontend
        return res.json({ message: "រក្សាទុកវត្តមានបានជោគជ័យ!" });

    } catch (err) {
        console.error("Save Attendance Error:", err);
        // សំខាន់បំផុត៖ ត្រូវផ្ញើ Error ទៅកាន់ Frontend ដើម្បីឱ្យវាឈប់ Loading
        return res.status(500).json({ message: "មានបញ្ហាបច្ចេកទេសនៅខាង Server!" });
    }
};

const getTeacherClasses = async (req, res) => {
  try {
    const teacherId = req.user.Id; // from token

    const [rows] = await db.query(
      `SELECT  Id, ClassName from classes
       WHERE TeacherId = ?`,
      [teacherId]
    );

    res.json(rows);
  } catch (err) {
    logerror("Get Teacher Class",err,res);
  }
};
const getAttendanceByDate = async (req, res) => {
  try {
    const { classId, date } = req.query;

    const [rows] = await db.query(`
      SELECT StudentId, Status
      FROM student_attendance
      WHERE ClassId = ? AND AttendanceDate = ?
    `, [classId, date]);

    res.json(rows);

  } catch (err) {
    logerror("Get Attendance By Date",err,res);
  }
};
// 5. Get My Attendance Report (NEW) excel
const getAttendanceReport = async (req, res) => {
  try {
    const teacherId = req.user.Id;

    const [rows] = await db.execute(
      `SELECT sa.*, s.Name
       FROM student_attendance sa
       JOIN students s ON sa.StudentId = s.Id
       JOIN classes c ON s.ClassId = c.Id
       WHERE c.TeacherId = ?
       ORDER BY sa.AttendanceDate DESC`,
      [teacherId]
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//6. Request Permission (VALIDATION) admin approve tmr test
const requestPermission = async (req, res) => {
  try {
    const teacherId = req.user.Id;
    const { startDate, EndDate, Reason } = req.body;

    if (!startDate || !EndDate || !Reason) {
      return res.status(400).json({
        message: "Date and Reason required"
      });
    }

    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(EndDate);

    await db.execute(
  `
  INSERT INTO leave_requests
  (
    UserId,
    StartDate,
    EndDate,
    Reason,
    Status
  )
  VALUES
  (
    ?, ?, ?, ?, 'pending'
  )
  `,
  [
    teacherId,
    formattedStart,
    formattedEnd,
    Reason
  ]
);

    res.json({
      message: "Permission requested successfully"
    });
  const [admins] = await db.query(
  `
  SELECT Id
  FROM users
  WHERE Role='admin'
  `
);

for (const admin of admins) {
  await db.execute(
    `
    INSERT INTO notifications
    (
      UserId,
      Title,
      Message,
      Type,
      IsRead
    )
    VALUES
    (
      ?, ?, ?, ?, 0
    )
    `,
    [
      admin.Id,
      "Teacher Leave Request",
      `Teacher #${teacherId} submitted a leave request`,
      "leave_request"
    ]
  );
}
  } catch (err) {
    logerror("Teacher Permission", err, res);
  }
};
const AdmingetNotifications = async (
  req,
  res
) => {
  try {
    const userId = req.user.Id;

    const [rows] = await db.query(
      `
      SELECT *
      FROM notifications
      WHERE UserId = ?
      ORDER BY Id DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
//admin getall request
const AdmingetLeaveRequests =
async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        lr.*,
        t.Name
      FROM leave_requests lr
      LEFT JOIN teachers t
        ON t.Id = lr.UserId
      ORDER BY lr.Id DESC
    `);

    res.json(rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message
    });
  }
};
//admin approve or reject
const AdminapproveLeaveRequest =
async (req, res) => {
  try {

    const { id } = req.params;

    await db.execute(
      `
      UPDATE leave_requests
      SET Status='approved'
      WHERE Id=?
      `,
      [id]
    );

    res.json({
      message:
        "Request approved"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message
    });
  }
};
const AdminrejectLeaveRequest =
async (req, res) => {
  try {

    const { id } = req.params;

    await db.execute(
      `
      UPDATE leave_requests
      SET Status='rejected'
      WHERE Id=?
      `,
      [id]
    );

    res.json({
      message:
        "Request rejected"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message
    });
  }
};

const TeachergetLeaveRequests =
async (req, res) => {

  const userId =
    req.user.Id;

  const [rows] =
    await db.query(
      `
      SELECT *
      FROM leave_requests
      WHERE UserId = ?
      ORDER BY Id DESC
      `,
      [userId]
    );

  res.json(rows);
};
//staff
const getTeacherAttendance=async(req,res)=>{
    try {
      //declear varible
          const [list]=await db.query(`select * from teacher_attendance`);
               res.json({
                    list
               });
    } catch (error) {
      logerror("get Teacher Attendacne",error,res);
    }
}
//teacher attendance count
const getAttendanceCount=async(req,res)=>{
  try {
         const [results] = await db.query(
      `SELECT COUNT(*) AS totalAttendance FROM teacher_attendance`
    );

    //use  SQL
    res.json({ totalAttendance: results[0].totalAttendance });
  } catch (error) {
    logerror("get Attendance Count",error,res);
  }
}
//done student
const getAttendanceStats = async (req, res) => {
  try {

    const { ClassId, date } = req.query;

    let sql = `
      SELECT 
        COUNT(*) AS total,

        COUNT(
          CASE
            WHEN Status = 'Present'
            THEN 1
          END
        ) AS present,

        COUNT(
          CASE
            WHEN Status = 'Absent'
            THEN 1
          END
        ) AS absent,

        COUNT(
          CASE
            WHEN Status = 'Late'
            THEN 1
          END
        ) AS late,

        COUNT(
          CASE
            WHEN Status = 'Permission'
            THEN 1
          END
        ) AS permission

      FROM student_attendance
      WHERE 1=1
    `;

    const params = [];

    // ✅ use selected date or auto today
    sql += `
      AND DATE(AttendanceDate) = ?
    `;

    params.push(date || new Date().toISOString().split("T")[0]);

    // filter by class
    if (ClassId) {

      sql += `
        AND ClassId = ?
      `;

      params.push(ClassId);
    }

    const [rows] = await db.query(sql, params);

    res.status(200).json(rows[0]);

  } catch (error) {

    logerror(
      "Get Attendance Stats",
      error,
      res
    );
  }
};
// attendanceController.js

const getStudentAttendanceStaffList = async (req, res) => {

  try {

    const {
      ClassId,
      date,
      status,
      search
    } = req.query;

   let sql = `
  SELECT
    sa.Id,
    sa.StudentId,
    sa.Status,
    sa.AttendanceDate,

    s.Name AS StudentName

  FROM student_attendance sa

  LEFT JOIN students s
  ON sa.StudentId = s.Id

  WHERE 1=1
`;
    const params = [];

    // date filter
    if (date) {

      sql += `
        AND DATE(sa.AttendanceDate) = ?
      `;

      params.push(date);
    }

    // class filter
    if (ClassId) {

      sql += `
        AND sa.ClassId = ?
      `;

      params.push(ClassId);
    }

    // status filter
    if (status) {

      sql += `
        AND sa.Status = ?
      `;

      params.push(status);
    }

    // search student
    if (search) {

      sql += `
        AND s.Name LIKE ?
      `;

      params.push(`%${search}%`);
    }

    sql += `
      ORDER BY sa.AttendanceDate DESC
    `;

    const [rows] = await db.query(
      sql,
      params
    );

    res.status(200).json(rows);

  } catch (error) {

    logerror(
      "Get Student Attendance",
      error,
      res
    );
  }
};
//NEW====================
// GET /api/reports/student/history
const getStudentHistory = async (req, res) => {
  try {
    const { studentId } = req.query;

    const sql = `
      SELECT 
        AttendanceDate,
        Status
      FROM student_attendance
      WHERE StudentId = ?
      ORDER BY AttendanceDate DESC
    `;

    const [rows] = await db.query(sql, [studentId]);
    res.json(rows);

  } catch (error) {
    logerror("student history",error,res);
  }
};
// GET /api/reports/student/summary
const getSummaryAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const sql = `
      SELECT 
        sa.StudentId,
        s.Name AS student_name,
        COUNT(*) AS total_days,
        SUM(sa.Status = 'Present') AS present,
        SUM(sa.Status = 'Absent') AS absent,
        SUM(sa.Status = 'Late') AS late
      FROM student_attendance sa
      JOIN students s ON sa.StudentId = s.Id
      WHERE sa.AttendanceDate BETWEEN ? AND ?
      GROUP BY sa.StudentId
    `;

    const [rows] = await db.query(sql, [startDate, endDate]);
    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/reports/student/monthly
const getMonthlyAttendance = async (req, res) => {
  try {
    const { studentId, month, year } = req.query;

    const sql = `
      SELECT 
        COUNT(*) AS total_days,
        SUM(Status = 'Present') AS present,
        SUM(Status = 'Absent') AS absent,
        SUM(Status = 'Late') AS late
      FROM student_attendance
      WHERE StudentId = ?
      AND MONTH(AttendanceDate) = ?
      AND YEAR(AttendanceDate) = ?
    `;

    const [rows] = await db.query(sql, [studentId, month, year]);
    res.json(rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// GET /api/reports/student/daily
const getDailyAttendance = async (req, res) => {
  try {
    const { date } = req.query;

    const sql = `
      SELECT 
        sa.StudentId,
        s.Name AS student_name,
        sa.Status,
        sa.AttendanceDate
      FROM student_attendance sa
      JOIN students s ON sa.StudentId = s.Id
      WHERE DATE(sa.AttendanceDate) = ?
    `;

    const [rows] = await db.query(sql, [date]);
    res.json(rows);
  } catch (error) {
  logerror("Student Attendance ",err,res);
  }
};

//export Excel
const exportStudentExcel = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const [rows] = await db.query(`
      SELECT 
        sa.StudentId,
        s.Name AS student_name,
        COUNT(*) AS total_days,
        SUM(sa.Status = 'Present') AS present,
        SUM(sa.Status = 'Absent') AS absent,
        SUM(sa.Status = 'Late') AS late
      FROM student_attendance sa
      JOIN students s ON sa.StudentId = s.Id
      WHERE sa.AttendanceDate BETWEEN ? AND ?
      GROUP BY sa.StudentId
    `, [startDate, endDate]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance Report");

    worksheet.columns = [
      { header: "Student ID", key: "StudentId", width: 15 },
      { header: "Name", key: "student_name", width: 25 },
      { header: "Total Days", key: "total_days", width: 15 },
      { header: "Present", key: "present", width: 10 },
      { header: "Absent", key: "absent", width: 10 },
      { header: "Late", key: "late", width: 10 },
    ];

    rows.forEach(row => worksheet.addRow(row));

    res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition","attachment; filename=attendance.xlsx");

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//export PDF
const exportStudentPDF = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const [rows] = await db.query(`
      SELECT 
        sa.StudentId,
        s.Name AS student_name,
        COUNT(*) AS total_days,
        SUM(sa.Status = 'Present') AS present,
        SUM(sa.Status = 'Absent') AS absent,
        SUM(sa.Status = 'Late') AS late
      FROM student_attendance sa
      JOIN students s ON sa.StudentId = s.Id
      WHERE sa.AttendanceDate BETWEEN ? AND ?
      GROUP BY sa.StudentId
    `, [startDate, endDate]);

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("Student Attendance Report", { align: "center" });
    doc.moveDown();

    rows.forEach((row, index) => {
      doc.text(
        `${index + 1}. ${row.student_name} | Total: ${row.total_days} | Present: ${row.present} | Absent: ${row.absent} | Late: ${row.late}`
      );
    });

    doc.end();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get student attendance
const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user.Id;

    const { startDate, endDate } = req.query;

    let whereClause = "WHERE StudentId = ?";
    let params = [studentId];

    if (startDate && endDate) {
      whereClause += `
        AND AttendanceDate
        BETWEEN ? AND ?
      `;
      params.push(startDate, endDate);
    }

    const [summary] = await db.query(
      `
      SELECT
        COUNT(*) AS TotalAttendance,

        SUM(
          CASE
            WHEN Status='Present'
            THEN 1 ELSE 0
          END
        ) AS Present,

        SUM(
          CASE
            WHEN Status='Absent'
            THEN 1 ELSE 0
          END
        ) AS Absent,

        SUM(
          CASE
            WHEN Status='Permission'
            THEN 1 ELSE 0
          END
        ) AS Permission,

        SUM(
          CASE
            WHEN Status='Late'
            THEN 1 ELSE 0
          END
        ) AS Late,

        ROUND(
          (
            SUM(
              CASE
                WHEN Status='Present'
                THEN 1 ELSE 0
              END
            ) * 100
          ) / COUNT(*),
          2
        ) AS AttendanceRate

      FROM student_attendance
      ${whereClause}
      `,
      params
    );

    const [history] = await db.query(
      `
      SELECT
        Id,
        AttendanceDate,
        Status,
        Remark
      FROM student_attendance
      ${whereClause}
      ORDER BY AttendanceDate DESC
      `,
      params
    );

    res.json({
      summary: summary[0],
      history,
    });
    } catch (err) {
     logerror("Get My Attendance Stu",err,res);
    }
  };

  const getTeacherAttendanceHistory =
async (req, res) => {
  try {

    const teacherId =
      req.user.Id;

    const [rows] =
      await db.query(
        `
        SELECT
          AttendanceDate,
          CheckInTime,
          CheckOutTime,
          Latitude,
          Longitude,
          Status
        FROM teacher_attendance
        WHERE TeacherId = ?
        ORDER BY AttendanceDate DESC
        `,
        [teacherId]
      );

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};
module.exports = {
  // teacher
  checkIn,
  checkOut,
  todaySummary,
  attendanceReport,
  getTeacherAttendance,
  getAttendanceCount,
  getTeacherClasses,
  // student attendance
 saveStudentAttendance,
  getStudentsByClass,
  getAttendanceByDate,
  getStudentAttendance,
  getStudentHistory,
  getAttendanceStats,
  getStudentAttendanceStaffList,
  getMyAttendance,
  getTeacherAttendanceHistory,
  // reports
  getDailyAttendance,
  getMonthlyAttendance,
  getSummaryAttendance,
  getAttendanceReport,
  todayStudentSummary,

  // export
  exportStudentExcel,
  exportStudentPDF,
  //Request permission and get result
   requestPermission,
   AdmingetLeaveRequests,
   AdmingetNotifications,
   AdminrejectLeaveRequest,
   AdminapproveLeaveRequest,
   TeachergetLeaveRequests

};