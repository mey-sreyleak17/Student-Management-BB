// controllers/classController.js
const db = require('../config/db');
const {logerror} =require("../config/helper");
// Get all classes
exports.getAllClasses = async (req, res) => {

  try {

    const query = `
      SELECT
  c.Id,
  c.ClassName,
  c.ClassCode,

  t.KhmerName AS TeacherName,

  p.ProgramName AS ProgramName,

  a.Name AS AcademicName

FROM classes c

LEFT JOIN teachers t
ON c.TeacherId = t.Id

LEFT JOIN programs p
ON c.ProgramId = p.Id

LEFT JOIN academic_years a
ON c.AcademicYearId = a.Id

ORDER BY c.Id ASC
    `;

    const [rows] = await db.query(query);

    res.json(rows);

  } catch (error) {

    logerror("Get All Class",error,res);

  }

};

// Count all classes
exports.getClassCount = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT COUNT(*) AS totalClasses FROM classes`
    );

    // ✅ use the alias you defined in SQL
    res.json({ totalClasses: results[0].totalClasses });
  } catch (err) {
    logerror("Count All Classes", err, res);
  }
};

// Get class by ID
exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query('SELECT * FROM classes WHERE Id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(results[0]);
  } catch (err) {
   logerror("Get One Class",err,res);
  }
};

// Add new class done
exports.addClass = async (req, res) => {
  try {
    const {
      ClassName,
      TeacherId,
      LevelId,
      AcademicYearId,
      ProgramId,
      Shift,
      Room,
    } = req.body;

    // =========================
    // Validation
    // =========================
    if (
      !ClassName ||
      !TeacherId ||
      !LevelId ||
      !AcademicYearId ||
      !ProgramId ||
      !Shift ||
      !Room
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // =========================
    // Get latest class
    // =========================
    const [lastClass] = await db.query(`
      SELECT Id
      FROM classes
      ORDER BY Id DESC
      LIMIT 1
    `);

    let nextNumber = 1;

    if (lastClass.length > 0) {
      nextNumber = lastClass[0].Id + 1;
    }

    // =========================
    // Generate Class Code
    // Example: CLS-001
    // =========================
    const ClassCode = `CLS-${String(nextNumber).padStart(3, "0")}`;

    // =========================
    // Insert Class
    // =========================
    const query = `
      INSERT INTO classes (
        ClassCode,
        ClassName,
        TeacherId,
        LevelId,
        AcademicYearId,
        ProgramId,
        Shift,
        Room
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      ClassCode,
      ClassName,
      TeacherId,
      LevelId,
      AcademicYearId,
      ProgramId,
      Shift,
      Room,
    ]);

    res.status(201).json({
      success: true,
      message: "Class added successfully",
      ClassCode,
      id: result.insertId,
    });
  } catch (err) {
    logerror("Add Class", err, res);
  }
};

// Update class
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { ClassName, TeacherId, LevelId } = req.body;
    const query = 'UPDATE Classes SET ClassName = ?, TeacherId = ?, LevelId = ?, UpdatedAt = NOW() WHERE Id = ?';
    const [result] = await db.query(query, [ClassName, TeacherId, LevelId, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ message: 'Class updated' });
  } catch (err) {
    logerror("Update Classes",err,res);
  }
};

// Delete class
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM Classes WHERE Id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ message: 'Class deleted' });
  } catch (err) {
    logerror("Delete Classes",err,res);
  }
};
//select data

exports. teacherSelect =async (req, res) => {

  const [rows] = await db.query(
    `
    SELECT Id,Name
    FROM teachers
    `
  );

  res.json(rows);
};


exports. ClassSelect =async (req, res) => {

  const [rows] = await db.query(
    `
    SELECT Id,ClassName
    FROM classes
    `
  );

  res.json(rows);
};

 
exports.AcademicSelect= async (req, res) => {

  const [rows] = await db.query(
    `
    SELECT Id, Name
    FROM academic_years
    `
  );

  res.json(rows);

};
exports.StudentSelect = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        Id,
        Name
      FROM students
      ORDER BY Name ASC
    `);

    res.status(200).json({
      Data: rows
    });

  } catch (err) {
    logerror("Get Student Select",err,res);

  }
};

exports.StaffSelect = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        Id,
        Name
      FROM staffs
      ORDER BY Name ASC
    `);

    res.status(200).json({
      Data: rows
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      Message: "Failed to fetch staffs"
    });

  }
};