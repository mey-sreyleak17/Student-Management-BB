const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {

        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                error: true,
                message: "No token provided"
            });
        }

        const splitToken = token.split(" ")[1];

        const decoded = jwt.verify(splitToken, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            error: true,
            message: "Invalid token"
        });
    }
};

module.exports = auth;