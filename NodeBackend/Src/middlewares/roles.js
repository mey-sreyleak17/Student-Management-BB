const role = (...roles) => {

  return (req, res, next) => {

    if (!req.user) {

      return res.status(401).json({
        error: true,
        message: "Unauthorized"
      });

    }

    // FIX HERE
    if (
      !roles.includes(
        req.user.Role
      )
    ) {

      return res.status(403).json({
        error: true,
        message: "Forbidden"
      });

    }

    next();

  };

};

module.exports = role;