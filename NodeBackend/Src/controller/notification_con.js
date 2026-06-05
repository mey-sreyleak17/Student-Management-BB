const db = require("../config/db");

// Get Notifications
exports.getNotifications = async (req, res) => {
  try {

    const userId = req.user.Id;

    const [rows] = await db.query(
      `
      SELECT *
      FROM notifications
      WHERE UserId = ?
      ORDER BY Id DESC
      `,
      [userId]
    );

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// Unread Count
exports.getUnreadCount = async (req, res) => {
  try {

    const userId = req.user.Id;

    const [[result]] = await db.query(
      `
      SELECT COUNT(*) count
      FROM notifications
      WHERE UserId = ?
      AND IsRead = 0
      `,
      [userId]
    );

    res.json({
      count: result.count
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// Mark One Read
exports.markNotificationRead = async (req, res) => {
  try {

    const { id } = req.params;

    await db.execute(
      `
      UPDATE notifications
      SET IsRead = 1
      WHERE Id = ?
      `,
      [id]
    );

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// Mark All Read
exports.markAllRead = async (req, res) => {
  try {

    const userId = req.user.Id;

    await db.execute(
      `
      UPDATE notifications
      SET IsRead = 1
      WHERE UserId = ?
      `,
      [userId]
    );

    res.json({
      success: true,
      message: "All notifications marked as read"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};