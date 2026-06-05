import React from "react";
import {
  Drawer,
  Tag,
  Button,
  Space,
  Divider,
  Typography,
  Card,
  Row,
  Col,
  Timeline,
} from "antd";

import {
  CheckCircleOutlined,
  CreditCardOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
export default function PaymentDetail({ open, onClose, record }) {
  const statusColor = {
    Paid: "green",
    Pending: "orange",
    Failed: "red",
  };

  return (
    <Drawer
      title=" Payment Receipt"
      width={430}
      onClose={onClose}
      open={open}
    >
      {/* PAYMENT STATUS */}
      <Card
        style={{
          borderRadius: 16,
          marginBottom: 20,
          background: "#f6ffed",
          border: "1px solid #b7eb8f",
        }}
      >
        <Space align="start">
          <CheckCircleOutlined
            style={{
              color: "#52c41a",
              fontSize: 28,
              marginTop: 5,
            }}
          />

          <div>
            <Title
              level={5}
              style={{
                margin: 0,
                color: "#389e0d",
              }}
            >
              Payment Successfully Received
            </Title>

            <Text type="secondary">
              Transaction completed successfully
            </Text>
          </div>
        </Space>
      </Card>
      {/* PAYMENT INFO */}
      <Divider orientation="left">
         Payment Information
      </Divider>

      <Card
        bordered={false}
        style={{
          borderRadius: 14,
          marginBottom: 16,
          background: "#fafafa",
        }}
      >
        <Space
          direction="vertical"
          style={{ width: "100%" }}
          size="middle"
        >
          <Row justify="space-between">
            <Text type="secondary">
              Amount
            </Text>

            <Text
              strong
              style={{
                color: "#1677ff",
                fontSize: 18,
              }}
            >
              ${record?.amount}
            </Text>
          </Row>

          <Row justify="space-between">
            <Text type="secondary">
              AccountName
            </Text>

            <Text strong>
              {record?.method}
            </Text>
          </Row>
        </Space>
      </Card>

      {/* TRANSACTION */}
      <Divider orientation="left">
         Transaction Information
      </Divider>

      <Card
        bordered={false}
        style={{
          borderRadius: 14,
          marginBottom: 16,
          background: "#fafafa",
        }}
      >
        <Space
          direction="vertical"
          style={{ width: "100%" }}
          size="middle"
        >
          <Row justify="space-between">
            <Text type="secondary">
              Transaction ID
            </Text>

            <Text strong>
              TXN-{record?.key}
            </Text>
          </Row>

          <Row justify="space-between">
            <Text type="secondary">
              Bank
            </Text>

            <Text strong>
              ABA Bank
            </Text>
          </Row>

          <Row justify="space-between">
            <Text type="secondary">
              Payment Type
            </Text>

            <Text strong>
              KHQR
            </Text>
          </Row>

          <Row justify="space-between">
            <Text type="secondary">
              Date
            </Text>

            <Space>
              <CalendarOutlined />

              <Text strong>
                {record?.date}
              </Text>
            </Space>
          </Row>
          <Row justify="space-between">
            <Text type="secondary">
              STAND
            </Text>
            <Space>
              <Text strong>
                {record?.stand}
              </Text>
            </Space>
          </Row>
        </Space>
      </Card>

      {/* TIMELINE */}
      <Divider orientation="left">
        Payment Timeline
      </Divider>

      <Timeline
        items={[
          {
            color: "blue",
            children:
              "Payment request created",
          },
          {
            color: "green",
            children:
              "Payment successfully completed",
          },
        ]}
      />

      {/* ACTION BUTTONS */}
      <Divider />

      <Space
        direction="vertical"
        style={{ width: "100%" }}
      >
        <Button
          type="primary"
          size="large"
          block
        >
          Close
        </Button>

        {/* <Button
          danger
          size="large"
          block
        >
          Refund Payment
        </Button> */}
      </Space>
    </Drawer>
  );
}
