const db = require("../config/db");
const logerror = require("../utils/logerror");

// =========================
// GET ALL STUDENT ATTENDANCE
// =========================

exports.getList = async (req, res) => {
  try {
    const {
      ClassId,
      date,
      status,
      search,
    } = req.query;

    let sql = `
      SELECT
        sa.Id,
        sa.StudentId,
        s.Name AS StudentName,
        sa.ClassId,
        c.Name AS ClassName,
        sa.AttendanceDate,
        sa.Status,
        sa.Remark,
        sa.TeacherId_mark,
        t.Name AS TeacherName,
        sa.CreateAt

      FROM student_attendance sa

      LEFT JOIN students s
      ON sa.StudentId = s.Id

      LEFT JOIN classes c
      ON sa.ClassId = c.Id

      LEFT JOIN teachers t
      ON sa.TeacherId_mark = t.Id

      WHERE 1 = 1
    `;

    const params = [];

    // ================= FILTER CLASS =================

    if (ClassId) {
      sql += ` AND sa.ClassId = ? `;
      params.push(ClassId);
    }

    // ================= FILTER DATE =================

    if (date) {
      sql += ` AND sa.AttendanceDate = ? `;
      params.push(date);
    }

    // ================= FILTER STATUS =================

    if (status && status !== "all") {
      sql += ` AND sa.Status = ? `;
      params.push(status);
    }

    // ================= SEARCH =================

    if (search) {
      sql += `
        AND (
          s.Name LIKE ?
          OR sa.StudentId LIKE ?
        )
      `;

      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    sql += `
      ORDER BY sa.AttendanceDate DESC,
      sa.Id DESC
    `;

    const [rows] = await db.query(sql, params);

    res.status(200).json({
      success: true,
      total: rows.length,
      list: rows,
    });

  } catch (error) {
    logerror("Get Student Attendance Error", error, res);
  }
};

// =========================
// CREATE ATTENDANCE
// =========================

exports.create = async (req, res) => {
  try {
    const {
      StudentId,
      ClassId,
      AttendanceDate,
      Status,
      Remark,
      TeacherId_mark,
    } = req.body;

    // ================= VALIDATION =================

    if (
      !StudentId ||
      !ClassId ||
      !AttendanceDate ||
      !Status ||
      !TeacherId_mark
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // ================= CHECK DUPLICATE =================

    const [check] = await db.query(
      `
      SELECT Id
      FROM student_attendance
      WHERE StudentId = ?
      AND AttendanceDate = ?
      `,
      [StudentId, AttendanceDate]
    );

    if (check.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked",
      });
    }

    // ================= INSERT =================

    const [result] = await db.query(
      `
      INSERT INTO student_attendance
      (
        StudentId,
        ClassId,
        AttendanceDate,
        Status,
        Remark,
        TeacherId_mark
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        StudentId,
        ClassId,
        AttendanceDate,
        Status,
        Remark || null,
        TeacherId_mark,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Attendance created successfully",
      Id: result.insertId,
    });

  } catch (error) {
    logerror("Create Student Attendance Error", error, res);
  }
};

// =========================
// UPDATE ATTENDANCE
// =========================

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      StudentId,
      ClassId,
      AttendanceDate,
      Status,
      Remark,
      TeacherId_mark,
    } = req.body;

    const [check] = await db.query(
      `
      SELECT Id
      FROM student_attendance
      WHERE Id = ?
      `,
      [id]
    );

    if (check.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    await db.query(
      `
      UPDATE student_attendance
      SET
        StudentId = ?,
        ClassId = ?,
        AttendanceDate = ?,
        Status = ?,
        Remark = ?,
        TeacherId_mark = ?
      WHERE Id = ?
      `,
      [
        StudentId,
        ClassId,
        AttendanceDate,
        Status,
        Remark,
        TeacherId_mark,
        id,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
    });

  } catch (error) {
    logerror("Update Student Attendance Error", error, res);
  }
};

// =========================
// DELETE ATTENDANCE
// =========================

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const [check] = await db.query(
      `
      SELECT Id
      FROM student_attendance
      WHERE Id = ?
      `,
      [id]
    );

    if (check.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    await db.query(
      `
      DELETE FROM student_attendance
      WHERE Id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });

  } catch (error) {
    logerror("Delete Student Attendance Error", error, res);
  }
};

// =========================
// ATTENDANCE SUMMARY
// =========================

exports.summary = async (req, res) => {
  try {
    const { ClassId, date } = req.query;

    let sql = `
      SELECT

        COUNT(*) AS total,

        SUM(
          CASE
            WHEN Status = 'Present'
            THEN 1
            ELSE 0
          END
        ) AS present,

        SUM(
          CASE
            WHEN Status = 'Absent'
            THEN 1
            ELSE 0
          END
        ) AS absent,

        SUM(
          CASE
            WHEN Status = 'Late'
            THEN 1
            ELSE 0
          END
        ) AS late,

        SUM(
          CASE
            WHEN Status = 'Permission'
            THEN 1
            ELSE 0
          END
        ) AS permission

      FROM student_attendance
      WHERE 1 = 1
    `;

    const params = [];

    if (ClassId) {
      sql += ` AND ClassId = ? `;
      params.push(ClassId);
    }

    if (date) {
      sql += ` AND AttendanceDate = ? `;
      params.push(date);
    }

    const [rows] = await db.query(sql, params);

    res.status(200).json(rows[0]);

  } catch (error) {
    logerror("Attendance Summary Error", error, res);
  }
};

