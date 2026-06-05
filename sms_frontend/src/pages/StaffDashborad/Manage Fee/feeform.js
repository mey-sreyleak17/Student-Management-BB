import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Select,
  Row,
  Col,
  Button,
  message,
  Input,
  Typography,
  Card,
  Divider,
  Tag,
} from "antd";

import {
  BookOutlined,
  DollarOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import api from "../../../Api/indext";

const { Title, Text } = Typography;

const FeeForm = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  mode,
}) => {

  const [form] = Form.useForm();

  const [ClassName, SetClassName] =
    useState([]);

  const fetchClassesName = async () => {

    try {

      const token =
        localStorage.getItem(
          "accessToken"
        );

      const res = await api.get(
        "/classes/select",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      SetClassName(res.data);

    } catch (error) {

      console.error(error);

      message.error(
        "Failed to load class name"
      );
    }
  };

  useEffect(() => {
    fetchClassesName();
  }, []);

  useEffect(() => {

    if (open) {

      if (mode === "add") {

        form.resetFields();

      } else if (initialValues) {

        form.setFieldsValue({
          ...initialValues,
        });

      }

    }

  }, [
    open,
    mode,
    initialValues,
    form,
  ]);

  const handleFinish = (values) => {

    const formData = {
      ...values,
    };

    onSubmit(formData);
  };

  return (

    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1000}
      centered
      destroyOnHidden
      closable={false}
      bodyStyle={{
        padding: 0,
        overflow: "hidden",
        borderRadius: 24,
      }}
    >

      {/* TOP HEADER */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#1677ff,#4096ff,#69b1ff)",
          padding: "35px 40px",
          position: "relative",
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >

          <div>

            <Tag
              color="white"
              style={{
                color: "#1677ff",
                fontWeight: 600,
                padding:
                  "6px 14px",
                borderRadius: 20,
                marginBottom: 15,
              }}
            >
              BRIGHT BRAIN SCHOOL
            </Tag>

            <Title
              level={2}
              style={{
                color: "white",
                margin: 0,
              }}
            >
              {mode === "update"
                ? "Update School Fee"
                : mode === "view"
                ? "Fee Information"
                : "Create School Fee"}
            </Title>

            <Text
              style={{
                color:
                  "rgba(255,255,255,0.9)",
                fontSize: 15,
              }}
            >
              Manage academic fee structure
              for students
            </Text>

          </div>

          <div>

            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,0.2)",
                display: "flex",
                justifyContent:
                  "center",
                alignItems: "center",
                backdropFilter:
                  "blur(8px)",
              }}
            >

              <DollarOutlined
                style={{
                  fontSize: 42,
                  color: "white",
                }}
              />

            </div>

          </div>

        </div>

      </div>

      {/* BODY */}

      <div
        style={{
          background: "#f4f7fc",
          padding: 35,
        }}
      >

        <Card
          bordered={false}
          style={{
            borderRadius: 22,
            boxShadow:
              "0 10px 35px rgba(0,0,0,0.08)",
          }}
        >

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
          >

            {/* SECTION */}

            <Divider
              orientation="left"
              style={{
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Fee Information
            </Divider>

            <Row gutter={[24, 5]}>

              {/* CLASS */}

              <Col xs={24} md={12}>

                <Form.Item
                  label="Class Name"
                  name="ClassId"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please select class",
                    },
                  ]}
                >

                  <Select
                    size="large"
                    placeholder="Select Class"
                    disabled={
                      mode === "view"
                    }
                    suffixIcon={
                      <BookOutlined />
                    }
                    style={{
                      height: 50,
                    }}
                  >

                    {ClassName.map(
                      (item) => (
                        <Select.Option
                          key={item.Id}
                          value={item.Id}
                        >
                          {
                            item.ClassName
                          }
                        </Select.Option>
                      )
                    )}

                  </Select>

                </Form.Item>

              </Col>

              {/* FEE NAME */}

              <Col xs={24} md={12}>

                <Form.Item
                  label="Fee Name"
                  name="FeeName"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >

                  <Input
                    size="large"
                    placeholder="Tuition Fee"
                    prefix={
                      <FileTextOutlined />
                    }
                    disabled={
                      mode === "view"
                    }
                    style={{
                      height: 50,
                      borderRadius: 12,
                    }}
                  />

                </Form.Item>

              </Col>

              {/* PROGRAM TYPE */}

              <Col xs={24} md={12}>

                <Form.Item
                  label="Program Type"
                  name="ProgramType"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >

                  <Select
                    size="large"
                    placeholder="Select Program"
                    suffixIcon={
                      <AppstoreOutlined />
                    }
                    disabled={
                      mode === "view"
                    }
                    style={{
                      height: 50,
                    }}
                  >

                    <Select.Option value="Full Time">
                     English Full Time
                    </Select.Option>

                    <Select.Option value="Part Time">
                     English Part Time
                    </Select.Option>
                     <Select.Option value="Part Time">
                     Khmer Full Time
                    </Select.Option>

                  </Select>

                </Form.Item>

              </Col>

              {/* DURATION */}

              <Col xs={24} md={12}>

                <Form.Item
                  label="Duration"
                  name="DurationType"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >

                  <Select
                    size="large"
                    placeholder="Select Duration"
                    suffixIcon={
                      <CalendarOutlined />
                    }
                    disabled={
                      mode === "view"
                    }
                    style={{
                      height: 50,
                    }}
                  >

                    <Select.Option value="Month">
                      1 Month
                    </Select.Option>

                    <Select.Option value="Quarter">
                      1 Quarter
                    </Select.Option>

                    <Select.Option value="Semester">
                      1 Semester
                    </Select.Option>

                    <Select.Option value="Year">
                      1 Year
                    </Select.Option>

                  </Select>

                </Form.Item>

              </Col>

              {/* AMOUNT */}

              <Col xs={24} md={12}>

                <Form.Item
                  label="Amount"
                  name="Amount"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >

                  <Input
                    size="large"
                    placeholder="$0.00"
                    prefix={
                      <DollarOutlined />
                    }
                    disabled={
                      mode === "view"
                    }
                    style={{
                      height: 50,
                      borderRadius: 12,
                    }}
                  />

                </Form.Item>

              </Col>

              {/* DESCRIPTION */}

              <Col xs={24}>

                <Form.Item
                  label="Description"
                  name="Description"
                >

                  <Input.TextArea
                    rows={5}
                    placeholder="Additional fee information..."
                    disabled={
                      mode === "view"
                    }
                    style={{
                      borderRadius: 14,
                    }}
                  />

                </Form.Item>

              </Col>

            </Row>

            {/* BUTTONS */}

            {mode !== "view" && (

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  marginTop: 30,
                  gap: 15,
                }}
              >

                <Button
                  size="large"
                  onClick={onCancel}
                  style={{
                    minWidth: 130,
                    height: 48,
                    borderRadius: 14,
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    minWidth: 180,
                    height: 48,
                    borderRadius: 14,
                    border: "none",
                    fontWeight: 600,
                    background:
                      "linear-gradient(135deg,#1677ff,#4096ff)",
                    boxShadow:
                      "0 8px 20px rgba(22,119,255,0.35)",
                  }}
                >
                  {mode === "update"
                    ? "Update Fee"
                    : "Save Fee"}
                </Button>

              </div>

            )}

          </Form>

        </Card>

      </div>

    </Modal>
  );
};

export default FeeForm;