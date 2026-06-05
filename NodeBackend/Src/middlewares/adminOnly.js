const adminOnly = (
  req,
  res,
  next
) => {

    // CHECK USER
    if (!req.user) {

        return res.status(401).json({
            error: true,
            message: "Unauthorized"
        });

    }

    // CHECK ROLE
    if (req.user.Role !== "admin") {

        return res.status(403).json({
            error: true,
            message: "Admin access only"
        });

    }

    next();

};

module.exports = adminOnly;