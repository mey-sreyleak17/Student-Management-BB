const db = require("../config/db");
const {logerror, isEmptyorNull}=require("../config/helper");
// GET ALL
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM subjects
      ORDER BY Id ASC
    `);

    res.json(rows);

  } catch (error) {
    logerror(" Get All Level",error,res);
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const {
      Name,
      KhmerName
    } = req.body;

    await db.query(
      `
      INSERT INTO subjects
      (SubjectName,KhmerName)
      VALUES (?,?)
      `,
      [Name,KhmerName]
    );

    res.json({
      success: true,
      message: "Subject created",
    });

  } catch (error) {
     logerror("Subject Create",error,res);;
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      Name,
      KhmerName
    } = req.body;

    await db.query(
      `
      UPDATE subjects
      SET
      SubjectName = ?,KhmerName=?
      WHERE Id = ?
      `,
      [
        Name,
        KhmerName,
        id
      ]
    );

    res.json({
      success: true,
      message: "Subject updated",
    });

  } catch (error) {
     logerror("Subject Update",error,res);
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      DELETE FROM subjects
      WHERE Id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Subject Was deleted",
    });

  } catch (error) {
     logerror(" Remove Subject",error,res);
  }
};