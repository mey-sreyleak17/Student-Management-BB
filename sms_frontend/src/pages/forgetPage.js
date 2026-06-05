//import React from 'react';
import { Button, Form, Input, message } from 'antd';
import {useNavigate } from "react-router-dom";
import '../styles/forget.css';
import bb from '../assets/bb.jpg';
import api from "../Api/indext";
const Forget = () => {
const navigate = useNavigate();
// Call api

const getForget = async (values) => {

  try {

    const res = await api.post(
      "/auth/forgot-password",
      {
        Email: values.email,
      }
    );

    // save reset token
    localStorage.setItem(
      "resetToken",
      res.data.resetToken
    );

    message.success(
      "OTP sent successfully! Please check your email."
    );

    navigate("/verify");

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message ||
      "Send failed"
    );
  }
};
return(
  <div className='forget'>
      <div className='wel'>
        <div className='img-in'>
            <img src={bb} alt="" /></div>
        <h1>Forget Password</h1>
        <p>Enter your email to reset it!</p>
        <Form
          name="forget"
          initialValues={{ remember: true }}
          // style={{ maxWidth: 300,margin:"0 auto"}}
          onFinish={getForget}
          autoComplete="off"
        >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email address!' }]}
        >
          <Input placeholder="Email Address" />
        </Form.Item>
        
        <Form.Item>
           <Button block type="primary" htmlType="submit">
                Send OTP
            </Button>
          </Form.Item>
        </Form>

      </div>
    </div>
);
};
export default Forget;
