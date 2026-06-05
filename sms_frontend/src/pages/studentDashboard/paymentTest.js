import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Modal,
  Avatar,
  Divider,
  Tag,
} from "antd";
import {
  UserOutlined,
  DollarOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import QRCode from "react-qr-code";

const { Title, Text } = Typography;

export default function StudentPaymentPage() {
  const [openQR, setOpenQR] = useState(false);

  const student = {
    id: "STU001",
    name: "John Doe",
    className: "Grade 12 A",
    paymentFor: "Monthly Fee",
    amount: 120,
  };

  const qrData = JSON.stringify(student);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#1677ff,#69b1ff)",
        padding: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        bordered={false}
        style={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Header */}
        <div
          style={{
            background: "#1677ff",
            padding: 30,
            color: "#fff",
            textAlign: "center",
          }}
        >
          <Avatar
            size={90}
            icon={<UserOutlined />}
            style={{
              background: "#fff",
              color: "#1677ff",
              marginBottom: 15,
            }}
          />

          <Title level={3} style={{ color: "#fff", marginBottom: 5 }}>
            {student.name}
          </Title>

          <Text style={{ color: "#dbeafe" }}>
            Student ID : {student.id}
          </Text>
        </div>

        {/* Body */}
        <div style={{ padding: 30 }}>
          <Row gutter={[16, 20]}>
            <Col span={12}>
              <Card
                size="small"
                style={infoCard}
              >
                <Text type="secondary">Class</Text>
                <br />
                <Text strong>{student.className}</Text>
              </Card>
            </Col>

            <Col span={12}>
              <Card
                size="small"
                style={infoCard}
              >
                <Text type="secondary">Payment</Text>
                <br />
                <Text strong>{student.paymentFor}</Text>
              </Card>
            </Col>
          </Row>

          <Divider />

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">Total Amount</Text>

            <Title
              level={1}
              style={{
                margin: "10px 0",
                color: "#1677ff",
              }}
            >
              ${student.amount}
            </Title>

            <Tag
              color="green"
              style={{
                padding: "6px 16px",
                borderRadius: 30,
                fontSize: 14,
              }}
            >
              Pending Payment
            </Tag>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<CreditCardOutlined />}
            block
            onClick={() => setOpenQR(true)}
            style={{
              marginTop: 30,
              height: 55,
              borderRadius: 16,
              fontSize: 18,
              fontWeight: "bold",
              background: "#1677ff",
            }}
          >
            Pay Now
          </Button>
        </div>
      </Card>

      {/* QR Modal */}
      <Modal
        open={openQR}
        footer={null}
        centered
        onCancel={() => setOpenQR(false)}
        width={450}
      >
        <div
          style={{
            textAlign: "center",
            paddingTop: 10,
          }}
        >
          <Avatar
            size={70}
            icon={<DollarOutlined />}
            style={{
              background: "#1677ff",
              marginBottom: 5,
            }}
          />

          <Title level={3}>Scan QR to Pay</Title>

          <Text type="secondary">
            Use Mobile Banking App
          </Text>

          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 20,
              marginTop: 10,
              display: "inline-block",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <QRCode
              value={qrData}
              size={220}
            />
          </div>

          <div style={{ marginTop: 25 }}>
            <Text>Total Payment</Text>

            <Title
              level={2}
              style={{
                color: "#1677ff",
                marginTop: 5,
              }}
            >
              ${student.amount}
            </Title>
          </div>

          <Button
            danger
            size="large"
            block
            onClick={() => setOpenQR(false)}
            style={{
              marginTop: 5,
              height: 48,
              borderRadius: 14,
              fontWeight: "bold",
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}

const infoCard = {
  borderRadius: 16,
  background: "#f5f7ff",
  border: "none",
  textAlign: "center",
};