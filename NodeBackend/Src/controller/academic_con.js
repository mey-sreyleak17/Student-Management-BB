const db = require("../config/db");
const {logerror, isEmptyorNull}=require("../config/helper");
// GET ALL
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM academic_years
      ORDER BY Id ASC
    `);

    res.json(rows);

  } catch (error) {
    logerror("Academic Get All",error,res);
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const {
      Name,
      StartDate,
      EndDate,
    } = req.body;

    await db.query(
      `
      INSERT INTO academic_years
      (Name, StartDate, EndDate)
      VALUES (?, ?, ?)
      `,
      [Name, StartDate, EndDate]
    );

    res.json({
      success: true,
      message: "Academic year created",
    });

  } catch (error) {
     logerror("Academic Create",error,res);;
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      Name,
      StartDate,
      EndDate,
    } = req.body;

    await db.query(
      `
      UPDATE academic_years
      SET
      Name = ?,
      StartDate = ?,
      EndDate = ?
      WHERE Id = ?
      `,
      [
        Name,
        StartDate,
        EndDate,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Academic year updated",
    });

  } catch (error) {
     logerror("Academic Update",error,res);
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      DELETE FROM academic_years
      WHERE Id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Academic year deleted",
    });

  } catch (error) {
     logerror("Academic Remove",error,res);
  }
};