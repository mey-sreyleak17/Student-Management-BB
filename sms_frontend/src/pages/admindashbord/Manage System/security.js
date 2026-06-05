import React, {
  useState,
} from "react";

import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Row,
  Col,
  Space,
  Switch,
  Divider,
  Progress,
  List,
  Tag,
  message,
} from "antd";

import api from "../../../Api/indext";

import {
  SafetyCertificateOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  LaptopOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const SecuritySettings = () => {

  const [form] = Form.useForm();

  const [loading, setLoading] =
    useState(false);

  // PASSWORD STRENGTH

  const getPasswordStrength = (
    password
  ) => {

    if (!password) {
      return 0;
    }

    let score = 0;

    if (password.length >= 8)
      score += 25;

    if (/[A-Z]/.test(password))
      score += 25;

    if (/[0-9]/.test(password))
      score += 25;

    if (
      /[!@#$%^&*]/.test(password)
    )
      score += 25;

    return score;

  };

  // FORM SUBMIT

  const onFinish = async (
  values
) => {

  try {

    if (
      values.newPassword !==
      values.confirmPassword
    ) {

      return message.error(
        "Passwords do not match"
      );

    }

    setLoading(true);

    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (!token) {

      return message.error(
        "Please login again"
      );

    }

    const res =
      await api.post(
        "/auth/change-password",
        {
          oldPassword:
            values.oldPassword,

          newPassword:
            values.newPassword,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    message.success(
      res.data.message
    );

    form.resetFields();

    localStorage.removeItem(
      "accessToken"
    );

    setTimeout(() => {

      window.location.href =
        "/";

    }, 1500);

  } catch (error) {

    console.log(error);

    message.error(
      error.response?.data
        ?.message ||
        error.message ||
        "Failed to change password"
    );

  } finally {

    setLoading(false);

  }

};

  // WATCH PASSWORD

  const password =
    Form.useWatch(
      "newPassword",
      form
    );

  const strength =
    getPasswordStrength(
      password
    );

  return (

    <div
      style={{
        padding: 24,
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          marginBottom: 24,
        }}
      >

        <Title level={2}>
          Security Settings
        </Title>

        <Text type="secondary">
          Manage your account
          security and
          authentication settings
        </Text>

      </div>

      {/* STATUS CARDS */}

      <Row
        gutter={[16, 16]}
        style={{
          marginBottom: 24,
        }}
      >

        <Col xs={24} md={8}>

          <Card bordered={false}>

            <Space>

              <SafetyCertificateOutlined
                style={{
                  fontSize: 28,
                  color: "#52c41a",
                }}
              />

              <div>

                <Text strong>
                  Password Status
                </Text>

                <br />

                <Tag color="green">
                  Strong
                </Tag>

              </div>

            </Space>

          </Card>

        </Col>

        <Col xs={24} md={8}>

          <Card bordered={false}>

            <Space>

              <MobileOutlined
                style={{
                  fontSize: 28,
                  color: "#1677ff",
                }}
              />

              <div>

                <Text strong>
                  2FA Status
                </Text>

                <br />

                <Tag color="blue">
                  Enabled
                </Tag>

              </div>

            </Space>

          </Card>

        </Col>

        <Col xs={24} md={8}>

          <Card bordered={false}>

            <Space>

              <LaptopOutlined
                style={{
                  fontSize: 28,
                  color: "#fa8c16",
                }}
              />

              <div>

                <Text strong>
                  Last Login
                </Text>

                <br />

                <Text type="secondary">
                  Today 09:45 AM
                </Text>

              </div>

            </Space>

          </Card>

        </Col>

      </Row>

      {/* CHANGE PASSWORD */}

      <Card
        title="Change Password"
        bordered={false}
        style={{
          marginBottom: 24,
          borderRadius: 16,
        }}
      >

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >

          <Row gutter={20}>

            {/* OLD PASSWORD */}

            <Col xs={24} md={12}>

              <Form.Item
                label="Current Password"
                name="oldPassword"
                rules={[
                  {
                    required: true,
                    message:
                      "Please enter current password",
                  },
                ]}
              >

                <Input.Password
                  size="large"
                  prefix={
                    <LockOutlined />
                  }
                />

              </Form.Item>

            </Col>

            {/* NEW PASSWORD */}

            <Col xs={24} md={12}>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message:
                      "Please enter new password",
                  },
                  {
                    min: 8,
                    message:
                      "Minimum 8 characters",
                  },
                ]}
              >

                <Input.Password
                  size="large"
                  prefix={
                    <LockOutlined />
                  }
                />

              </Form.Item>

              {/* PASSWORD STRENGTH */}

              <Progress
                percent={strength}
                size="small"
                status="active"
              />

              <Text type="secondary">

                {strength < 50 &&
                  "Weak password"}

                {strength >= 50 &&
                  strength < 100 &&
                  "Medium password"}

                {strength === 100 &&
                  "Strong password"}

              </Text>

            </Col>

            {/* CONFIRM PASSWORD */}

            <Col span={24}>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={[
                  "newPassword",
                ]}
                rules={[
                  {
                    required: true,
                    message:
                      "Please confirm password",
                  },

                  ({
                    getFieldValue,
                  }) => ({

                    validator(
                      _,
                      value
                    ) {

                      if (
                        !value ||
                        getFieldValue(
                          "newPassword"
                        ) === value
                      ) {

                        return Promise.resolve();

                      }

                      return Promise.reject(
                        new Error(
                          "Passwords do not match"
                        )
                      );

                    },

                  }),
                ]}
              >

                <Input.Password
                  size="large"
                  prefix={
                    <LockOutlined />
                  }
                />

              </Form.Item>

            </Col>

          </Row>

          {/* BUTTONS */}

          <Space>

            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
            >

              Update Password

            </Button>

            <Button
              size="large"
              onClick={() =>
                form.resetFields()
              }
            >

              Cancel

            </Button>

          </Space>

        </Form>

      </Card>

      {/* TWO FACTOR */}

      <Card
        title="Two-Factor Authentication"
        bordered={false}
        style={{
          marginBottom: 24,
          borderRadius: 16,
        }}
      >

        <List
          itemLayout="horizontal"
          dataSource={[
            {
              title:
                "Email Verification",

              description:
                "Receive OTP code via email",

              icon:
                <MailOutlined />,

              enabled: true,
            },

            {
              title:
                "SMS Authentication",

              description:
                "Receive OTP code via SMS",

              icon:
                <MobileOutlined />,

              enabled: false,
            },

            {
              title:
                "Google Authenticator",

              description:
                "Use authenticator app for login",

              icon:
                <SafetyCertificateOutlined />,

              enabled: true,
            },
          ]}

          renderItem={(item) => (

            <List.Item
              actions={[
                <Switch
                  defaultChecked={
                    item.enabled
                  }
                />,
              ]}
            >

              <List.Item.Meta
                avatar={item.icon}
                title={item.title}
                description={
                  item.description
                }
              />

            </List.Item>

          )}
        />

      </Card>

      {/* ACTIVE SESSIONS */}

      <Card
        title="Active Sessions"
        bordered={false}
        style={{
          borderRadius: 16,
        }}
      >

        <List
          itemLayout="horizontal"
          dataSource={[
            {
              device:
                "Chrome on Windows",

              location:
                "Phnom Penh, Cambodia",

              active: true,
            },

            {
              device:
                "Mobile Safari",

              location:
                "Phnom Penh, Cambodia",

              active: false,
            },
          ]}

          renderItem={(item) => (

            <List.Item
              actions={[
                item.active ? (

                  <Tag color="green">
                    Current
                  </Tag>

                ) : (

                  <Button danger>
                    Logout
                  </Button>

                ),
              ]}
            >

              <List.Item.Meta
                avatar={
                  <LaptopOutlined />
                }
                title={item.device}
                description={
                  item.location
                }
              />

            </List.Item>

          )}
        />

      </Card>

    </div>

  );

};

export default SecuritySettings;