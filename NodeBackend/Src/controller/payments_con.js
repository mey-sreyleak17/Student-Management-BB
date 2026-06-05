const axios = require("axios");
const QRCode = require("qrcode");
const crypto = require("crypto");
const moment =require("moment");
const {SendPaymentMessage}=require("../utils/telegrams");
const baseUrl =
process.env.BAKONG_BASE_URL;
const db = require("../config/db");
const {
  saveActivityLog
} = require("../config/activityLogger");
const bakongKHQR =
require("bakong-khqr");
const { logerror } = require("../config/helper");

exports.createKHQR = async (req, res) => {
  try {

    const {
      StudentId,
      PaymentType,
      Months
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!StudentId) {

      return res.status(400).json({
        success: false,
        message: "StudentId required"
      });

    }

    // =========================
    // GET STUDENT + FEE
    // =========================

    const [studentRows] =
    await db.query(

      `
      SELECT

        s.Id,
        s.Name,

        f.Id AS FeeId,
        f.FeeName,
        f.Amount

      FROM students s

      INNER JOIN fee f
        ON f.Id = s.CurrentFeeId

      WHERE s.Id = ?

      LIMIT 1
      `,

      [StudentId]

    );

    if (studentRows.length === 0) {

      return res.status(404).json({

        success: false,

        message:
          "Student fee not found"

      });

    }

    const student =
      studentRows[0];

    const FeeId =
      student.FeeId;

    const amount =
      Number(student.Amount);

    // =========================
    // IDS
    // =========================

    const transactionId =
      `TXN-${Date.now()}`;

    const invoiceNumber =
      `INV-${Date.now()}`;

    // =========================
    // EXPIRE TIME
    // =========================

    const expireAt =
      new Date();

    expireAt.setMinutes(
      expireAt.getMinutes() + 5
    );

    // =========================
    // BAKONG PAYLOAD
    // =========================
    
    const payload = {

      account_id:
        process.env.BAKONG_ACCOUNT_ID,

      merchant_name:
        process.env.MERCHANT_NAME,

      merchant_city:
        process.env.MERCHANT_CITY,

      amount,

      currency:  "KHR",

      store_label:
        "Bright Brain School",

      bill_number:
        invoiceNumber,

      terminal_label:
        PaymentType || student.FeeName,

      static: false,

      expiration: 1

    };

    console.log(
      "BAKONG PAYLOAD:",
      JSON.stringify(
        payload,
        null,
        2
      )
    );

    // =========================
    // GENERATE KHQR
    // =========================

    const khqrResult =
    await axios.post(

      "https://api.bakongrelay.com/v1/generate_qr",

      payload,

      {
        headers: {

          Authorization:
            `Bearer ${process.env.BAKONG_RELAY_TOKEN}`,

          "Content-Type":
            "application/json"

        }
      }

    );

    console.log(
      "BAKONG RELAY RESPONSE:",
      JSON.stringify(
        khqrResult.data,
        null,
        2
      )
    );

    // =========================
    // CHECK RESPONSE
    // =========================

    if (
      khqrResult.data.responseCode !== 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          khqrResult.data.responseMessage

      });

    }

    // =========================
    // QR + MD5
    // =========================

    const khqrString =
      khqrResult.data.data.qr;

    const md5 =
      khqrResult.data.data.md5;

    // =========================
    // QR IMAGE
    // =========================

    // =========================
// GENERATE KHQR IMAGE
// =========================

const imageResult =
await axios.post(

  "https://api.bakongrelay.com/v1/generate_khqr_image",

  {
    qr: khqrString
  },

  {
    headers: {

      Authorization:
        `Bearer ${process.env.BAKONG_RELAY_TOKEN}`,

      "Content-Type":
        "application/json"

    }
  }

);
console.log(
  JSON.stringify(
    imageResult.data,
    null,
    2
  )
);

if (
  imageResult.data.responseCode !== 0
) {

  return res.status(400).json({

    success: false,

    message:
      imageResult.data.responseMessage

  });

}

const qrImage =
  imageResult.data.data.image;

    // =========================
    // SAVE PAYMENT
    // =========================

    const [result] =
    await db.query(

      `
      INSERT INTO payments
      (
        StudentId,
        FeeId,
        Amount,
        Currency,
        PaymentMethod,
        Status,
        TransactionId,
        Md5,
        PaymentDate,
        ExpireAt,
        QrData,
        PaymentType,
        Months
      )
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,

      [

        StudentId,

        FeeId,

        amount,

        "USD",

        "bakong",

        "pending",

        transactionId,

        md5,

        new Date(),

        expireAt,

        khqrString,

        PaymentType ||
        student.FeeName,

        Months

      ]

    );

    // =========================
    // SUCCESS
    // =========================

    return res.json({

      success: true,

      message:
        "KHQR Generated Successfully",

      paymentId:
        result.insertId,

      transactionId,

      md5,

      amount,

      expireAt,

      qrImage,

      qrString:
        khqrString

    });

  } catch (error) {

    console.log(

      "CREATE KHQR ERROR:",

      error.response?.data ||

      error.message

    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to create KHQR"

    });

  }
};

exports. getStudentPaymentInfo = async (req, res) => {

  try {

    const { studentId } = req.params;

    const sql = `
      SELECT 
        s.Id,
        s.StudentCode,
        s.Name,
        s.KhmerName,
        s.ProgramType,
        s.CurrentFeeId,

        c.ClassName,

        f.Id as FeeId,
        f.FeeName,
        f.DurationType,
        f.Amount

      FROM students s

      LEFT JOIN classes c
      ON s.ClassId = c.Id

      LEFT JOIN fee f
      ON s.CurrentFeeId = f.Id

      WHERE s.Id = ?
    `;

    const [rows] = await db.query(sql, [studentId]);

    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Student not found"
      });

    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

exports.checkPaymentStatus =
async (req, res) => {

  try {

    const { transactionId } =
      req.params;

    if (!transactionId) {

      return res.status(400).json({

        success: false,

        message:
          "Transaction ID required"

      });

    }

    // ==========================
    // FIND PAYMENT
    // ==========================

    const [rows] =
      await db.query(

        `
        SELECT *
        FROM payments
        WHERE TransactionId = ?
        LIMIT 1
        `,

        [transactionId]

      );

    if (
      rows.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Payment not found"

      });

    }

    const payment =
      rows[0];

    // ==========================
    // EXPIRED
    // ==========================

    if (

      payment.ExpireAt &&

      new Date() >
      new Date(
        payment.ExpireAt
      )

    ) {

      return res.json({

        success: true,

        status: "expired"

      });

    }

    // ==========================
    // ALREADY PAID
    // ==========================

    if (
      payment.Status === "paid"
    ) {

      return res.json({

        success: true,

        status: "paid",

        payment

      });

    }

    // ==========================
    // CHECK BAKONG
    // ==========================

    const response =
      await axios.post(

        "https://api.bakongrelay.com/v1/check_transaction_by_md5",

        {
          md5:
            payment.Md5
        },

        {
          headers: {

            Authorization:
              `Bearer ${process.env.BAKONG_RELAY_TOKEN}`,

            "Content-Type":
              "application/json"

          }
        }

      );

    console.log(
      "BAKONG RESPONSE:",
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    // ==========================
    // PAYMENT SUCCESS
    // ==========================

    if (

      response.data?.responseCode === 0 &&

      response.data?.data

    ) {

      const bakongData =
        response.data.data;

      const transactionHash =
        bakongData.hash;

      // ==========================
      // UPDATE PAYMENT
      // ==========================

      await db.query(

        `
        UPDATE payments
        SET

          Status = 'paid',

          ProviderTransactionId = ?,

          PaymentDate = NOW(),

          UpdatedAt = NOW()

        WHERE Id = ?
        `,

        [

          transactionHash,

          payment.Id

        ]

      );

      // ==========================
      // GET STUDENT INFO
      // ==========================

      const [studentRows] =
        await db.query(

          `
          SELECT

            s.Id,
            s.Name,

            c.ClassName

          FROM students s

          LEFT JOIN classes c
            ON c.Id = s.ClassId

          WHERE s.Id = ?

          LIMIT 1
          `,

          [payment.StudentId]

        );

      const student =
        studentRows[0];

      // ==========================
      // ACTIVITY LOG
      // ==========================

      try {

        await saveActivityLog(

          payment.StudentId,

          `Student payment successful: ${payment.TransactionId}`,

          "Success"

        );

      } catch (logErr) {

        console.log(
          "LOG ERROR:",
          logErr.message
        );

      }

      // ==========================
      // TELEGRAM
      // ==========================

      try {

        if (
          payment.TelegramSent !== 1
        ) {

          await SendPaymentMessage(

`💵 PAYMENT RECEIVED

👨‍🎓 Student:
${student?.Name || "Unknown"}

🏫 Class:
${student?.ClassName || "Unknown"}

📚 Fee:
${payment.PaymentType}

📅 Month:
${payment.Months}

💰 Amount:
${payment.Amount} ${payment.Currency}

🧾 Transaction:
${payment.TransactionId}
Datetime : ${payment.PaymentDate}
✅ Status:
PAID`

          );

          await db.query(

            `
            UPDATE payments
            SET TelegramSent = 1
            WHERE Id = ?
            `,

            [payment.Id]

          );

        }

      } catch (telegramErr) {

        console.log(

          "TELEGRAM ERROR:",

          telegramErr.message

        );

      }

      // ==========================
      // GET UPDATED PAYMENT
      // ==========================

      const [updated] =
        await db.query(

          `
          SELECT *
          FROM payments
          WHERE Id = ?
          LIMIT 1
          `,

          [payment.Id]

        );

      return res.json({

        success: true,

        status: "paid",

        payment:
          updated[0],

        bakongData

      });

    }

    // ==========================
    // PENDING
    // ==========================

    return res.json({

      success: true,

      status: "pending"

    });

  } catch (error) {

    console.log(

      "CHECK PAYMENT ERROR:",

      error.response?.data ||

      error.message

    );

    return res.status(500).json({

      success: false,

      message:
        "Payment check failed"

    });

  }

};