import React, {
  useEffect,
} from "react";

import {
  Modal,
  Form,
  Input,
  message,
  Collapse,
  Checkbox,
  Button,
  Select,
  Typography,
  Row,
  Col,
  Card,
  Space,
  Tag,
} from "antd";

import {
  SafetyOutlined,
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
  SolutionOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

const { Panel } = Collapse;
const { TextArea } = Input;
const { Title, Text } =
  Typography;
const { Option } = Select;

// =========================
// ROLE PERMISSIONS
// =========================

const rolePermissions = {
  admin: [
    "Create Users",
    "View Users",
    "Edit Users",
    "Delete Users",
    "Manage Roles",
    "View Reports",
    "Manage Payments",
  ],

  teacher: [
    "View Students",
    "Manage Scores",
    "View Attendance",
    "Create Assignments",
  ],

  student: [
    "View Scores",
    "View Attendance",
    "View Schedule",
  ],

  staff: [
    "View Reports",
    "Manage Payments",
    "Manage Enrollment",
  ],
};

// =========================
// ROLE UI
// =========================

const roleUI = {
  admin: {
    icon: <CrownOutlined />,
    color: "#dc2626",
    bg: "#fef2f2",
  },

  teacher: {
    icon:
      <SolutionOutlined />,
    color: "#2563eb",
    bg: "#eff6ff",
  },

  student: {
    icon:
      <UserOutlined />,
    color: "#16a34a",
    bg: "#f0fdf4",
  },

  staff: {
    icon:
      <TeamOutlined />,
    color: "#9333ea",
    bg: "#faf5ff",
  },
};

export default function AddRole({
  open,
  onOk,
  onCancel,
  initialValues,
  isEdit,
}) {

  const [form] =
    Form.useForm();

  // =========================
  // EDIT MODE
  // =========================

  useEffect(() => {

    if (
      initialValues
    ) {

      form.setFieldsValue({
        role:
          initialValues.role,
        description:
          initialValues.desc,
        permissions:
          initialValues.permissions,
      });

    } else {

      form.resetFields();

    }

  }, [
    initialValues,
    form,
  ]);

  // =========================
  // ROLE CHANGE
  // =========================

  const handleRoleChange =
    (role) => {

      form.setFieldsValue({
        permissions:
          rolePermissions[
            role
          ],
      });

    };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit =
    (values) => {

      message.success(
        isEdit
          ? "Role updated successfully"
          : "Role created successfully"
      );

      onOk(values);

      form.resetFields();

    };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={760}
      centered
      style={{
        top: 20,
      }}
    >

      {/* HEADER */}
      <div
        style={{
          marginBottom: 28,
          padding: 24,
          borderRadius: 24,
          background:
            "linear-gradient(135deg,#7c3aed,#9333ea)",
        }}
      >

        <Space
          align="center"
        >

          <div
            style={{
              width: 62,
              height: 62,
              borderRadius:
                "50%",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              background:
                "rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: 28,
            }}
          >
            <SafetyOutlined />
          </div>

          <div>

            <Title
              level={3}
              style={{
                color: "#fff",
                marginBottom: 2,
              }}
            >
              {
                isEdit
                  ? "Update Role"
                  : "Create New Role"
              }
            </Title>

            <Text
              style={{
                color:
                  "rgba(255,255,255,0.85)",
              }}
            >
              Configure role access and permissions
            </Text>

          </div>

        </Space>

      </div>

      {/* FORM */}
      <Form
        form={form}
        layout="vertical"
        onFinish={
          handleSubmit
        }
      >

        {/* ROLE SELECT */}
        <Form.Item
          label="Select Role"
          name="role"
          rules={[
            {
              required: true,
              message:
                "Please select role",
            },
          ]}
        >

          <Select
            size="large"
            placeholder="Choose role"
            onChange={
              handleRoleChange
            }
          >

            <Option value="admin">
              👑 Administrator
            </Option>

            <Option value="teacher">
              📘 Teacher
            </Option>

            <Option value="student">
              🎓 Student
            </Option>

            <Option value="staff">
              🧾 Staff
            </Option>

          </Select>

        </Form.Item>

        {/* DESCRIPTION */}
        <Form.Item
          label="Description"
          name="description"
        >

          <TextArea
            rows={3}
            placeholder="Enter role description..."
            style={{
              borderRadius: 14,
            }}
          />

        </Form.Item>

        {/* PERMISSIONS */}
        <Form.Item
          label="Permissions"
          name="permissions"
        >

          <Checkbox.Group
            style={{
              width: "100%",
            }}
          >

            <Row
              gutter={[
                18,
                18,
              ]}
            >

              {Object.keys(
                rolePermissions
              ).map(
                (
                  role
                ) => (

                  <Col
                    xs={24}
                    md={12}
                    key={role}
                  >

                    <Card
                      bordered={false}
                      style={{
                        borderRadius: 22,
                        background:
                          roleUI[
                            role
                          ].bg,
                        height:
                          "100%",
                      }}
                    >

                      {/* CARD HEADER */}
                      <Space
                        style={{
                          marginBottom: 16,
                        }}
                      >

                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius:
                              14,
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            background:
                              roleUI[
                                role
                              ]
                                .color,
                            color:
                              "#fff",
                            fontSize: 22,
                          }}
                        >
                          {
                            roleUI[
                              role
                            ]
                              .icon
                          }
                        </div>

                        <div>

                          <Title
                            level={5}
                            style={{
                              marginBottom: 2,
                              textTransform:
                                "capitalize",
                            }}
                          >
                            {role}
                          </Title>

                          <Tag
                            color="blue"
                          >
                            {
                              rolePermissions[
                                role
                              ]
                                .length
                            }{" "}
                            Permissions
                          </Tag>

                        </div>

                      </Space>

                      {/* PERMISSIONS */}
                      <div
                        style={{
                          display:
                            "flex",
                          flexDirection:
                            "column",
                          gap: 10,
                        }}
                      >

                        {rolePermissions[
                          role
                        ].map(
                          (
                            perm
                          ) => (

                            <Checkbox
                              key={
                                perm
                              }
                              value={
                                perm
                              }
                            >

                              <Space>

                                <CheckCircleFilled
                                  style={{
                                    color:
                                      roleUI[
                                        role
                                      ]
                                        .color,
                                  }}
                                />

                                {perm}

                              </Space>

                            </Checkbox>

                          )
                        )}

                      </div>

                    </Card>

                  </Col>

                )
              )}

            </Row>

          </Checkbox.Group>

        </Form.Item>

        {/* BUTTON */}
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          style={{
            height: 50,
            borderRadius: 16,
            marginTop: 14,
            fontWeight: 700,
            background:
              "linear-gradient(135deg,#7c3aed,#9333ea)",
            border: 0,
          }}
        >
          {
            isEdit
              ? "Update Role"
              : "Create Role"
          }
        </Button>

      </Form>

    </Modal>
  );
}