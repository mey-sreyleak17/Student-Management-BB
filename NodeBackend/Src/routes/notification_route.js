const notification_controller = require("../controller/notification_con");
const auth = require("../middlewares/auth");

const notification_route = (app) => {

  app.get(
    "/api/notifications",
    auth,
    notification_controller.getNotifications
  );

  app.get(
    "/api/notifications/unread-count",
    auth,
    notification_controller.getUnreadCount
  );

  app.put(
    "/api/notifications/:id/read",
    auth,
    notification_controller.markNotificationRead
  );

  app.put(
    "/api/notifications/read-all",
    auth,
    notification_controller.markAllRead
  );
};

module.exports = notification_route;