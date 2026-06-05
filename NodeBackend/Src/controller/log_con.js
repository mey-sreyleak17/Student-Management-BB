const db = require("../config/db");

const getActivityLogs =
async (req, res) => {

  try {

    const { date } = req.query;

    let sql = `

      SELECT

        a.Id as \`key\`,

        a.UserId,

        u.Name as user,

        a.Action as action,

        a.Status as status,

        DATE_FORMAT(
          a.CreatedAt,
          '%d %b %Y - %h:%i %p'
        ) as time

      FROM activity_logs a

      LEFT JOIN users u
        ON a.UserId = u.Id

    `;

    let params = [];

    // FILTER BY DATE
    if (date) {

      sql += `
        WHERE DATE(a.CreatedAt) = ?
      `;

      params.push(date);

    }

    sql += `
      ORDER BY a.Id DESC
    `;

    const [rows] =
    await db.query(sql, params);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false
    });

  }

};
module.exports = {
  getActivityLogs
};