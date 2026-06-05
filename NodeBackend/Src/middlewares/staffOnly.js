const staffOnly = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            error: true,
            message: "Unauthorized"
        });
    }
    if (req.user.Role !== "staff") {
        return res.status(403).json({
            error: true,
            message: "Staff access only"
        });
    }

    next();
};

module.exports = staffOnly;