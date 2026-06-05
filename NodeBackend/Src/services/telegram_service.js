const axios = require("axios");
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_TEACHER_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

exports.sendCheckInAlert = async (message) => {
    //const message = `Student: ${student}\nAmount: $${amount}\nStatus: Paid\nTime: ${new Date().toLocaleString()}`;
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message
    });
};