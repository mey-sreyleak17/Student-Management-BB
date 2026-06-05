const db =
require("../config/db");
const {logerror}=require("../config/helper");


const createfee = async (
  req,
  res
) => {

  try {

    const {
      ClassId,
      FeeName,
      ProgramType,
      DurationType,
      Amount,
      Description,
    } = req.body;

    if (
      !ClassId ||
      !FeeName ||
      !ProgramType ||
      !DurationType ||
      !Amount
    ) {

      return res.status(400).json({
        message:
          "Please fill all required fields",
      });
    }

    await db.query(
      `
      INSERT INTO fee
      (
        ClassId,
        FeeName,
        ProgramType,
        DurationType,
        Amount,
        Description
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        ClassId,
        FeeName,
        ProgramType,
        DurationType,
        Amount,
        Description,
      ]
    );

    res.json({
      message:
        "Fee created successfully",
    });

  } catch (error) {
    logerror("Create fee",error,res);
  }
};

const getlist = async (
  req,
  res
) => {

  try {

    const [list] = await db.query(
      `
      SELECT
        f.*,
        f.Id,
        c.ClassName
      FROM fee f
      INNER JOIN classes c
      ON f.ClassId = c.Id
      ORDER BY f.Id ASC
      `
    );

    res.json({
      list,
    });

  } catch (error) {
    logerror("Get List Fee",error,res);
  }
};

const updateFee = async (
  req,
  res
) => {

  try {

    const { Id } =
      req.params;

    const {
      ClassId,
      FeeName,
      ProgramType,
      DurationType,
      Amount,
      Description,
    } = req.body;

    await db.query(
      `
      UPDATE fee
      SET
        ClassId = ?,
        FeeName = ?,
        ProgramType = ?,
        DurationType = ?,
        Amount = ?,
        Description = ?
      WHERE Id = ?
      `,
      [
        ClassId,
        FeeName,
        ProgramType,
        DurationType,
        Amount,
        Description,
        Id,
      ]
    );

    res.json({
      message:
        "Fee updated successfully",
    });

  } catch (error) {
      logerror("Update Fee",error,res);
  }
};

const deleteFee = async (
  req,
  res
) => {

  try {

    const { Id } =
      req.params;

    await db.query(
      `
      DELETE FROM fee
      WHERE Id = ?
      `,
      [Id]
    );

    res.json({
      message:
        "Fee deleted successfully",
    });

  } catch (error) {
    logerror("Delete Fee",error,res);
  }
};

const getPaymentSummary =
async (
  req,
  res
) => {

  try {

    const [total] =
      await db.query(
        `
        SELECT
        SUM(Amount)
        AS totalCollection
        FROM fee
        `
      );

    const [count] =
      await db.query(
        `
        SELECT
        COUNT(Id)
        AS totalFees
        FROM fee
        `
      );

    res.json({

      totalCollection:
        total[0]
          .totalCollection || 0,

      pendingPayments: 0,

      paidStudents:
        count[0]
          .totalFees || 0,
    });

  } catch (error) {
    logerror("Get Payment Summary",error,res);
  }
};

module.exports = {
  createfee,
  getlist,
  updateFee,
  deleteFee,
  getPaymentSummary,
};