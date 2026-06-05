const score_con = require("../controller/score_con");
const teacherOnly = require("../middlewares/teacherOnly");
const adminOnly = require("../middlewares/adminOnly");
const auth = require("../middlewares/auth");

const score = (app) => {

  // Get all scores
  app.get(
  "/api/report",
  auth,
  score_con.getReport
);

  // Get one student's scores
  app.get(
    "/api/score/:Id",
    auth,
    teacherOnly,
    score_con.getStudentScores
  );

  // Create score
  app.post(
    "/api/score",
    auth,
    teacherOnly,
    score_con.createScore
  );

  // Update score
  app.put(
    "/api/score/:Id",
    auth,
    adminOnly,
    score_con.updateScore
  );

  // Delete score
  app.delete(
    "/api/score/:Id",
    auth,
    adminOnly,
    score_con.createScore
  );
};

module.exports = score;