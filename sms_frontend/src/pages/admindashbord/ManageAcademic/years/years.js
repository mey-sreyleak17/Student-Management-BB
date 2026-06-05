import React, {
  useEffect,
  useState,
} from "react";

import {
  Card,
  List,
  Typography,
  Button,
  Avatar,
  Space,
  Tag,
  Form,
  message,
  Popconfirm,
} from "antd";

import {
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";

import api from "../../../../Api/indext";

import AddYears from "./AddYears";

const { Title, Text } = Typography;

const AcademicYears = () => {
  const [open, setOpen] =useState(false);

  const [form] = Form.useForm();

  const [editingYear, setEditingYear] =
    useState(null);

  const [data, setData] = useState([]);

  // GET DATA
  const fetchData = async () => {
  try {
    const token =
      localStorage.getItem("accessToken");

    if (!token) {
      message.error(
        "No token found, please login"
      );
      return;
    }

    const res = await api.get(
      "/academic",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setData(
      Array.isArray(res.data)
        ? res.data
        : []
    );

  } catch (err) {
    console.error(
      "Error fetching academic years:",
      err
    );

    setData([]);

    message.error(
      "Failed to load academic years"
    );
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  // OPEN CREATE
  const handleAdd = () => {
    setEditingYear(null);

    form.resetFields();

    setOpen(true);
  };

  // OPEN EDIT
  const handleEdit = (item) => {
    setEditingYear(item);

    form.setFieldsValue({
      Name: item.Name,
      StartDate: dayjs(item.StartDate),
      EndDate: dayjs(item.EndDate),
    });

    setOpen(true);
  };

  // SAVE
 const handleSave = async (
  values
) => {
  try {
    const token =
      localStorage.getItem("accessToken");

    if (!token) {
      message.error(
        "No token found"
      );
      return;
    }

    const payload = {
      ...values,

      StartDate:
        values.StartDate.format(
          "YYYY-MM-DD"
        ),

      EndDate:
        values.EndDate.format(
          "YYYY-MM-DD"
        ),
    };

    payload.Name = `${dayjs(
      payload.StartDate
    ).year()}-${dayjs(
      payload.EndDate
    ).year()}`;

    if (editingYear) {
      await api.put(
        `/api/academic/${editingYear.Id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success(
        "Updated successfully"
      );

    } else {
      await api.post(
        "/academic/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success(
        "Created successfully"
      );
    }

    fetchData();

    form.resetFields();

    setOpen(false);

  } catch (err) {
    console.error(
      "Save Error:",
      err
    );

    message.error(
      "Failed to save data"
    );
  }
};
  // DELETE
 const handleDelete = async (
  id
) => {
  try {
    const token =
      localStorage.getItem("accessToken");

    if (!token) {
      message.error(
        "No token found"
      );
      return;
    }

    await api.delete(
      `/academic/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    message.success(
      "Deleted successfully"
    );

    fetchData();

  } catch (err) {
    console.error(
      "Delete Error:",
      err
    );

    message.error(
      "Failed to delete"
    );
  }
};

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 24,
      }}
      title={
        <Space
          direction="vertical"
          size={0}
        >
          <Title
            level={3}
            style={{ margin: 0 }}
          >
            Academic Years
          </Title>

          <Text type="secondary">
            Manage school academic years
          </Text>
        </Space>
      }
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Year
        </Button>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                icon={<EditOutlined />}
                onClick={() =>
                  handleEdit(item)
                }
              >
                Edit
              </Button>,

              <Popconfirm
                title="Delete Academic Year"
                description="Are you sure to delete this academic year?"
                onConfirm={() =>
                  handleDelete(item.Id)
                }
                okText="Delete"
                cancelText="Cancel"
              >
                <Button
                  danger
                  icon={
                    <DeleteOutlined />
                  }
                >
                  Delete
                </Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size={55}
                  style={{
                    background:
                      "#1677ff",
                  }}
                  icon={
                    <CalendarOutlined />
                  }
                />
              }
              title={
                <Text strong>
                  {item.Name}
                </Text>
              }
              description={
                <>
                  <div>
                    Start Date:{" "}
                    {item.StartDate}
                  </div>

                  <div>
                    End Date:{" "}
                    {item.EndDate}
                  </div>
                </>
              }
            />

            <Tag color="green">
              Academic Year
            </Tag>
          </List.Item>
        )}
      />

      <AddYears
        open={open}
        setOpen={setOpen}
        form={form}
        editingYear={editingYear}
        handleSave={handleSave}
      />
    </Card>
  );
};

export default AcademicYears;