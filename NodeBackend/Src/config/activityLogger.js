const db = require("./db");

const saveActivityLog = async (

  UserId,
  Action,
  Status = "Success"

) => {

  try {

    await db.query(

      `
      INSERT INTO activity_logs
      (
        UserId,
        Action,
        Status
      )
      VALUES (?, ?, ?)
      `,

      [
        UserId,
        Action,
        Status
      ]

    );

  } catch (error) {

    console.log(
      "Activity Log Error:",
      error
    );

  }

};

module.exports = {
  saveActivityLog
};