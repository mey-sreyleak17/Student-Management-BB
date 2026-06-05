const axios =require("axios");
 const TOKEN_stu=process.env.TELEGRAM_TOKEN;
 const CHAT_ID =process.env.TELEGRAM_CHAT_ID;
 const token_teacher = process.env.TELEGRAM_TEACHER_TOKEN;
 const Payment_Token=process.env.TELEGRAM_PAYMENT_TOKEN;

require("dotenv").config();


  const stuTelegramMessage=async (message)=>{
          try {
               await axios.post(`https://api.telegram.org/bot${TOKEN_stu}/sendMessage`,
                    {
                         chat_id:CHAT_ID,
                         text:message,
                         parse_mode:"HTML"
                    });
          } catch (error) {
          console.error("Telegram Error :",error.message);
          }

  };

const TeachersendAttendance = async (message) => {
  try {

    const url = `https://api.telegram.org/bot${token_teacher}/sendMessage`;

    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode:"HTML"
    });

  } catch (error) {
    console.log("Telegram Error:", error.message);
  }
};

const SendPaymentMessage= async (message) => {
  try {

    const url = `https://api.telegram.org/bot${Payment_Token}/sendMessage`;

    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode:"HTML"
    });

  } catch (error) {
    console.log("Telegram Error:", error.message);
  }
};


module. exports={
     TeachersendAttendance,
     stuTelegramMessage,
     SendPaymentMessage
}