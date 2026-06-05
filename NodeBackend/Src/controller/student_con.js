const { logerror } = require("../config/helper");
const db=require("../config/db");
const ExcelJS = require("exceljs");
const {generateYearCode}=require("../utils/codeGenerator");
const {stuTelegramMessage}= require("../utils/telegrams");
const sendSMS=require("../utils/sendSMS");
//part 1 complefully
//only admin access done
const get_all_student=async(req,res)=>{
     try {
          //declear varible
          const [total]=await db.query("select count(Id) AS TotalRecord from students");
          const [list]=await db.query(`select * from students`);
               res.json({
                    list,
                    total
               });
     } catch (error) {
          logerror("student.getlist",error,res);
     }
};
//error in Verify Access done
const get_one_student=async(req,res)=>{//StudentId
     try {
         const Id = req.params.Id;

          var sql=` select * from students where Id=? `;
          const [list]=await db.query(sql,[Id]);
               res.json({
                    list:list
               })
     } catch (error) {
          logerror("get one student",error,res);
     }
}
//done alert telegram and SMS

//const sendSMS = require("../../utils/sendSMS");

const create_student = async (req, res) => {
  try {
    const {
      Name,
      KhmerName,
      Gender,
      DOB,
      ClassId,
      TeacherId,
      DadName,
      MomName,
      Phone,
      Address,
    } = req.body;

    const image = req.file
      ? req.file.path
      : req.body?.Image;

    // Validation
    if (!Name || !ClassId || !TeacherId) {
      return res.status(400).json({
        error: true,
        message:
          "Name, ClassId and TeacherId are required",
      });
    }

    // Generate Student Code
    const StudentCode =
      await generateYearCode(
        "students",
        "StudentCode",
        "STU"
      );

    // Insert Student
    await db.query(
      `
      INSERT INTO students
      (
        StudentCode,
        Name,
        KhmerName,
        Gender,
        DOB,
        ClassId,
        TeacherId,
        DadName,
        MomName,
        Phone,
        Address,
        Image
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
      `,
      [
        StudentCode,
        Name,
        KhmerName,
        Gender,
        DOB,
        ClassId,
        TeacherId,
        DadName,
        MomName,
        Phone,
        Address,
        image,
      ]
    );

    // ==========================
    // Telegram Notification
    // ==========================

    try {
      const telegramMessage = `
<b>🎓 New Student Registered</b>

🆔 Student ID: ${StudentCode}
👤 Name: ${Name}
🇰🇭 Khmer Name: ${KhmerName || "-"}
⚧ Gender: ${Gender || "-"}
🎂 DOB: ${DOB || "-"}
📞 Phone: ${Phone || "-"}
🏠 Address: ${Address || "-"}
`;

      await stuTelegramMessage(
        telegramMessage
      );

      console.log(
        "Telegram Sent Successfully"
      );
    } catch (telegramError) {
      console.error(
        "Telegram Error:",
        telegramError.message
      );
    }

    // ==========================
    // SMS Notification
    // ==========================

    if (Phone) {
      try {
        let parentPhone =
          Phone.trim();

        // Convert Cambodia Number
        if (
          parentPhone.startsWith("0")
        ) {
          parentPhone =
            "+855" +
            parentPhone.substring(1);
        }
//Khmer 
        const smsMessage = `
[Bright Brain School]

Dear Parent,

We are pleased to inform you that your child ${Name} has been successfully registered.

Student ID: ${StudentCode}

Thank you for choosing Bright Brain School.

Contact: 012 345 678
`;

        console.log(
          "Sending SMS To:",
          parentPhone
        );

        const smsResult =
          await sendSMS(
            parentPhone,
            smsMessage
          );

        console.log(
          "SMS Sent Successfully:",
          smsResult.sid
        );
      } catch (smsError) {
        console.error(
          "SMS Error:",
          smsError.message
        );
      }
    }

    // Success Response
    return res.status(200).json({
      error: false,
      message:
        "Student Created Successfully",
      StudentCode,
    });

  } catch (error) {
    logerror(
      "Create Student",
      error,
      res
    );
  }
};
//Get student Profile
const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.Id;

    const [student] = await db.query(
      `
      SELECT
        s.StudentCode,
        s.Name,
        s.KhmerName,
        s.Gender,
        s.DOB,
        s.DadName,
        s.MomName,
        p.ProgramName,
        s.ClassId,
        s.TeacherId,
        s.LevelId,
        s.Phone,
        s.Address,
        s.Image,
        s.ProgramType,
        s.CurrentFeeId,
        s.CreateAt,

        c.ClassName,
        l.LevelName,
        t.Name AS TeacherName

      FROM students s

      LEFT JOIN classes c
        ON c.Id = s.ClassId

      LEFT JOIN levels l
        ON l.Id = s.LevelId

      LEFT JOIN teachers t
        ON t.Id = s.TeacherId
      LEFT JOIN programs p
        ON p.Id = s.ProgramId

      WHERE s.Id = ?
      `,
      [studentId]
    );

    if (!student.length) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const [attendance] = await db.query(
      `
      SELECT
        COUNT(*) AS TotalAttendance,
        SUM(
          CASE
            WHEN Status = 'Present'
            THEN 1
            ELSE 0
          END
        ) AS Present
      FROM student_attendance
      WHERE StudentId = ?
      `,
      [studentId]
    );

    const [score] = await db.query(
      `
      SELECT
        ROUND(
          AVG(Score),
          2
        ) AS AverageScore
      FROM scores
      WHERE StudentId = ?
      `,
      [studentId]
    );

    return res.status(200).json({
      student: student[0],
      attendance: attendance[0],
      score: score[0],
    });

  } catch (error) {
    logerror(
      "Get My Student Profile",
      error,
      res
    );
  }
};
//done
const delete_student=async(req,res)=>{
     try {
          var sql=`Delete from students where Id =?`;
         const Id = req.params.Id;
          const [data]=await db.query(sql,[Id]);
               res.json({
                  messages:data.affectedRows !=0? "Removed student " :"Student Id not found",
                    data:data
               })
     } catch (error) {
          logerror("Delete student",error,res);
     }
}

//done
const update = async (req, res) => {
  try {
    const Id = req.params.Id;

    const {
      Name,
      KhmerName,
      Gender,
      DOB,
      ClassId,
      TeacherId,
      DadName,
      MomName,
      Address,
      Phone,
    } = req.body;

    const image = req.file
      ? req.file.path
      : req.body.Image;

    const [student] =
      await db.query(
        `
        SELECT *
        FROM students
        WHERE Id = ?
        `,
        [Id]
      );

    if (!student.length) {
      return res.status(404).json({
        message:
          "Student not found",
      });
    }

    const current =
      student[0];

    const sql = `
      UPDATE students
      SET
        Name = ?,
        KhmerName = ?,
        Gender = ?,
        DOB = ?,
        ClassId = ?,
        TeacherId = ?,
        DadName = ?,
        MomName = ?,
        Address = ?,
        Image = ?,
        Phone = ?
      WHERE Id = ?
    `;

    const [data] =
      await db.query(sql, [
        Name ??
          current.Name,
        KhmerName ??
          current.KhmerName,
        Gender ??
          current.Gender,
        DOB ??
          current.DOB,
        ClassId ??
          current.ClassId,
        TeacherId ??
          current.TeacherId,
        DadName ??
          current.DadName,
        MomName ??
          current.MomName,
        Address ??
          current.Address,
        image ??
          current.Image,
        Phone ??
          current.Phone,
        Id,
      ]);

    res.json({
      success: true,
      message:
        data.affectedRows > 0
          ? "Student updated successfully"
          : "No changes made",
    });
  } catch (error) {
    logerror(
      "student update",
      error,
      res
    );
  }
};// Count all students
const getStudentCount = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT COUNT(*) AS totalStudent FROM students`
    );

    // ✅ use the alias you defined in SQL
    res.json({ totalStudent: results[0].totalStudent });
  } catch (err) {
    logerror("Count All Students", err, res);
  }
};
const StudentSelect = async (req, res) => {
  try {
    const [rows] = await db.query(`
    SELECT Id,KhmerName
    FROM students
  `);

  res.json(rows);
  } catch (error) {
    logerror("Student select",error,res);
  }
};
// ==============================
// CREATE ENROLLMENT
// ==============================
const create_enrollment = async (req, res) => {
  try {

    const {
      StudentId,
      ClassId,
      AcademicYearId,
      EnrollDate,
      Status
    } = req.body;

    // validation
    if (!StudentId || !ClassId || !AcademicYearId) {
      return res.status(400).json({
        error: true,
        message: "StudentId, ClassId and AcademicYearId are required"
      });
    }

    // prevent duplicate enrollment
    const [exists] = await db.query(
      `
      SELECT *
      FROM enrollments
      WHERE StudentId = ?
      AND AcademicYearId = ?
      `,
      [StudentId, AcademicYearId]
    );

    if (exists.length > 0) {
      return res.status(400).json({
        error: true,
        message: "Student already enrolled in this academic year"
      });
    }

    await db.query(
      `
      INSERT INTO enrollments
      (
        StudentId,
        ClassId,
        AcademicYearId,
        EnrollDate,
        Status
      )
      VALUES (?,?,?,?,?)
      `,
      [
        StudentId,
        ClassId,
        AcademicYearId,
        EnrollDate || new Date(),
        Status || "active"
      ]
    );

    res.json({
      error: false,
      message: "Enrollment Created"
    });

  } catch (error) {
    logerror("create enrollment", error, res);
  }
};


// ==============================
// GET ALL ENROLLMENTS done
// ==============================
const get_enrollments = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        e.Id,
        e.EnrollDate,
        e.Status,
        s.KhmerName AS StudentName,
        c.ClassName AS ClassName,
        a.Name AS AcademicName
      FROM enrollments e
      JOIN students s 
        ON s.Id = e.StudentId
      JOIN classes c 
        ON c.Id = e.ClassId
      JOIN academic_years a 
        ON a.Id = e.AcademicYearId
      ORDER BY e.Id ASC
    `);

    res.json({
      error: false,
      list: rows
    });

  } catch (error) {
    logerror("get enrollments", error, res);
  }
};

// ==============================
// GET SINGLE ENROLLMENT
// ==============================
const get_one_enrollment = async (req, res) => {
  try {

    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM enrollments
      WHERE Id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Enrollment not found"
      });
    }

    res.json({
      error: false,
      data: rows[0]
    });

  } catch (error) {
    logerror("get one enrollment", error, res);
  }
};


// ==============================
// UPDATE ENROLLMENT
// ==============================
const update_enrollment = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      StudentId,
      ClassId,
      AcademicYearId,
      EnrollDate,
      Status
    } = req.body;

    await db.query(
      `
      UPDATE enrollments
      SET
        StudentId = ?,
        ClassId = ?,
        AcademicYearId = ?,
        EnrollDate = ?,
        Status = ?
      WHERE Id = ?
      `,
      [
        StudentId,
        ClassId,
        AcademicYearId,
        EnrollDate,
        Status,
        id
      ]
    );

    res.json({
      error: false,
      message: "Enrollment Updated"
    });

  } catch (error) {
    logerror("update enrollment", error, res);
  }
};


// ==============================
// DELETE ENROLLMENT
// ==============================
const delete_enrollment = async (req, res) => {
  try {

    const { id } = req.params;

    await db.query(
      `
      DELETE FROM enrollments
      WHERE Id = ?
      `,
      [id]
    );

    res.json({
      error: false,
      message: "Enrollment Deleted"
    });

  } catch (error) {
    logerror("delete enrollment", error, res);
  }
};

//part2 not yet
const xlsx = require("xlsx");
   const ImportUploadStudents = async (req, res) => {
  try {
    //const xlsx = require("xlsx");

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.SheetNames[0];

    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);

    console.log("Excel Data:", data);

    for (let row of data) {
      const sql = `
        INSERT INTO students
        (StudentCode, Name, KhmerName,Gender,DOB, ClassId, TeacherId, DadName, MomName, Address,Image, ParentPhone)
        VALUES
        (:StudentCode, :Name, :KhmerName, :Gender,:DOB,:ClassId, :TeacherId, :DadName, :MomName, :Address, :Image,:ParentPhone)
      `;

      await db.query(sql, {
        StudentCode: row.StudentCode,
        Name: row.Name,
        KhmerName: row.KhmerName,
        Gender:row.Gender,
        DOB: new Date(row.DOB),
        ClassId: row.ClassId,
        TeacherId: row.TeacherId,
        DadName: row.DadName,
        MomName: row.MomName,
        Address: row.Address,
        Image:row.Image,
        ParentPhone: row.ParentPhone
      });
    }

    res.json({
      message: "Import success and inserted into database"
    });

  } catch (error) {
    logerror("Import Student",error,res);
  }
};
// both staff and teacher
const getStudentsByClass = async (req, res) => {
  try {
    const ClassId = req.params.ClassId;

    var sql  = `
      SELECT * FROM students
      WHERE ClassId = ?
    `;
    var params = [ClassId];

    // If teacher → verify ownership
    if (req.user.role === "teacher") {
      const [check] = await db.query(
        `SELECT * FROM classes WHERE TeacherId=? AND ClassId=?`,
        [req.user.Id, ClassId]
      );

      if (check.length === 0) {
        return res.status(403).json({
          message: "Not your class"
      });
      }
    }

    const [students] = await db.query(sql, params);

      res.json({
          error:false,
          message:"Welcome to your Class",
          students:students
      });

  } catch (error) {
   logerror("getstudent By Id",error,res);
  }
};

const getStudentAttendanceHistory = async (req, res) => {
  try {
    const StudentId = req.params.Id;

    let query = `
      SELECT sa.*, c.ClassName
      FROM student_attendance sa
      JOIN classes c ON sa.ClassId = c.Id
      WHERE sa.StudentId = ?
      ORDER BY sa.AttendanceDate DESC
    `;
    let params = [StudentId];

    // If teacher → verify student belongs to their class
    if (req.user.Role === "teacher") {
      query = `
        SELECT sa.*, c.ClassName
        FROM student_attendance sa
        JOIN classes c ON sa.ClassId = c.Id
        JOIN teacher_class_subjects tcs ON sa.ClassId = tcs.ClassId
        WHERE sa.StudentId = ? AND tcs.TeacherId = ?
        ORDER BY sa.AttendanceDate DESC
      `;
      params = [StudentId, req.user.Id];
    }

    const [attendance] = await db.query(query, params);

    res.json({
      message: "History student attendance",
      attendance: attendance
    });

  } catch (error) {
    logerror("student attendance history", error, res);
  }
};

const getStudentPayments = async (req, res) => {
  try {
    const studentId = req.params.Id;

    var sql = `
      SELECT * FROM payments
      WHERE StudentId = ?
      ORDER BY PaymentDate DESC
    `;
    var params = [studentId];

    // If teacher → verify student belongs to their class
    if (req.user.role === "teacher") {
      sql = `
        SELECT p.*
        FROM payments p
        JOIN students s ON p.StudentId = s.Id
        JOIN teacher_class_subjects tcs ON s.ClassId = tcs.ClassId
        WHERE p.StudentId = ? AND tcs.TeacherId = ?
        ORDER BY p.PaymentDate DESC
      `;
      params = [studentId, req.user.Id];
    }

    const [payments] = await db.query(sql, params);

          res.json({
               error:false,
               message:"Get student Payment Success",
               payments:payments
          });

  } catch (error) {
    logerror(" Payment student",error,res);
  }
};
module.exports={
     create_student,
     get_all_student,
     getStudentCount,
     getStudentProfile,
     get_one_student,
     delete_student,
     StudentSelect,
     create_enrollment,
     get_enrollments,
     get_one_enrollment,
     update_enrollment,
     delete_enrollment,


     ImportUploadStudents,
     getStudentAttendanceHistory,
     getStudentPayments,
     getStudentsByClass,
     update
}