const db = require("../config/db");

exports.getMyTimetable = async (req, res) => {
  try {
    const userId = req.user.Id;

    // Get StudentId from users table
    const [users] = await db.query(
      `
      SELECT StudentId
      FROM users
      WHERE Id = ?
      `,
      [userId]
    );

    if (!users.length || !users[0].StudentId) {
      return res.status(404).json({
        success: false,
        message: "Student account not found",
      });
    }

    const studentId = users[0].StudentId;

    // Get student's class
    const [students] = await db.query(
      `
      SELECT ClassId
      FROM students
      WHERE Id = ?
      `,
      [studentId]
    );

    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const classId = students[0].ClassId;

    // Get timetable
    const [rows] = await db.query(
      `
      SELECT
        t.Id,
        t.DayOfWeek,
        TIME_FORMAT(t.StartTime,'%H:%i') AS StartTime,
        TIME_FORMAT(t.EndTime,'%H:%i') AS EndTime,
        s.SubjectName,
        te.Name AS TeacherName
      FROM timetables t
      LEFT JOIN subjects s
        ON t.SubjectId = s.Id
      LEFT JOIN teachers te
        ON t.TeacherId = te.Id
      WHERE t.ClassId = ?
      ORDER BY
        FIELD(
          t.DayOfWeek,
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ),
        t.StartTime 
      `,
      [classId]
    );

    res.status(200).json({
      success: true,
      studentId,
      classId,
      total: rows.length,
      data: rows,
    });

  } catch (error) {
    console.log("TIMETABLE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};