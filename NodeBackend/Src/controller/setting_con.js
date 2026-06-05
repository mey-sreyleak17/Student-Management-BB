const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const {logerror}=require("../config/helper");

// =========================
// GET SETTINGS
// =========================

const getSettings = async (req, res) => {

  try {

    const [rows] = await db.query(
      "SELECT * FROM settings LIMIT 1"
    );

    res.json({
      settings: rows[0],
    });

  } catch (error) {
    logerror("Get setting",error,res);
  }
};

// =========================
// UPDATE SETTINGS
// =========================

const updateSettings = async (
  req,
  res
) => {

  try {

    const {
      schoolName,
      schoolKhName,
      country,
      currency,
      phone,
      email,
      emailNotification,
      darkMode,
    } = req.body;

    let logo = null;
    let schoolPicture = null;

    // ======================
    // LOGO
    // ======================

    if (
      req.files?.logo?.[0]
    ) {

      logo =
        req.files.logo[0].path;
    }

    // ======================
    // SCHOOL PICTURE
    // ======================

    if (
      req.files?.schoolPicture?.[0]
    ) {

      schoolPicture =
        req.files.schoolPicture[0].path;
    }

    // ======================
    // UPDATE
    // ======================

    await db.query(
      `
      UPDATE settings
      SET
        SchoolName = ?,
        SchoolKhName = ?,
        Country = ?,
        Currency = ?,
        Phone=?,
        Email = ?,
        EmailNotification = ?,
        DarkMode = ?,

        Logo =
        COALESCE(?, Logo),

        SchoolPicture =
        COALESCE(
          ?,
          SchoolPicture
        ),

        UpdatedAt =
        CURRENT_TIMESTAMP

      WHERE Id = 1
      `,
      [
        schoolName,
        schoolKhName,
        country,
        currency,
        phone,
        email,
        emailNotification ? 1 : 0,
        darkMode ? 1 : 0,

        logo,
        schoolPicture,
      ]
    );

    res.json({
      message:
        "Settings Updated",
    });

  } catch (error) {
  logerror("Update setting",error,res);
  }
};
module.exports = {
  getSettings,
  updateSettings,
};