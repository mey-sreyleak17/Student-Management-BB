const fee_con =
require("../controller/fee_con");

const staffOnly =
require("../middlewares/staffOnly");

const auth =
require("../middlewares/auth");

const Fee = (app) => {

  // GET ALL FEES
  app.get(
    "/api/fee/getlist",
    auth,
    staffOnly,
    fee_con.getlist
  );

  // SUMMARY
  app.get(
    "/api/fee/summary-fee",
    auth,
    staffOnly,
    fee_con.getPaymentSummary
  );

  // CREATE
  app.post(
    "/api/fee/create",
    auth,
    staffOnly,
    fee_con.createfee
  );

  // UPDATE
  app.put(
    "/api/fee/:Id",
    auth,
    staffOnly,
    fee_con.updateFee
  );

  // DELETE
  app.delete(
    "/api/fee/:Id",
    auth,
    staffOnly,
    fee_con.deleteFee
  );
};

module.exports =Fee ;