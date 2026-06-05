import React, { useState ,useEffect} from "react";
import { Button, Form, Input, message, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "../styles/forget.css";
import fg from "../assets/forget.png";
import api from "../Api/indext";
import axios from "axios";
const { Title, Text } = Typography;

const Verify = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 // 5 minutes = 300 seconds
  const [timeLeft, setTimeLeft] = useState(300);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  useEffect(() => {

    if (timeLeft <= 0) return;

    const timer = setInterval(() => {

      setTimeLeft((prev) => prev - 1);

    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft]);

  // format mm:ss
  const minutes = Math.floor(timeLeft / 60);

  const seconds = timeLeft % 60;
  const handleResendOtp = async () => {

  try {

    const email = localStorage.getItem(
      "resetEmail"
    );

    if (!email) {

      return message.error(
        "Email not found"
      );

    }

    await api.post(
      "/auth/forgot-password",
      {
        Email: email
      }
    );

    message.success(
      "OTP resent successfully"
    );

    setTimeLeft(300);

  } catch (error) {

    message.error(
      error.response?.data?.message ||
      "Failed to resend OTP"
    );

  }

};
 const onFinish = async (values) => {

  setLoading(true);

  try {

    const token = localStorage.getItem("resetToken");

    console.log("OTP:", values.otp);

    const res = await axios.post(
      "http://localhost:8001/api/auth/verify-otp",
      {
        otp: values.otp
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    message.success(res.data.message);

    navigate("/resetNew");

  } catch (error) {

    console.log(error);

    message.error(
      error.response?.data?.message ||
      "Server error"
    );

  } finally {

    setLoading(false);

  }
};
  return (
    <div className="verify-container">
      <div className="verify-card" style={{ textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
        <div className="img-info">
          <img src={fg} alt="verify" style={{ width: '100px', marginBottom: '20px' }} />
        </div>

        <Title level={2}>OTP Verification</Title>
        <Text type="secondary">
          Enter code sent to ******@gmail.com
        </Text>

        <Form 
          name="verify" 
          onFinish={onFinish} 
          style={{ marginTop: '30px' }}
        >
          <Form.Item
            name="otp"
            rules={[{ required: true, message: "Please enter OTP!" }]}
          >
            {/* Ant Design OTP Component */}
            <Input.OTP 
              length={6} 
              size="large" 
              variant="outlined" 
              style={{ display: 'flex', justifyContent: 'center' }}
            />
          </Form.Item>

         <div style={{ marginBottom: "20px" }}>

  <Text type="secondary">
    Didn't receive code?
  </Text>

  <br />

  <Button
    type="link"
    style={{ padding: 0 }}
    disabled={timeLeft > 0}
    onClick={handleResendOtp}
  >
    {
      timeLeft > 0
        ? `Resend in ${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`
        : "Resend OTP"
    }
  </Button>

  {
    timeLeft <= 0 && (
      <div style={{ color: "red", marginTop: "5px" }}>
        OTP Expired
      </div>
    )
  }

</div>

<Form.Item>
            <Button 
              block 
              type="primary" 
              htmlType="submit" 
              size="large"
              loading={loading}
              style={{ borderRadius: '8px', height: '45px' }}
            >
              Verify & Proceed
            </Button>
          </Form.Item>
          <div className="back-link">
             Back to <Link to="/login">Login Page</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Verify;