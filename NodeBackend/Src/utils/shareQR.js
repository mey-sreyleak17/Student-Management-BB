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
