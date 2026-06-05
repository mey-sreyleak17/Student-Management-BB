import React, {
  useState,
} from "react";

import {
  Layout,
  Card,
  List,
  Typography,
  Button,
  Space,
  Tag,
  Divider,
  Checkbox,
  Popconfirm,
  Row,
  Col,
  Avatar,
  Empty,
} from "antd";

import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SafetyOutlined,
  TeamOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

import AddRole from "./AddRole";

const { Title, Text } =
  Typography;

const { Sider, Content } =
  Layout;

export default function RolesPermissions() {

  const [roles, setRoles] =
    useState([
      {
        id: 1,
        name:
          "Administrator",
        desc:
          "Full system access and control",
        permissions: [
          "Create Users",
          "Delete Users",
          "Edit Roles",
          "View Reports",
        ],
        users: 1,
        color: "#7c3aed",
      },

      {
        id: 2,
        name: "Teacher",
        desc:
          "Manage classes and students",
        permissions: [
          "View Students",
          "Manage Scores",
        ],
        users: 12,
        color: "#2563eb",
      },

      {
        id: 3,
        name: "Staff",
        desc:
          "Office and management access",
        permissions: [
          "View Reports",
        ],
        users: 5,
        color: "#059669",
      },
    ]);

  const [selectedRole,
    setSelectedRole] =
    useState(roles[0]);

  const [open, setOpen] =
    useState(false);

  const [isEdit, setIsEdit] =
    useState(false);

  const [editingRole,
    setEditingRole] =
    useState(null);

  // =========================
  // DELETE
  // =========================

  const handleDelete = (
    roleId
  ) => {

    const updated =
      roles.filter(
        (r) =>
          r.id !== roleId
      );

    setRoles(updated);

    setSelectedRole(
      updated[0]
    );

  };

  return (
    <div
      style={{
        padding: 24,
        background:
          "#f5f7fb",
        minHeight: "100vh",
      }}
    >

      {/* HEADER */}
      <Card
        bordered={false}
        style={{
          borderRadius: 28,
          marginBottom: 24,
          background:
            "linear-gradient(135deg,#7c3aed,#9333ea)",
        }}
      >
        <Row
          justify="space-between"
          align="middle"
        >
          <Col>

            <Title
              level={2}
              style={{
                color: "#fff",
                marginBottom: 6,
              }}
            >
              Roles &
              Permissions
            </Title>

            <Text
              style={{
                color:
                  "rgba(255,255,255,0.85)",
                fontSize: 16,
              }}
            >
              Manage system
              access and
              permissions
            </Text>

          </Col>

          <Col>
            <Button
              size="large"
              type="primary"
              icon={
                <PlusOutlined />
              }
              onClick={() => {
                setIsEdit(
                  false
                );

                setOpen(
                  true
                );
              }}
              style={{
                background:
                  "#fff",
                color:
                  "#7c3aed",
                border: 0,
                fontWeight: 700,
                height: 48,
                borderRadius: 14,
                paddingInline: 24,
              }}
            >
              Create Role
            </Button>
          </Col>
        </Row>
      </Card>

      <Layout
        style={{
          background:
            "transparent",
        }}
      >

        {/* LEFT SIDEBAR */}
        <Sider
          width={320}
          style={{
            background:
              "transparent",
            marginRight: 24,
          }}
        >

          <Card
            bordered={false}
            style={{
              borderRadius: 28,
            }}
          >

            <Space
              style={{
                marginBottom: 20,
              }}
            >
              <Avatar
                icon={
                  <SafetyOutlined />
                }
                style={{
                  background:
                    "#7c3aed",
                }}
              />

              <Title
                level={4}
                style={{
                  margin: 0,
                }}
              >
                System Roles
              </Title>
            </Space>

            <List
              dataSource={
                roles
              }
              renderItem={(
                role
              ) => (

                <List.Item
                  onClick={() =>
                    setSelectedRole(
                      role
                    )
                  }
                  style={{
                    cursor:
                      "pointer",
                    borderRadius: 20,
                    marginBottom: 14,
                    padding: 18,
                    border:
                      selectedRole.id ===
                      role.id
                        ? `2px solid ${role.color}`
                        : "2px solid transparent",

                    background:
                      selectedRole.id ===
                      role.id
                        ? "#f3f0ff"
                        : "#fafafa",

                    transition:
                      "0.3s",
                  }}
                >

                  <Space
                    align="start"
                  >

                    <Avatar
                      size={
                        52
                      }
                      style={{
                        background:
                          role.color,
                        fontWeight: 700,
                      }}
                    >
                      {
                        role.name[0]
                      }
                    </Avatar>

                    <div>

                      <Text
                        strong
                        style={{
                          fontSize: 16,
                        }}
                      >
                        {
                          role.name
                        }
                      </Text>

                      <br />

                      <Text
                        type="secondary"
                      >
                        {
                          role.desc
                        }
                      </Text>

                      <div
                        style={{
                          marginTop: 10,
                        }}
                      >
                        <Tag
                          color="blue"
                        >
                          <TeamOutlined />
                          {" "}
                          {
                            role.users
                          }
                          {" "}
                          Users
                        </Tag>
                      </div>

                    </div>

                  </Space>

                </List.Item>
              )}
            />

          </Card>

        </Sider>

        {/* RIGHT CONTENT */}
        <Content>

          {!selectedRole ? (

            <Card
              bordered={false}
              style={{
                borderRadius: 28,
              }}
            >
              <Empty />
            </Card>

          ) : (

            <Card
              bordered={false}
              style={{
                borderRadius: 28,
              }}
            >

              {/* TOP */}
              <Row
                justify="space-between"
                align="middle"
              >

                <Col>

                  <Space
                    align="center"
                  >

                    <Avatar
                      size={
                        70
                      }
                      style={{
                        background:
                          selectedRole.color,
                        fontSize: 28,
                        fontWeight: 700,
                      }}
                    >
                      {
                        selectedRole.name[0]
                      }
                    </Avatar>

                    <div>

                      <Title
                        level={2}
                        style={{
                          marginBottom: 4,
                        }}
                      >
                        {
                          selectedRole.name
                        }
                      </Title>

                      <Text
                        type="secondary"
                        style={{
                          fontSize: 16,
                        }}
                      >
                        {
                          selectedRole.desc
                        }
                      </Text>

                    </div>

                  </Space>

                </Col>

                <Col>

                  <Space>

                    {/* EDIT */}
                    <Button
                      icon={
                        <EditOutlined />
                      }
                      size="large"
                      style={{
                        borderRadius: 12,
                      }}
                      onClick={() => {

                        setIsEdit(
                          true
                        );

                        setEditingRole(
                          selectedRole
                        );

                        setOpen(
                          true
                        );

                      }}
                    >
                      Edit
                    </Button>

                    {/* DELETE */}
                    <Popconfirm
                      title="Delete Role"
                      description="Are you sure you want to delete this role?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() =>
                        handleDelete(
                          selectedRole.id
                        )
                      }
                    >

                      <Button
                        danger
                        size="large"
                        icon={
                          <DeleteOutlined />
                        }
                        style={{
                          borderRadius: 12,
                        }}
                      >
                        Delete
                      </Button>

                    </Popconfirm>

                  </Space>

                </Col>

              </Row>

              <Divider />

              {/* STATS */}
              <Row
                gutter={[
                  20,
                  20,
                ]}
                style={{
                  marginBottom: 28,
                }}
              >

                <Col span={12}>

                  <Card
                    bordered={false}
                    style={{
                      borderRadius: 22,
                      background:
                        "#f9fafb",
                    }}
                  >

                    <Text
                      type="secondary"
                    >
                      Total Users
                    </Text>

                    <Title
                      level={2}
                      style={{
                        margin: 0,
                        marginTop: 6,
                      }}
                    >
                      {
                        selectedRole.users
                      }
                    </Title>

                  </Card>

                </Col>

                <Col span={12}>

                  <Card
                    bordered={false}
                    style={{
                      borderRadius: 22,
                      background:
                        "#f9fafb",
                    }}
                  >

                    <Text
                      type="secondary"
                    >
                      Permissions
                    </Text>

                    <Title
                      level={2}
                      style={{
                        margin: 0,
                        marginTop: 6,
                      }}
                    >
                      {
                        selectedRole
                          .permissions
                          .length
                      }
                    </Title>

                  </Card>

                </Col>

              </Row>

              {/* PERMISSIONS */}
              <Title
                level={4}
                style={{
                  marginBottom: 20,
                }}
              >
                Permissions
              </Title>

              <Checkbox.Group
                value={
                  selectedRole.permissions
                }
              >

                <Row
                  gutter={[
                    18,
                    18,
                  ]}
                >

                  {selectedRole
                    ?.permissions
                    ?.map(
                      (
                        perm
                      ) => (

                        <Col
                          xs={
                            24
                          }
                          md={
                            12
                          }
                          key={
                            perm
                          }
                        >

                          <Card
                            bordered={false}
                            style={{
                              borderRadius: 18,
                              background:
                                "#fafafa",
                            }}
                          >

                            <Space>

                              <CheckCircleFilled
                                style={{
                                  color:
                                    "#16a34a",
                                  fontSize: 18,
                                }}
                              />

                              <Checkbox
                                value={
                                  perm
                                }
                              >
                                {
                                  perm
                                }
                              </Checkbox>

                            </Space>

                          </Card>

                        </Col>

                      )
                    )}

                </Row>

              </Checkbox.Group>

            </Card>

          )}

        </Content>

      </Layout>

      {/* ADD / EDIT ROLE */}
      <AddRole
        open={open}
        isEdit={isEdit}
        initialValues={
          editingRole
        }
        onCancel={() =>
          setOpen(false)
        }
      />

    </div>
  );
}