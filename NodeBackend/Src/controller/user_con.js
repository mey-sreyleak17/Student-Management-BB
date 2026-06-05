const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { logerror } = require("../config/helper");
const {
  saveActivityLog
} = require("../config/activityLogger");
// ======================================
// GET USERS
// ======================================

const getAll = async (req, res) => {
  try {

    const search =
      req.query.search || "";

    // =========================
    // GET TOTAL USERS
    // =========================

    const [totalResult] =
      await db.query(`
        SELECT COUNT(Id) AS TotalUsers
        FROM users
      `);

    const totalUsers =
      totalResult[0]
        .TotalUsers;

    // =========================
    // MAIN QUERY
    // =========================

    let query = `
      SELECT
        u.Id,
        u.Name,
        u.Email,
        u.Role,
        u.IsActive,
        u.CreateAt,

        t.Name AS TeacherName,
        s.Name AS StudentName,
        st.Name AS StaffName

      FROM users u

      LEFT JOIN teachers t
        ON u.TeacherId = t.Id

      LEFT JOIN students s
        ON u.StudentId = s.Id

      LEFT JOIN staffs st
        ON u.StaffId = st.Id
    `;

    let values = [];

    // =========================
    // SEARCH
    // =========================

    if (search) {

      query += `
        WHERE
          u.Name LIKE ?
          OR u.Email LIKE ?
          OR u.Role LIKE ?
      `;

      values.push(
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
      );
    }

    // =========================
    // ORDER
    // =========================

    query += `
      ORDER BY u.Id DESC
    `;

    // =========================
    // LIMIT ONLY TABLE
    // =========================

    if (!search) {
      query += `
        LIMIT 100
      `;
    }

    const [rows] =
      await db.query(
        query,
        values
      );

    // =========================
    // RESPONSE
    // =========================

    res.json({
      TotalUsers:
        totalUsers,
      Data: rows,
    });

  } catch (error) {

    logerror(
      "Get Users",
      error,
      res
    );

  }
};
// ======================================
// CREATE USER
// ======================================

const create = async (
  req,
  res
) => {
  try {

        const {
            Name,
            Email,
            Password,
            Role,
            TeacherId,
            StudentId,
            StaffId
        } = req.body;

        // CHECK EMAIL
        const [exist] = await db.query(
            `
            SELECT *
            FROM users
            WHERE Email = ?
            `,
            [Email]
        );

        // EMAIL EXISTS
        if (exist.length > 0) {

            return res.status(400).json({
                message:
                "Email already exists"
            });

        }

        // HASH PASSWORD
        const hash =
        await bcrypt.hash(
            Password,
            10
        );

        // INSERT USER
        const [result] =
        await db.query(

            `
            INSERT INTO users
            (
                Name,
                Email,
                Password,
                Role,
                TeacherId,
                StudentId,
                StaffId,
                IsActive
            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,

            [
                Name,
                Email,
                hash,
                Role,
                TeacherId || null,
                StudentId || null,
                StaffId || null,
                1
            ]

        );
       // console.log(req.user);

        // SAVE ACTIVITY LOG
        await saveActivityLog(

            req.user.Id,

            `Created new user: ${Name}`,

            "Success"

        );

        // RESPONSE
        res.status(201).json({

            message:
            "User Created Successfully",

            userId:
            result.insertId

        });

  } catch (error) {

    logerror(
      "Create User",
      error,
      res
    );

  }
};

// ======================================
// UPDATE USER
// ======================================

const update = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const {
      Name,
      Email,
      Role,
      TeacherId,
      StudentId,
      StaffId,
      IsActive,
    } = req.body;

    // CHECK USER
    const [checkUser] =
      await db.query(
        `
        SELECT Id
        FROM users
        WHERE Id = ?
      `,
        [id]
      );

    if (
      checkUser.length === 0
    ) {
      return res.status(404)
        .json({
          message:
            "User not found",
        });
    }

    // UPDATE
   await db.query(
  `
  UPDATE users
  SET
    Name = ?,
    Email = ?,
    Role = ?,
    TeacherId = ?,
    StudentId = ?,
    StaffId = ?,
    IsActive = ?
  WHERE Id = ?
`,
  [
    Name,
    Email,
    Role,
    TeacherId || null,
    StudentId || null,
    StaffId || null,
    IsActive,
    id,
  ]
);

// SAVE LOG
await saveActivityLog(

  req.user.Id,

  `Updated user: ${Name}`,

  "Updated"

);

res.json({
  message:
  "User updated successfully",
});
  } catch (error) {

    logerror(
      "Update User",
      error,
      res
    );

  }
};

// ======================================
// DELETE USER
// ======================================

const remove = async (
  req,
  res
) => {

  try {

    const { id } =
    req.params;

    // =========================
    // CHECK USER
    // =========================

    const [checkUser] =
    await db.query(

      `
      SELECT Id, Name
      FROM users
      WHERE Id = ?
      `,

      [id]

    );

    // USER NOT FOUND
    if (
      checkUser.length === 0
    ) {

      return res.status(404)
      .json({

        message:
        "User not found",

      });

    }

    // GET USER NAME
    const deletedName =
    checkUser[0].Name;

    // =========================
    // DELETE USER
    // =========================

    await db.query(

      `
      DELETE FROM users
      WHERE Id = ?
      `,

      [id]

    );

    // =========================
    // SAVE ACTIVITY LOG
    // =========================

    await saveActivityLog(

      req.user.Id,

      `Deleted user: ${deletedName}`,

      "Deleted"

    );

    // =========================
    // RESPONSE
    // =========================

    res.json({

      message:
      "User deleted successfully",

    });

  } catch (error) {

    logerror(

      "Delete User",

      error,

      res

    );

  }

};
const get_profile =
async (req, res) => {

  try {

    const teacherId =
      req.user.Id;

    const [rows] =
      await db.query(
        `
        SELECT
          Id,
          TeacherCode,
          Name,
          KhmerName,
          Gender,
          DOB,
          Phone,
          Shift,
          Address,
          Image,
          CreateAt
        FROM teachers
        WHERE Id = ?
        `,
        [teacherId]
      );

    res.json(rows[0]);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false
    });

  }

};
const update_profile =
async (req, res) => {

  try {

    const teacherId =
      req.user.Id;

    const {
      Name,
      KhmerName,
      Phone,
      Address
    } = req.body;

    let image = null;

    if (req.file) {

      image =
        req.file.path;

    }

    await db.query(
      `
      UPDATE teachers
      SET
        Name = ?,
        KhmerName = ?,
        Phone = ?,
        Address = ?,
        Image = IFNULL(?, Image)
      WHERE Id = ?
      `,
      [
        Name,
        KhmerName,
        Phone,
        Address,
        image,
        teacherId
      ]
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false
    });

  }

};
module.exports = {
  getAll,
  create,
  update,
  remove,
  get_profile,
  update_profile,
};

