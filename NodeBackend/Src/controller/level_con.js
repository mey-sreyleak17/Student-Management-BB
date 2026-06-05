const db = require("../config/db");
const {logerror, isEmptyorNull}=require("../config/helper");
// GET ALL
exports.getAll = async (req, res) => {
  try {

    const [rows] = await db.query(`
      
      SELECT
        l.Id,
        l.LevelName,
        l.LevelOrder,
        p.ProgramName,

        COUNT(s.Id) AS TotalStudent

      FROM levels l

      LEFT JOIN students s
      ON l.Id = s.LevelId

      LEFT JOIN programs p
      ON p.Id = l.ProgramId

      GROUP BY 
        l.Id,
        l.LevelName,
        l.LevelOrder,
        p.ProgramName

      ORDER BY l.Id ASC
    `);

    res.json(rows);

  } catch (error) {

    logerror(
      "Get All Level",
      error,
      res
    );
  }
};
// CREATE
exports.create = async (req, res) => {
  try {
    const {
      LevelName,
      ProgramId,
      LevelOrder
    } = req.body;

    await db.query(
      `
      INSERT INTO levels
      (LevelName,ProgramId,LevelOrder)
      VALUES (?,?,?)
      `,
      [LevelName,ProgramId,LevelOrder]
    );

    res.json({
      success: true,
      message: "Level created",
    });

  } catch (error) {
     logerror("Level Create",error,res);;
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const {
     LevelName,
     ProgramId,
     LevelOrder
    } = req.body;

    await db.query(
  `
  UPDATE levels
  SET
    LevelName = ?,
    ProgramId = ?,
    LevelOrder = ?
  WHERE Id = ?
  `,
      [
        LevelName,
        ProgramId,
        LevelOrder,
         id
      ]
    );

    res.json({
      success: true,
      message: "Level updated",
    });

  } catch (error) {
     logerror("Level Update",error,res);
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      DELETE FROM levels
      WHERE Id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Level Was deleted",
    });

  } catch (error) {
     logerror(" Remove Level",error,res);
  }
};
exports.LevelSelect = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT Id, LevelName
      FROM levels
    `);

    res.json(rows);

  } catch (error) {
    logerror("Level Select", error, res);
  }
};
 exports.ProgramSelect=async (req, res) => {

  const [rows] = await db.query(
    `
    SELECT Id, ProgramName
    FROM programs
    `
  );

  res.json(rows);

 };