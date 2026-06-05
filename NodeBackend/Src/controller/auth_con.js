
const {logerror, isEmptyorNull}=require("../config/helper");
const db=require("../config/db");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const nodemailer=require("nodemailer");
const {
  saveActivityLog
} = require("../config/activityLogger");
const {generateAccessToken,generateRefreshToken}=require("../utils/token");

const getAll = async (req, res) => {
  try {

    const query = `
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

      ORDER BY u.Id DESC
    `;

    const [rows] =
      await db.query(query);

    res.json(rows);

  } catch (error) {

    logerror(
      "Get All Users",
      error,
      res
    );

  }
};
//completed
const register_user = async (
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
            "User Created",
            error,
            res
        );

    }

};
//done
const user_login = async (req, res) => {

    try {

        const { Email, Password } = req.body;

        // FIND USER
        const [rows] = await db.query(
            `SELECT * FROM users WHERE Email=?`,
            [Email]
        );

        // CHECK EMAIL
        if (rows.length === 0) {

            return res.status(400).json({
                message: "Invalid Email"
            });

        }

        const user = rows[0];

        // CHECK PASSWORD
        const match = await bcrypt.compare(
            Password,
            user.Password
        );

        if (!match) {

            return res.status(400).json({
                message: "Invalid Password"
            });

        }

        // GENERATE TOKENS
        const accessToken =
        generateAccessToken(user);

        const refreshToken =
        generateRefreshToken(user);

        // TOKEN EXPIRY
        const expiry = new Date(
            Date.now() +
            1 * 24 * 60 * 60 * 1000
        );

        // SAVE REFRESH TOKEN
        await db.query(
            `
            INSERT INTO refresh_tokens
            (
                UserId,
                Token,
                Expiry
            )
            VALUES (?, ?, ?)
            `,
            [
                user.Id,
                refreshToken,
                expiry
            ]
        );

        // SAVE ACTIVITY LOG
        await saveActivityLog(
            user.Id,
            user.Name,
            "Logged into system",
            "Success"
        );

        // RESPONSE
        res.json({

            message:
            "Login successful",

            accessToken,

            refreshToken,

            role:
            user.Role,

            email:
            user.Email,

            Name:
            user.Name

        });

    } catch (error) {

        logerror(
            "User Login",
            error,
            res
        );

    }

};
//done
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(403).json({ message: "No refresh token provided" });
    }

    // Check in DB
    const [rows] = await db.query(
      "SELECT * FROM refresh_tokens WHERE Token = ?",
      [refreshToken]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }

    const stored = rows[0];

    // Expiry check
    if (Date.now() > new Date(stored.Expiry).getTime()) {
      return res.status(400).json({ message: "Refresh token expired" });
    }

    // Verify JWT
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // Create new access token
    const newAccessToken = jwt.sign(
      { Id: decoded.Id, role: decoded.Role },
      process.env.JWT_SECRET,
      { expiresIn: 30*60 }
    );

    return res.json
    ({
      message:"Refresh Token Successfully",
      accessToken: newAccessToken
    });
  } catch (err) {
    console.log("ERROR:", err.message);
    return res.status(500).json({ message: err.message });
  }
};
const logOut=async(req,res)=>{
     try {
          const {refreshToken}=req.body;
          await db.query(
               `Delete from refresh_tokens where token=?`,
               [refreshToken]
          );
          res.json({
               message:"Logged out successfully"
          });
     } catch (error) {
          logerror("Logout auth",error,res);
     }
}


const user_changePassword = async (req, res) => {

  try {

    const userId = req.user.Id;

    const {
      oldPassword,
      newPassword,
    } = req.body;

    console.log("USER ID:", userId);

    db.query(
      "SELECT * FROM users WHERE Id=? LIMIT 1",
      [userId],
      async (err, result) => {

        try {

          if (err) {
            console.log("DB ERROR:", err);

            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          console.log("RESULT:", result);

          if (!result.length) {

            return res.status(404).json({
              success: false,
              message: "User not found",
            });

          }

          const user = result[0];

          console.log("USER FOUND");

          const isMatch =
            await bcrypt.compare(
              oldPassword,
              user.Password
            );

          console.log(
            "PASSWORD MATCH:",
            isMatch
          );

          if (!isMatch) {

            return res.status(400).json({
              success: false,
              message:
                "Current password is incorrect",
            });

          }

          const hashedPassword =
            await bcrypt.hash(
              newPassword,
              10
            );

          console.log(
            "PASSWORD HASHED"
          );

          db.query(
            "UPDATE users SET Password=? WHERE Id=?",
            [
              hashedPassword,
              userId,
            ],
            (err2) => {

              if (err2) {

                console.log(
                  "UPDATE ERROR:",
                  err2
                );

                return res.status(500).json({
                  success: false,
                  message:
                    err2.message,
                });

              }

              console.log(
                "PASSWORD UPDATED"
              );

              return res.json({
                success: true,
                message:
                  "Password changed successfully",
              });

            }
          );

        } catch (error) {

          console.log(
            "INNER ERROR:",
            error
          );

          return res.status(500).json({
            success: false,
            message:
              error.message,
          });

        }

      }
    );

  } catch (error) {

    console.log(
      "OUTER ERROR:",
      error
    );
    logerror("User change Password",error,res);

  }

};

// forgotPassword

const forgot_Password = async (req, res) => {
  try {
    const { Email } = req.body;
    if (!Email) return res.status(400).json({ message: "Email is required" });

    // 1. Table name fix: 'users' instead of 'user'
    const [users] = await db.query('SELECT Id FROM users WHERE Email = ?', [Email]);
    if (users.length === 0) return res.status(404).json({ message: "Email not found" });

    const user = users[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Suggestion: Don't hash the OTP if you want to verify it easily, 
    // OR hash it but ensure your verify logic matches.
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // 2. Insert into the correct table: password_resets
    await db.query(
      `INSERT INTO password_resets (UserId, OtpCode, ExpireAt, Verified) 
       VALUES (?, ?, ?, ?)`,
      [user.Id, otp, expiry, 0] // Verified defaults to 0 (false)
    );

    // 3. Nodemailer Configuration
    // Fixed: Using host/port is more reliable than 'service' to avoid connection errors
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Must be a Google App Password
      }
    });

    await transporter.sendMail({
      from: `"Bright Brain School System" <${process.env.EMAIL_USER}>`,
      to: Email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #4CAF50;">Password Reset</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing: 5px;">${otp}</h1>
          <p>This code expires in <b>5 minutes</b>.</p>
        </div>
      `
    });

    // 4. Generate Reset Token (Optional, but good for identifying the session)
    const resetToken = jwt.sign(
      { email: Email, userId: user.Id },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    return res.json({ 
      message: "OTP sent successfully", 
      resetToken 
    });
  } catch (error) {
    logerror("Forget Password",error,res);
  }
};

//no email completed
const verify__Otp = async (req, res) => {
  try {

    const { otp } = req.body;

    // Validate OTP input
    if (!otp) {
      return res.status(400).json({
        message: "OTP is required",
      });
    }

    // Get token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const Email = decoded.email;

    // Find user
    const [users] = await db.query(
      "SELECT * FROM users WHERE Email = ?",
      [Email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = users[0];

    // Find latest OTP
    const [rows] = await db.query(
      `SELECT * FROM password_resets
       WHERE UserId = ?
       AND Verified = 0
       ORDER BY Id DESC
       LIMIT 1`,
      [user.Id]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    const resetRecord = rows[0];

    // Check OTP expiry
    if (
      new Date() >
      new Date(resetRecord.ExpireAt)
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // Compare OTP
    if (
      String(resetRecord.OtpCode).trim() !==
      String(otp).trim()
    ) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Mark OTP verified
    await db.query(
      `UPDATE password_resets
       SET Verified = 1
       WHERE Id = ?`,
      [resetRecord.Id]
    );

    return res.json({
      message: "OTP verified successfully",
    });

  } catch (error) {

    console.error(error);

    // Expired JWT
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Reset token expired",
      });
    }

    // Invalid JWT
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid reset token",
      });
    }

    // Other errors
    return res.status(500).json({
      message: "Server error",
    });
  }
};
//no email
const reset_Password = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No reset token provided",
      });
    }

    // Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const Email = decoded.email;

    // Validate passwords
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query(
      `UPDATE users
       SET Password = ?
       WHERE Email = ?`,
      [hashedPassword, Email]
    );

    return res.json({
      message: "Password reset successful",
    });

  } catch (error) {
     logerror("Reset Password",error,res);
  }
};
module.exports={
     register_user,
     user_login,
     refreshToken,
     logOut,
     user_changePassword,
     forgot_Password,
     reset_Password,
     verify__Otp,
     getAll
}