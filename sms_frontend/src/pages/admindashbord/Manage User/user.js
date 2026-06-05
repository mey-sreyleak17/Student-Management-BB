import React, {
  useEffect,
  useState,
} from "react";

import {
  Table,
  Avatar,
  Tag,
  Input,
  Button,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Dropdown,
  message,
  Spin,
  Popconfirm
} from "antd";

import {
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined
} from "@ant-design/icons";

import api from "../../../Api/indext";

import AddUser from "./AddUser";

const { Title, Text } =
  Typography;

export default function UserManagement() {
  const [data, setData] =useState([]);
  const [totalUsers, setTotalUsers] =useState(0);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

// =========================
// GET USERS
// =========================

const fetchData = async (
  searchText = ""
) => {

  try {

    setLoading(true);

    const token =
      localStorage.getItem(
        "accessToken"
      );

    const res = await api.get(
      `/user?search=${searchText}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    setData(res.data.Data);

    // ADD THIS
    setTotalUsers(
      res.data.TotalUsers
    );

  } catch (err) {

    console.log(err);

    message.error(
      "Failed to load users"
    );

  } finally {

    setLoading(false);

  }
};
// =========================
// CREATE USER
// =========================

const handleCreate =
  async (values) => {

    try {

      const token =
        localStorage.getItem(
          "accessToken"
        );

      await api.post(
        "/user/create",
        values,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      message.success(
        "User created successfully"
      );

      fetchData();

    } catch (err) {

      console.log(err);

      message.error(
        "Create failed"
      );

    }

  };

// =========================
// UPDATE USER
// =========================

const handleUpdate =
  async (id, values) => {

    try {

      const token =
        localStorage.getItem(
          "accessToken"
        );

      await api.put(
        `/user/${id}`,
        values,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      message.success(
        "User updated successfully"
      );

      fetchData();

    } catch (err) {

      console.log(err);

      message.error(
        "Update failed"
      );

    }

  };

// =========================
// DELETE USER
// =========================

const handleDelete =
  async (id) => {

    try {

      const token =
        localStorage.getItem(
          "accessToken"
        );

      await api.delete(
        `/user/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      message.success(
        "Deleted successfully"
      );

      fetchData();

    } catch (err) {

      console.log(err);

      message.error(
        "Delete failed"
      );

    }

  };

// =========================
// FIRST LOAD
// =========================

useEffect(() => {

  fetchData();

}, []);

  // =========================
  // SEARCH
  // =========================

  const filtered =
    data.filter(
      (u) =>
        u.Name?.toLowerCase().includes(
          search.toLowerCase()
        ) ||
        u.Email?.toLowerCase().includes(
          search.toLowerCase()
        )
    );

  // =========================
  // ROLE COLOR
  // =========================

  const roleColor = {
    admin: "red",
    teacher: "blue",
    student: "green",
    staff: "purple",
  };

  // =========================
  // TABLE
  // =========================

  const columns = [
    {
      title: "User Name",
      render: (_, record) => (
        <Space size={14}>
          <Avatar
            size={48}
            style={{
              background:
                "linear-gradient(135deg,#7c3aed,#a855f7)",
              fontWeight: 700,
            }}
          >
            {record.Name?.charAt(
              0
            )}
          </Avatar>

          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: "#111827",
              }}
            >
              {record.Name}
            </div>

            <Text
              type="secondary"
            >
              {record.Email}
            </Text>
          </div>
        </Space>
      ),
    },

    {
      title: "Role",
      render: (_, record) => (
        <Tag
          color={
            roleColor[
              record.Role
            ]
          }
          style={{
            borderRadius: 20,
            paddingInline: 14,
            paddingBlock: 4,
            fontWeight: 600,
            textTransform:
              "capitalize",
          }}
        >
          {record.Role}
        </Tag>
      ),
    },

    {
      title: "Status",
      render: (_, record) => (
        <Tag
          color={
            record.IsActive
              ? "green"
              : "red"
          }
          style={{
            borderRadius: 20,
            paddingInline: 14,
          }}
        >
          {record.IsActive
            ? "Active"
            : "Inactive"}
        </Tag>
      ),
    },

    {
      title: "Created At",
      render: (_, record) =>
        new Date(
          record.CreateAt
        ).toLocaleDateString(),
    },

    {
  title: "Action",
  align: "center",

  render: (_, record) => (
    <Space>

      {/* EDIT BUTTON */}
      <AddUser
        isEdit={true}
        initialValues={record}
        onSubmit={(values) =>
          handleUpdate(
            record.Id,
            values
          )
        }
      />

      {/* DELETE BUTTON */}
      <Popconfirm
  title="Delete User"
  description="Are you sure you want to delete this user?"
  okText="Yes"
  cancelText="No"
  onConfirm={() =>
    handleDelete(
      record.Id
    )
  }
>
  <Button
    danger
    icon={<DeleteOutlined />}
  >
    Delete
  </Button>
</Popconfirm>

    </Space>
  ),
}
  ];

  return (
    <div
      style={{
        padding: 24,
      }}
    >
      {/* HEADER */}
      <Card
        bordered={false}
        style={{
          borderRadius: 32,
          marginBottom: 24,
          background:
            "linear-gradient(135deg,#7c3aed,#9333ea)",
          overflow: "hidden",
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
              User Management
            </Title>

            <Text
              style={{
                color:
                  "rgba(255,255,255,0.8)",
                fontSize: 16,
              }}
            >
              Manage system users
              and permissions
            </Text>
          </Col>

          <Col>
            <Avatar
              size={80}
              icon={
                <TeamOutlined />
              }
              style={{
                background:
                  "rgba(255,255,255,0.15)",
                color: "#fff",
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* STATS */}
      <Row
        gutter={[20, 20]}
        style={{
          marginBottom: 24,
        }}
      >
        <Col
          xs={24}
          sm={12}
          md={8}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 26,
            }}
          >
            <Text type="secondary">
              Total Users
            </Text>

            <Title
              level={2}
              style={{
                margin: 0,
                marginTop: 8,
              }}
            >
              {totalUsers}
            </Title>
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 26,
            }}
          >
            <Text type="secondary">
              Active Users
            </Text>

            <Title
              level={2}
              style={{
                margin: 0,
                marginTop: 8,
                color: "#16a34a",
              }}
            >
              {
                data.filter(
                  (x) =>
                    x.IsActive
                ).length
              }
            </Title>
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 26,
            }}
          >
            <Text type="secondary">
              Admin Users
            </Text>

            <Title
              level={2}
              style={{
                margin: 0,
                marginTop: 8,
                color: "#dc2626",
              }}
            >
              {
                data.filter(
                  (x) =>
                    x.Role ===
                    "admin"
                ).length
              }
            </Title>
          </Card>
        </Col>
      </Row>

      {/* MAIN TABLE */}
      <Card
        bordered={false}
        style={{
          borderRadius: 30,
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 24,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
         <Input
          placeholder="Search user..."
          value={search}
          onChange={(e) => {

    setSearch(
      e.target.value
    );

    fetchData(
      e.target.value
    );

  }}
/>

          <AddUser
             fetchData={fetchData}
              onSubmit={handleCreate}
/>
        </div>

        {/* TABLE */}
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey="Id"
            pagination={{
              pageSize: 4,
            }}
          />
        </Spin>
      </Card>
    </div>
  );
}