const timetable_con =
require(
  "../controller/timeTable_con"
);
const auth = require("../middlewares/auth");

const timetable = (app) => {
  app.get(
    "/api/mytime-table",auth,
  timetable_con.getMyTimetable
);

};

module.exports =
timetable;