const axios = require("axios");

const createKHQR = async (amount) => {
    const TransactionId = "INV_" + Date.now();
    const response = await axios.post("https://api.ababank.com/khqr/generate", {
        merchantId: "YOUR_MERCHANT_ID",
        amount,
        currency: "USD",
        billNumber
    });
    return { qr: response.data.qr, TransactionId };
};

const verifyKHQR = async (TransactionId) => {
    const response = await axios.post("https://api.ababank.com/khqr/check", {TransactionId});
    return response.data;
};

module.exports={
    verifyKHQR,
    createKHQR
}