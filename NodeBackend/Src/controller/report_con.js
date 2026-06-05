const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const db = require('../config/db');
const {logerror} =require("../config/helper");

exports.teacherAttendance = async (req, res) => {
  const { start_date, end_date, teacher_id, status } = req.query;

  let sql = `
    SELECT t.name, a.check_in, a.check_out, a.status
    FROM teacher_attendance a
    JOIN teachers t ON t.id = a.teacher_id
    WHERE 1=1
  `;
  let params = [];

  if (start_date && end_date) {
    sql += " AND DATE(a.check_in) BETWEEN ? AND ?";
    params.push(start_date, end_date);
  }

  if (teacher_id) {
    sql += " AND a.teacher_id = ?";
    params.push(teacher_id);
  }

  if (status) {
    sql += " AND a.status = ?";
    params.push(status);
  }

  const [rows] = await db.query(sql, params);
  res.json(rows);
};
exports.studentAttendance = async (req, res) => {
  const { start_date, end_date, student_id, status } = req.query;

  let sql = `
    SELECT s.name, a.check_in, a.check_out, a.status
    FROM student_attendance a
    JOIN students s ON s.id = a.student_id
    WHERE 1=1
  `;
  let params = [];

  if (start_date && end_date) {
    sql += " AND DATE(a.check_in) BETWEEN ? AND ?";
    params.push(start_date, end_date);
  }

  if (student_id) {
    sql += " AND a.student_id = ?";
    params.push(student_id);
  }

  if (status) {
    sql += " AND a.status = ?";
    params.push(status);
  }

  const [rows] = await db.query(sql, params);
  res.json(rows);
};
// ===============================
// Payment Report
// ===============================
exports.getPaymentReport = async (req, res) => {
  try {
    const {
      StudentId,
      Status,
      PaymentMethod,
      StartDate,
      EndDate,
    } = req.query;

    let sql = `
      SELECT
  p.Id,
  p.StudentId,
  s.Name AS StudentName,
  p.FeeId,
  f.FeeName,
  p.Amount,
  p.Currency,
  p.PaymentMethod,
  p.Status,
  p.TransactionId,
  p.ProviderTransactionId,
  p.PaymentDate,
  p.ExpireAt,
  p.Remark,
  p.CreateAt
FROM payments p
LEFT JOIN students s
  ON p.StudentId = s.Id
LEFT JOIN fees f
  ON p.FeeId = f.Id
WHERE 1 = 1
    `;

    let params = [];

    // Filter by Student
    if (StudentId) {
      sql += ` AND p.StudentId = ? `;
      params.push(StudentId);
    }

    // Filter by Status
    if (Status) {
      sql += ` AND p.Status = ? `;
      params.push(Status);
    }

    // Filter by Payment Method
    if (PaymentMethod) {
      sql += ` AND p.PaymentMethod = ? `;
      params.push(PaymentMethod);
    }
   
    // Filter Start Date
    if (StartDate) {
      sql += ` AND DATE(p.PaymentDate) >= ? `;
      params.push(StartDate);
    }

    // Filter End Date
    if (EndDate) {
      sql += ` AND DATE(p.PaymentDate) <= ? `;
      params.push(EndDate);
    }

    sql += ` ORDER BY p.Id DESC `;

    const [rows] = await db.query(sql, params);

    // ===============================
    // Summary
    // ===============================
    const totalAmount = rows.reduce(
      (sum, item) => sum + Number(item.Amount),
      0
    );

    const totalPaid = rows.filter(
      (x) => x.Status === "paid"
    ).length;

    const totalPending = rows.filter(
      (x) => x.Status === "pending"
    ).length;

    const totalFailed = rows.filter(
      (x) => x.Status === "failed"
    ).length;

    res.status(200).json({
      success: true,
      total: rows.length,
      summary: {
        totalAmount,
        totalPaid,
        totalPending,
        totalFailed,
      },
      data: rows,
    });

  } catch (error) {
      logerror("Payment Report",error,res);
  }
};
exports.summary = async (req, res) => {
  const { start_date, end_date } = req.query;

  let dateFilter = "";
  let params = [];

  if (start_date && end_date) {
    dateFilter = "WHERE DATE(payment_date) BETWEEN ? AND ?";
    params.push(start_date, end_date);
  }

  const [[students]] = await db.query("SELECT COUNT(*) as total FROM students");
  const [[teachers]] = await db.query("SELECT COUNT(*) as total FROM teachers");

  const [[revenue]] = await db.query(
    `SELECT SUM(amount) as total FROM payments ${dateFilter}`,
    params
  );

  res.json({
    students: students.total,
    teachers: teachers.total,
    revenue: revenue.total || 0
  });
};
exports.chart = async (req, res) => {
  const { start_date, end_date } = req.query;

  let sql = `
    SELECT DATE(payment_date) as date, SUM(amount) as total
    FROM payments
    WHERE 1=1
  `;
  let params = [];

  if (start_date && end_date) {
    sql += " AND DATE(payment_date) BETWEEN ? AND ?";
    params.push(start_date, end_date);
  }

  sql += " GROUP BY DATE(payment_date) ORDER BY date ASC";

  const [rows] = await db.query(sql, params);
  res.json(rows);
};


exports.getTeacherReport =
async (req, res) => {

  try {

    const [teachers] =
      await db.query(`
        SELECT
          Id,
          TeacherCode,
          Name,
          KhmerName,
          Gender,
          DOB,
          Phone,
          Shift,
          Address,
          Image,
          CreateAt
        FROM teachers
        ORDER BY Id ASC
      `);

    const totalTeachers =
      teachers.length;

    const maleTeachers =
      teachers.filter(
        t => t.Gender === "Male"
      ).length;

    const femaleTeachers =
      teachers.filter(
        t => t.Gender === "Female"
      ).length;

    res.status(200).json({
      success: true,

      summary: {
        totalTeachers,
        maleTeachers,
        femaleTeachers,
      },

      list: teachers,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to load teacher report",
    });

  }

};
exports.exportPaymentPDF =
  async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        p.Id,
        s.Name AS StudentName,
        f.FeeName,
        p.Amount,
        p.PaymentMethod,
        p.Status
      FROM payments p

      LEFT JOIN students s
      ON p.StudentId = s.Id

      LEFT JOIN fees f
      ON p.FeeId = f.Id

      ORDER BY p.Id DESC
    `);

    const doc =
      new PDFDocument({
        margin: 30,
        size: "A4",
      });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=payment_report.pdf"
    );

    doc.pipe(res);

    // ====================================
    // TITLE
    // ====================================

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(
        "Payment Report",
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    // ====================================
    // TABLE CONFIG
    // ====================================

    const tableTop = 160;
    const rowHeight = 35;

    const colX = {
      receipt: 30,
      student: 100,
      fee: 240,
      amount: 360,
      method: 450,
      status: 520,
    };

    // ====================================
    // HEADER BACKGROUND
    // ====================================

    doc
      .rect(
        30,
        tableTop,
        550,
        rowHeight
      )
      .fill("#e6f0ff");

    // ====================================
    // HEADER TEXT
    // ====================================

    doc
      .fillColor("black")
      .fontSize(11)
      .font("Helvetica-Bold");

    doc.text(
      "Receipt",
      colX.receipt + 5,
      tableTop + 10
    );

    doc.text(
      "Student",
      colX.student + 5,
      tableTop + 10
    );

    doc.text(
      "Fee",
      colX.fee + 5,
      tableTop + 10
    );

    doc.text(
      "Amount",
      colX.amount + 5,
      tableTop + 10
    );

    doc.text(
      "Method",
      colX.method + 5,
      tableTop + 10
    );

    doc.text(
      "Status",
      colX.status + 5,
      tableTop + 10
    );

    // ====================================
    // DRAW HEADER BORDER
    // ====================================

    doc
      .lineWidth(1)
      .rect(
        30,
        tableTop,
        550,
        rowHeight
      )
      .stroke();

    // ====================================
    // TABLE ROWS
    // ====================================

    let y =
      tableTop + rowHeight;

    rows.forEach((item) => {

      // ROW BORDER

      doc
        .rect(
          30,
          y,
          550,
          rowHeight
        )
        .stroke();

      // COLUMN LINES

      doc.moveTo(
        colX.student,
        y
      )
      .lineTo(
        colX.student,
        y + rowHeight
      )
      .stroke();

      doc.moveTo(
        colX.fee,
        y
      )
      .lineTo(
        colX.fee,
        y + rowHeight
      )
      .stroke();

      doc.moveTo(
        colX.amount,
        y
      )
      .lineTo(
        colX.amount,
        y + rowHeight
      )
      .stroke();

      doc.moveTo(
        colX.method,
        y
      )
      .lineTo(
        colX.method,
        y + rowHeight
      )
      .stroke();

      doc.moveTo(
        colX.status,
        y
      )
      .lineTo(
        colX.status,
        y + rowHeight
      )
      .stroke();

      // ROW TEXT

      doc
        .font("Helvetica")
        .fontSize(10);

      doc.text(
        item.Id.toString(),
        colX.receipt + 5,
        y + 10
      );

      doc.text(
        item.StudentName || "",
        colX.student + 5,
        y + 10
      );

      doc.text(
        item.FeeName || "",
        colX.fee + 5,
        y + 10
      );

      doc.text(
        `$${item.Amount}`,
        colX.amount + 5,
        y + 10
      );

      doc.text(
        item.PaymentMethod || "",
        colX.method + 5,
        y + 10
      );

      doc.text(
        item.Status || "",
        colX.status + 5,
        y + 10
      );

      y += rowHeight;

      // NEW PAGE

      if (y > 750) {

        doc.addPage();

        y = 50;
      }
    });

    doc.end();

  } catch (error) {
      logerror("PDF payment report",error,res);
  }
};

exports.getStudentReport = async (req, res) => {
  try {
    const { classId } = req.query;

    let sql = `
      SELECT
        s.Id,
        s.KhmerName,
        s.Gender,
        s.Phone,
        c.ClassName
      FROM students s
      LEFT JOIN classes c
        ON s.ClassId = c.Id
      WHERE 1 = 1
    `;

    const params = [];

    if (classId) {
      sql += ` AND s.ClassId = ? `;
      params.push(classId);
    }

    sql += ` ORDER BY s.Id DESC`;

    const [rows] =
      await db.query(sql, params);

    const totalStudents =
      rows.length;

    const male =
      rows.filter(
        x => x.Gender === "Male"
      ).length;

    const female =
      rows.filter(
        x => x.Gender === "Female"
      ).length;

    const totalClasses =
      new Set(
        rows.map(
          x => x.ClassName
        )
      ).size;

    res.json({
      success: true,
      summary: {
        totalStudents,
        male,
        female,
        totalClasses,
      },
      list: rows,
    });

  } catch (error) {
     logerror(" student Report",error,res);
  }
};

exports.exportStudentPDF =
  async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        s.Id,
        s.Name AS StudentName,
        s.Gender,
        s.Phone,
        c.ClassName

      FROM students s

      LEFT JOIN classes c
      ON s.ClassId = c.Id

      ORDER BY s.Id DESC
    `);

    const doc =
      new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 30,
      });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=student_report.pdf"
    );

    doc.pipe(res);

    // TITLE

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(
        "Student Report",
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    // TABLE

    let y = 150;

    const rowHeight = 40;

    const colX = {
      id: 30,
      name: 140,
      gender: 360,
      class: 500,
      phone: 650,
    };

    // HEADER

    doc
      .fillColor("#dbeafe")
      .rect(30, y, 760, rowHeight)
      .fill();

    doc
      .strokeColor("black")
      .rect(30, y, 760, rowHeight)
      .stroke();

    doc
      .fillColor("black")
      .font("Helvetica-Bold")
      .fontSize(12);

    doc.text(
      "Student ID",
      colX.id + 10,
      y + 12
    );

    doc.text(
      "Student Name",
      colX.name + 10,
      y + 12
    );

    doc.text(
      "Gender",
      colX.gender + 10,
      y + 12
    );

    doc.text(
      "Class",
      colX.class + 10,
      y + 12
    );

    doc.text(
      "Phone",
      colX.phone + 10,
      y + 12
    );

    y += rowHeight;

    // ROWS

    rows.forEach((item) => {

      doc
        .strokeColor("black")
        .rect(30, y, 760, rowHeight)
        .stroke();

      doc
        .font("Helvetica")
        .fontSize(11);

      doc.text(
        item.Id.toString(),
        colX.id + 10,
        y + 12
      );

      doc.text(
        item.StudentName || "",
        colX.name + 10,
        y + 12
      );

      doc.text(
        item.Gender || "",
        colX.gender + 10,
        y + 12
      );

      doc.text(
        item.ClassName || "",
        colX.class + 10,
        y + 12
      );

      doc.text(
        item.Phone || "",
        colX.phone + 10,
        y + 12
      );

      y += rowHeight;
    });

    doc.end();

  } catch (error) {
    logerror("PDF export student",error,res);
  }
};

exports.exportStudentExcel =
  async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        s.Id,
        s.Name AS StudentName,
        s.Gender,
        s.Phone,
        c.ClassName

      FROM students s

      LEFT JOIN classes c
      ON s.ClassId = c.Id

      ORDER BY s.Id DESC
    `);

    const workbook =
      new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet(
        "Student Report"
      );

    worksheet.columns = [

      {
        header: "Student ID",
        key: "Id",
        width: 15,
      },

      {
        header: "Student Name",
        key: "StudentName",
        width: 30,
      },

      {
        header: "Gender",
        key: "Gender",
        width: 15,
      },

      {
        header: "Class",
        key: "ClassName",
        width: 20,
      },

      {
        header: "Phone",
        key: "Phone",
        width: 20,
      },
    ];

    rows.forEach((item) => {
      worksheet.addRow(item);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=student_report.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {

   logerror("student export Excel Report",error,res);
  }
};
exports.enrollment_report =
  async (req, res) => {

  try {

    const {
      academicYearId,
      startDate,
      endDate
    } = req.query;

    let sql = `
      SELECT
        e.Id,
        s.Name AS StudentName,
        c.ClassName,
        a.Name ,

        DATE_FORMAT(
          e.EnrollDate,
          '%Y-%m-%d'
        ) AS EnrollDate,

        e.Status

      FROM enrollments e

      LEFT JOIN students s
      ON e.StudentId = s.Id

      LEFT JOIN classes c
      ON e.ClassId = c.Id

      LEFT JOIN academic_years a
      ON e.AcademicYearId = a.Id

      WHERE 1 = 1
    `;

    const values = [];

    if (academicYearId) {

      sql += `
        AND a.Id = ?
      `;

      values.push(
        academicYearId
      );
    }

    if (
      startDate &&
      endDate
    ) {

      sql += `
        AND DATE_FORMAT(
          e.EnrollDate,
          '%Y-%m-%d'
        ) BETWEEN ? AND ?
      `;

      values.push(
        startDate,
        endDate
      );
    }

    sql += `
      ORDER BY e.Id ASC
    `;

    const [rows] =
      await db.query(
        sql,
        values
      );

    res.status(200).json({
      success: true,
      list: rows,
    });

  } catch (error) {

    logerror("Enrollment Student Report",error,res);
  }
};

// EXPORT PDF

exports.exportEnrollmentPDF = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        e.Id,
        s.Name AS StudentName,
        c.ClassName,
        a.Name,

        DATE_FORMAT(
          e.EnrollDate,
          '%Y-%m-%d'
        ) AS EnrollDate,

        e.Status

      FROM enrollments e

      LEFT JOIN students s
      ON e.StudentId = s.Id

      LEFT JOIN classes c
      ON e.ClassId = c.Id

      LEFT JOIN academic_years a
      ON e.AcademicYearId = a.Id

      ORDER BY e.Id DESC
    `);

    const doc =
      new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 30,
      });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=enrollment_report.pdf"
    );

    doc.pipe(res);

    // TITLE

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(
        "Enrollment Student Report",
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    let y = 150;

    const rowHeight = 40;

    const col = {
      id: 30,
      student: 140,
      class: 340,
      year: 500,
      date: 670,
      status: 820,
    };

    // HEADER

    doc
      .fillColor("#dbeafe")
      .rect(30, y, 900, rowHeight)
      .fill();

    doc
      .strokeColor("black")
      .rect(30, y, 900, rowHeight)
      .stroke();

    doc
      .fillColor("black")
      .font("Helvetica-Bold")
      .fontSize(12);

    doc.text(
      "Enrollment No",
      col.id + 10,
      y + 12
    );

    doc.text(
      "Student Name",
      col.student + 10,
      y + 12
    );

    doc.text(
      "Class",
      col.class + 10,
      y + 12
    );

    doc.text(
      "Academic Year",
      col.year + 10,
      y + 12
    );

    doc.text(
      "Enroll Date",
      col.date + 10,
      y + 12
    );

    doc.text(
      "Status",
      col.status + 10,
      y + 12
    );

    y += rowHeight;

    // ROWS

    rows.forEach((item) => {

      doc
        .strokeColor("black")
        .rect(30, y, 900, rowHeight)
        .stroke();

      doc
        .font("Helvetica")
        .fontSize(11);

      doc.text(
        item.Id.toString(),
        col.id + 10,
        y + 12
      );

      doc.text(
        item.StudentName || "",
        col.student + 10,
        y + 12
      );

      doc.text(
        item.ClassName || "",
        col.class + 10,
        y + 12
      );

      doc.text(
        item.YearName || "",
        col.year + 10,
        y + 12
      );

      doc.text(
        item.EnrollDate || "",
        col.date + 10,
        y + 12
      );

      doc.text(
        item.Status || "",
        col.status + 10,
        y + 12
      );

      y += rowHeight;
    });

    doc.end();

  } catch (error) {

      logerror("Enrollment PDF ",error,res);
  }
};

// EXPORT EXCEL

exports.exportEnrollmentExcel =async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        e.Id,
        s.Name AS StudentName,
        c.ClassName,
        a.Name,

        DATE_FORMAT(
          e.EnrollDate,
          '%Y-%m-%d'
        ) AS EnrollDate,

        e.Status

      FROM enrollments e

      LEFT JOIN students s
      ON e.StudentId = s.Id

      LEFT JOIN classes c
      ON e.ClassId = c.Id

      LEFT JOIN academic_years a
      ON e.AcademicYearId = a.Id

      ORDER BY e.Id DESC
    `);

    const workbook =
      new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet(
        "Enrollment Report"
      );

    worksheet.columns = [

      {
        header: "Enrollment No",
        key: "Id",
        width: 20,
      },

      {
        header: "Student Name",
        key: "StudentName",
        width: 30,
      },

      {
        header: "Class",
        key: "ClassName",
        width: 20,
      },

      {
        header: "Academic Year",
        key: "YearName",
        width: 25,
      },

      {
        header: "Enrollment Date",
        key: "EnrollDate",
        width: 20,
      },

      {
        header: "Status",
        key: "Status",
        width: 15,
      },
    ];

    rows.forEach((item) => {
      worksheet.addRow(item);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=enrollment_report.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {

    logerror("Enrollment Excel",error,res);
  }
};

exports.getStudentAttendanceReport =
async (req, res) => {
  try {

    const {
      classId,
      startDate,
      endDate,
    } = req.query;

    let where =
      " WHERE 1=1 ";

    let params = [];

    if (classId) {
      where +=
        " AND a.ClassId = ? ";
      params.push(classId);
    }

    if (
      startDate &&
      endDate
    ) {
      where +=
        " AND DATE(a.AttendanceDate) BETWEEN ? AND ? ";
      params.push(
        startDate,
        endDate
      );
    }

    const [rows] =
      await db.query(
        `
        SELECT

        s.Id AS StudentId,
        s.KhmerName,
        c.ClassName,

        SUM(
          CASE
          WHEN a.Status='Present'
          THEN 1
          ELSE 0
          END
        ) AS Present,

        SUM(
          CASE
          WHEN a.Status='Absent'
          THEN 1
          ELSE 0
          END
        ) AS Absent,

        SUM(
          CASE
          WHEN a.Status='Permission'
          THEN 1
          ELSE 0
          END
        ) AS Permission,

        COUNT(a.Id)
        AS TotalDays

        FROM student_attendance a

        INNER JOIN students s
        ON s.Id = a.StudentId

        LEFT JOIN classes c
        ON c.Id = a.ClassId

        ${where}

        GROUP BY
        s.Id,
        s.KhmerName,
        c.ClassName

        ORDER BY
        s.KhmerName ASC
        `,
        params
      );

    let present = 0;
    let absent = 0;
    let permission = 0;

    rows.forEach(
      (item) => {
        present +=
          Number(
            item.Present
          ) || 0;

        absent +=
          Number(
            item.Absent
          ) || 0;

        permission +=
          Number(
            item.Permission
          ) || 0;
      }
    );

    const totalStudents =
      rows.length;

    const totalAttendance =
      present +
      absent +
      permission;

    const rate =
      totalAttendance > 0
        ? Math.round(
            (
              present /
              totalAttendance
            ) * 100
          )
        : 0;

    res.json({
      success: true,

      summary: {
        totalStudents,
        present,
        absent,
        permission,
        rate,
      },

      list: rows,
    });

  } catch (error) {

    console.log(error);
    logerror("Get Student Report",error,res);

  }
};