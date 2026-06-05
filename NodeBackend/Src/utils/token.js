const jwt = require("jsonwebtoken");

const {
  logerror
} = require("../config/helper");

// ======================================
// ACCESS TOKEN
// ======================================

const generateAccessToken = (
  user
) => {

  try {

    return jwt.sign(

      {
        Id: user.Id,
        Name: user.Name,
        Email: user.Email,
        Role: user.Role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: 8 * 60 * 60 // 8h
      }

    );

  } catch (error) {

    logerror(
      "Generate Access Token",
      error
    );

  }

};

// ======================================
// REFRESH TOKEN
// ======================================

const generateRefreshToken = (
  user
) => {

  try {

    return jwt.sign(

      {
        Id: user.Id,
        Name: user.Name,
        Email: user.Email,
        Role: user.Role
      },

      process.env.REFRESH_SECRET,

      {
        expiresIn:
        7 * 24 * 60 * 60 // 7d
      }

    );

  } catch (error) {

    logerror(
      "Refresh Token",
      error
    );

  }

};

module.exports = {

  generateAccessToken,
  generateRefreshToken

};