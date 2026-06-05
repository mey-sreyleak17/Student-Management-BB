import { Button, Form, Input, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { Link ,useNavigate} from "react-router-dom";
import "../styles/forget.css";
import bb from '../assets/bb.jpg'
import api from "../Api/indext";
const ResetNew = () => {
const navigate = useNavigate();

  const reset = async (values) => {

  try {

    const res = await api.post(
      "/auth/reset-password",
      {
        newPassword:values.newPassword,
        confirmPassword:values.confirmPassword
      },
      {
        //chat token store
        headers: {
          Authorization: `Bearer ${localStorage.getItem("RESET_TOKEN")}`
        }
      }

    );


    // save token if backend returns it
    if (res.data.accessToken) {
      localStorage.setItem("token", res.data.accessToken);
    }

    // show success message
    message.success("Reset Password Successfully");

    // redirect to verify OTP page
    navigate("/login");

  } catch (error) {
    console.log("Error:", error.response?.data);
    alert(error.response?.data?.message || "send failed");
  }
};
//
  return (
    <div className="reset-container">

      <div className="reset-card">

        <div className="img-info1">
          <img src={bb} alt="reset" />
        </div>

        <h1>Set New Password</h1>

        <p>
          Your new password should be different <br />
          from the previously used password
        </p>

        <Form
          name="reset"
          layout="vertical"
          style={{ maxWidth: 320, margin: "0 auto" }}
          onFinish={reset}
        >
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Please enter new password!" }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Passwords do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm New Password"
            />
          </Form.Item>


          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Reset Password
            </Button>
            <div className="back-link">
              Back to <Link to="/login">Log in</Link>
            </div>
          </Form.Item>

        </Form>

      </div>

    </div>
  );
};

export default ResetNew;
