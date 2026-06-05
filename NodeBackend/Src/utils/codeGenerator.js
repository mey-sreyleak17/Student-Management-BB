const { logerror } = require("../config/helper");
const db=require("../config/db");
const generateYearCode = async (
  table,
  column,
  prefix
) => {
  try {

    const year = new Date().getFullYear();

    const [rows] = await db.query(
      `SELECT ${column}
       FROM ${table}
       WHERE ${column} LIKE ?
       ORDER BY ${column} DESC
       LIMIT 1`,
      [`${prefix}-${year}-%`]
    );

    let nextNumber = 1;

    if (rows.length > 0 && rows[0][column]) {

      const lastCode = rows[0][column];

      const parts = lastCode.split("-");

      const lastNumber = parseInt(parts[2]);

      nextNumber = lastNumber + 1;
    }

    const padded = String(nextNumber).padStart(3, "0");

    return `${prefix}-${year}-${padded}`;

  } catch (error) {

    console.log(error);

    throw error;
  }
};
module.exports={
  generateYearCode
}