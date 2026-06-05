const leave_request_controller = require("../controller/leave_request_con");
const auth = require("../middlewares/auth");
const role = require("../middlewares/roles");

const leave_request_route = (app) => {

  app.get(
  "/api/admin/leave-requests/pending-count",
  auth,
  role("admin"),
  leave_request_controller.getPendingLeaveCount);
  // Teacher
  app.post(
    "/api/attendance/teacher/permission",
    auth,
    role("teacher"),
    leave_request_controller.requestPermission
  );

  app.get(
    "/api/teacher/leave-requests",
    auth,
    role("teacher"),
    leave_request_controller.getMyLeaveRequests
  );

  // Admin
  app.get(
    "/api/admin/leave-requests",
    auth,
    role("admin"),
    leave_request_controller.getLeaveRequests
  );

  app.put(
    "/api/admin/leave-requests/:id/approve",
    auth,
    role("admin"),
    leave_request_controller.approveLeaveRequest
  );

  app.put(
    "/api/admin/leave-requests/:id/reject",
    auth,
    role("admin"),
    leave_request_controller.rejectLeaveRequest
  );
};

module.exports = leave_request_route;