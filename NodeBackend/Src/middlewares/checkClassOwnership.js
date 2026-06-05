const db = require("../config/db");

const checkClassOwnership = async (req, res, next) => {

    try {

        const classId = req.params.Id;
        const teacherId = req.user.Id;

        const [rows] = await db.query(
            "SELECT * FROM classes WHERE Id = ? AND TeacherId = ?",
            [classId, teacherId]
        );

        if (rows.length === 0) {
            return res.status(403).json({
                error: true,
                message: "You are not the owner of this class"
            });
        }

        next();

    } catch (error) {

        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
};
/*
SELECT * FROM classes
WHERE Id = classId
AND TeacherId = teacherId
*/

module.exports = checkClassOwnership;