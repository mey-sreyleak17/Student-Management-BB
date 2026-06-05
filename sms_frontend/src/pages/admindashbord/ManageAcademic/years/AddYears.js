import React from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Row,
  Col,
  Typography,
} from "antd";

import {
  CalendarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";

const { Title, Text } = Typography;

const AddYears = ({
  open,
  setOpen,
  form,
  editingYear,
  handleSave,
}) => {
  return (
    <Modal
      open={open}
      footer={null}
      onCancel={() => setOpen(false)}
      centered
      width={500}
      destroyOnClose
    >
      <div style={{ padding: "10px 5px" }}>
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 25,
          }}
        >
          <div
            style={{
              width: 75,
              height: 75,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#1677ff,#69b1ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 15px",
            }}
          >
            <CalendarOutlined
              style={{
                color: "#fff",
                fontSize: 32,
              }}
            />
          </div>

          <Title level={3} style={{ marginBottom: 5 }}>
            {editingYear
              ? "Update Academic Year"
              : "Create Academic Year"}
          </Title>

          <Text type="secondary">
            Fill academic year information
          </Text>
        </div>

        {/* FORM */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          {/* NAME */}
          <Form.Item
            label="Academic Name"
            name="Name"
            rules={[
              {
                required: true,
                message:
                  "Please enter academic year",
              },
            ]}
          >
            <Input
              placeholder="2025-2026"
              size="large"
              style={{
                borderRadius: 12,
                height: 42,
              }}
            />
          </Form.Item>

          {/* START DATE */}
          <Form.Item
            label="Start Date"
            name="StartDate"
            rules={[
              {
                required: true,
                message:
                  "Please select start date",
              },
            ]}
          >
            <DatePicker
              style={{
                width: "100%",
                height: 42,
                borderRadius: 12,
              }}
              size="large"
            />
          </Form.Item>

          {/* END DATE */}
          <Form.Item
            label="End Date"
            name="EndDate"
            rules={[
              {
                required: true,
                message:
                  "Please select end date",
              },
            ]}
          >
            <DatePicker
              style={{
                width: "100%",
                height: 42,
                borderRadius: 12,
              }}
              size="large"
            />
          </Form.Item>

          {/* BUTTONS */}
          <Row gutter={12}>
            <Col span={12}>
              <Button
                block
                size="large"
                onClick={() => setOpen(false)}
                style={{
                  borderRadius: 12,
                  height: 42,
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
            </Col>

            <Col span={12}>
              <Button
                htmlType="submit"
                type="primary"
                block
                size="large"
                icon={<CheckCircleOutlined />}
                style={{
                  borderRadius: 12,
                  height: 42,
                  fontWeight: 500,
                }}
              >
                {editingYear
                  ? "Update"
                  : "Create"}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default AddYears;