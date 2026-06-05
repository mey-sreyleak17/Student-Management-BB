import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Flex, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import bb from "../assets/bb.jpg";
import api from "../Api/indext";
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] =
      useState(false);
//completed
  const Login = async (values) => {
  try {
    const res = await api.post("/auth/login", {
      Email: values.email,
      Password: values.password
    });

    // 1. Store Tokens
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    // 2. Store User Data (MATCHING BACKEND KEYS)
    // Backend sent 'role' (lowercase), 'email' (lowercase), and 'Name' (Uppercase)
    localStorage.setItem("role", res.data.role); 
    localStorage.setItem("userEmail", res.data.email);
    localStorage.setItem("userName", res.data.Name);

    // 3. Extract Role for Navigation
    const role = res.data.role;

    // 4. Redirect Logic
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "teacher") {
      navigate("/teacher");
    } else if (role === "staff") {
      navigate("/staff");
    } else if (role === "student") {
      navigate("/student");
    } else {
      alert("Unknown role: " + role);
    }

    message.success("Login successfully");

  } catch (err) {
    alert(
      "Login failed: " +
      (err.response?.data?.message || err.message)
    );
  }
};
  return (
    <div className='loginform'>
      <div className='panel'>
        <div className='img-in'>
          <img src={bb} alt="" />
        </div>
        <div className='container'>
          <h2>Welcome to! <br />Bright Brain School</h2><hr/>
          <p >you can sign in to access your <br /> existing account</p>
        </div>
      </div>

      <div className='panel1'>
        <div className='wel'>
          <h1>Login Account</h1>

          <Form
            name="login"
            initialValues={{ remember: true }}
            style={{ maxWidth: 360 }}
            onFinish={Login}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter email" />
            </Form.Item>

            <Form.Item
           name="password"
           rules={[{ required: true, message: 'Please input your Password!' }]}
            >
         <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
          />
          </Form.Item>


            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Link to="/forgetpassword">Forgot password</Link>
              </Flex>
            </Form.Item>

            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Log in Account
              </Button>
            </Form.Item>

          </Form>
        </div>
      </div>
    </div>
  );

};

export default Login;