const payment_con =require("../controller/payments_con");

const auth =require("../middlewares/auth");

const role =require("../middlewares/roles");
const {
  createUpload
} = require(
  "../config/cloudinary"
);

const payment_upload =
  createUpload(
    "payment_images"
  );
const payment = (app) => {


  app.get("/api/payment/student/:id",payment_con.getStudentPaymentInfo);
  app.get("/api/payment/check/:transactionId",auth,payment_con.checkPaymentStatus);
  // =========================
  // CREATE KHQR
  // =========================

  app.post(
    "/api/payment/create-khqr",
    auth,
    role(
      "student",
      "admin",
      "staff"
    ),
    payment_con.createKHQR
  );
  
};

module.exports = payment;