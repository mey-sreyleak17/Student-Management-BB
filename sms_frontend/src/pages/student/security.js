import React from "react";
import { Card, Typography, Form, Input, Button, Row, Col, Space, Switch, Divider, message,
} from "antd";
const { Title, Text } = Typography;
const SecuritySettings = () => {
  const [form] = Form.useForm();
  return (
    <div
      style={{
        padding: 0,
      }}
    >
        <Title level={2} style={{   marginBottom: 0,   }}>
            Change Password
        </Title>

        <Text type="secondary">change your password account and 
        </Text>
      <Card
        bordered={false}
        style={{
          borderRadius: 14,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{   marginBottom: 40, }}>
          
          <Form
            form={form}
            layout="vertical"
            // onFinish={onFinish}
          >
            <Row gutter={20}>
              {/* OLD PASSWORD */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Old Password"
                  name="oldPassword"
                >
                  <Input.Password
                    size="large"
                    placeholder="********"
                    style={{
                      borderRadius: 10,
                      height: 46,
                    }}
                  />
                </Form.Item>
              </Col>

              {/* NEW PASSWORD */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="New Password"
                  name="newPassword"
                >
                  <Input.Password
                    size="large"
                    placeholder="********"
                    style={{
                      borderRadius: 10,
                      height: 46,
                    }}
                  />
                </Form.Item>
              </Col>

              {/* CONFIRM PASSWORD */}
              <Col span={24}>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                >
                  <Input.Password
                    size="large"
                    placeholder="********"
                    style={{
                      borderRadius: 10,
                      height: 46,
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* BUTTONS */}
            <Space size={14}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  borderRadius: 10,
                  paddingInline: 24,
                }}
              >
                Save Change
              </Button>

              <Button
                danger
                size="large"
                style={{
                  borderRadius: 10,
                  paddingInline: 24,
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form>
        </div>

        <Divider />

        {/* TWO FACTOR */}
        <div>
          <Title
            level={3}
            style={{
              marginBottom: 28,
            }}
          >
            Two-Factor Authentication
          </Title>

          {/* ITEM */}
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 26,
            }}
          >
            <div>
              <Text
                strong
                style={{
                  fontSize: 15,
                }}
              >
                Primary E-mail
              </Text>

              <br />

              <Text type="secondary">
                E-mail used to send
                notifications
              </Text>
            </div>

            <Switch defaultChecked />
          </div>

          {/* ITEM */}
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 26,
            }}
          >
            <div>
              <Text
                strong
                style={{
                  fontSize: 15,
                }}
              >
                SMS Recovery
              </Text>

              <br />

              <Text type="secondary">
                Your phone number or
                something
              </Text>
            </div>

            <Switch />
          </div>

          {/* ITEM */}
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Text
                strong
                style={{
                  fontSize: 15,
                }}
              >
                SMS Recovery
              </Text>

              <br />

              <Text type="secondary">
                Your phone number or
                something
              </Text>
            </div>

            <Switch />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SecuritySettings;