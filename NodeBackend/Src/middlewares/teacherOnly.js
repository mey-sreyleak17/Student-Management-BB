const adminOnly = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            error: true,
            message: "Unauthorized"
        });
    }

    if (req.user.Role !== "teacher") {
        return res.status(403).json({
            error: true,
            message: "Teacher access only"
        });
    }

    next();
};

module.exports = adminOnly;