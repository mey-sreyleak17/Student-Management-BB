const db = require("../config/db");

// =====================================
// Teacher Submit Leave Request
// =====================================
exports.requestPermission = async (req, res) => {
  try {
    const userId = req.user.Id;

    const {
      startDate,
      EndDate,
      Reason
    } = req.body;

    if (!startDate || !EndDate || !Reason) {
      return res.status(400).json({
        success: false,
        message:
          "Start Date, End Date and Reason are required",
      });
    }

    const [[pending]] = await db.query(
      `
      SELECT Id
      FROM leave_requests
      WHERE UserId = ?
      AND Status = 'pending'
      `,
      [userId]
    );

    if (pending) {
      return res.status(400).json({
        success: false,
        message:
          "You already have a pending request",
      });
    }

    const [insertResult] = await db.execute(
      `
      INSERT INTO leave_requests
      (
        UserId,
        StartDate,
        EndDate,
        Reason,
        Status
      )
      VALUES
      (
        ?, ?, ?, ?, 'pending'
      )
      `,
      [
        userId,
        startDate,
        EndDate,
        Reason,
      ]
    );

    const [[teacher]] = await db.query(
      `
      SELECT Name, Email
      FROM users
      WHERE Id = ?
      `,
      [userId]
    );

    const [admins] = await db.query(
      `
      SELECT Id
      FROM users
      WHERE Role = 'admin'
      `
    );

    for (const admin of admins) {
      await db.execute(
        `
        INSERT INTO notifications
        (
          UserId,
          Title,
          Message,
          Type,
          IsRead
        )
        VALUES
        (
          ?, ?, ?, ?, 0
        )
        `,
        [
          admin.Id,
          "Teacher Leave Request",
          `${teacher.Name} submitted a leave request from ${startDate} to ${EndDate}`,
          "leave_request",
        ]
      );
    }

    res.json({
      success: true,
      message:
        "Permission request submitted successfully",
      leaveRequestId:
        insertResult.insertId,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Teacher View Own Requests
// =====================================
exports.getMyLeaveRequests = async (
  req,
  res
) => {
  try {
    const userId = req.user.Id;

    const [rows] = await db.query(
      `
      SELECT *
      FROM leave_requests
      WHERE UserId = ?
      ORDER BY Id DESC
      `,
      [userId]
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Admin View All Requests
// =====================================
exports.getLeaveRequests = async (
  req,
  res
) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        lr.*,
        u.Name,
        u.Email
      FROM leave_requests lr
      LEFT JOIN users u
        ON u.Id = lr.UserId
      ORDER BY lr.Id DESC
      `
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Approve Leave Request
// =====================================
exports.approveLeaveRequest =
  async (req, res) => {
    try {
      const { id } = req.params;

      const [[request]] =
        await db.query(
          `
          SELECT *
          FROM leave_requests
          WHERE Id = ?
          `,
          [id]
        );

      if (!request) {
        return res.status(404).json({
          success: false,
          message:
            "Request not found",
        });
      }

      if (
        request.Status !==
        "pending"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Request already processed",
        });
      }

      await db.execute(
        `
        UPDATE leave_requests
        SET Status = 'approved'
        WHERE Id = ?
        `,
        [id]
      );

      await db.execute(
        `
        INSERT INTO notifications
        (
          UserId,
          Title,
          Message,
          Type,
          IsRead
        )
        VALUES
        (
          ?, ?, ?, ?, 0
        )
        `,
        [
          request.UserId,
          "Leave Request Approved",
          `Your leave request from ${request.StartDate} to ${request.EndDate} has been approved.`,
          "leave_request",
        ]
      );

      res.json({
        success: true,
        message:
          "Request approved successfully",
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// =====================================
// Reject Leave Request
// =====================================
exports.rejectLeaveRequest =
  async (req, res) => {
    try {
      const { id } = req.params;

      const [[request]] =
        await db.query(
          `
          SELECT *
          FROM leave_requests
          WHERE Id = ?
          `,
          [id]
        );

      if (!request) {
        return res.status(404).json({
          success: false,
          message:
            "Request not found",
        });
      }

      if (
        request.Status !==
        "pending"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Request already processed",
        });
      }

      await db.execute(
        `
        UPDATE leave_requests
        SET Status = 'rejected'
        WHERE Id = ?
        `,
        [id]
      );

      await db.execute(
        `
        INSERT INTO notifications
        (
          UserId,
          Title,
          Message,
          Type,
          IsRead
        )
        VALUES
        (
          ?, ?, ?, ?, 0
        )
        `,
        [
          request.UserId,
          "Leave Request Rejected",
          `Your leave request from ${request.StartDate} to ${request.EndDate} has been rejected.`,
          "leave_request",
        ]
      );

      res.json({
        success: true,
        message:
          "Request rejected successfully",
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  exports.getPendingLeaveCount = async (req, res) => {
  try {
    const [[result]] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM leave_requests
      WHERE Status = 'pending'
      `
    );

    res.json({
      total: result.total,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};