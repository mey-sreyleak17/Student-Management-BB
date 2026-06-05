const log_con =
require("../controller/log_con");

const auth =
require("../middlewares/auth");

const adminOnly =
require("../middlewares/adminOnly");

const log = (app) => {

  app.get(
    "/api/activity-logs",
    auth,
    adminOnly,
    log_con.getActivityLogs
  );

};

module.exports = log;