import React, { useState,useEffect } from "react";
import {  Card,  Table,  Typography,  Button,  Space,  Input,  Tag,  Form,  message,  Popconfirm,
} from "antd";
import {  PlusOutlined,  SearchOutlined,  EditOutlined,  DeleteOutlined,
} from "@ant-design/icons";
import AddSubject from "./AddSubject";
import api from "../../../../Api/indext";
const { Title, Text } = Typography;
const Subjects = () => {
  const [open, setOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form] = Form.useForm();
  // DATA
  const [data, setData] = useState([]);
  // SEARCH
  const [search, setSearch] = useState("");

 const filteredData = data.filter(
  (item) =>
    item.SubjectName?.toLowerCase().includes(
      search.toLowerCase()
    ) ||

    item.KhmerName?.toLowerCase().includes(
      search.toLowerCase()
    )
);
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
      "/subject",
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
      "Error fetching subject:",
      err
    );

    setData([]);

    message.error(
      "Failed to load subjects"
    );
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  // OPEN CREATE
  const handleAdd = () => {
    setEditingSubject(null);

    form.resetFields();

    setOpen(true);
  };

  // OPEN EDIT
  const handleEdit = (item) => {
    setEditingSubject(item);

    form.setFieldsValue({
      Name: item.Name,
      KhmerName:item.KhmerName
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
      Name: values.Name,
      KhmerName: values.KhmerName,
    };

    // UPDATE
    if (editingSubject) {
      await api.put(
        `/subject/${editingSubject.Id}`,
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
      // CREATE
      await api.post(
        "/subject/create",
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
      `/subject/${id}`,
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

  const columns = [
  {
    title: "Subject Name",
    dataIndex: "SubjectName",
  },

  {
    title: "Khmer Name",
    dataIndex: "KhmerName",
  },

  {
    title: "Create At",
    dataIndex: "CreateAt",
  },

  {
    title: "Action",

    render: (_, record) => (
      <Space>
        {/* EDIT */}
        <Button
          icon={<EditOutlined />}
          onClick={() =>
            handleEdit(record)
          }
        >
          Edit
        </Button>

        {/* DELETE */}
        <Popconfirm
          title="Delete Subject"
          description="Are you sure to delete this subject?"
          onConfirm={() =>
            handleDelete(record.Id)
          }
          okText="Delete"
          cancelText="Cancel"
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
  },
];
  return (
    <>
      <Card
        bordered={false}
        style={{ borderRadius: 24 }}
        title={
          <Space direction="vertical" size={0}>
            <Title level={3} style={{ margin: 0 }}>
              Academic Subject
            </Title>

            <Text type="secondary">
              Manage all school academic subject
            </Text>
          </Space>
        }
        extra={
          <Space>
            {/* SEARCH */}
            <Input
            
              placeholder="Search By Name"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {/* ADD */}
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Add New Subject
              </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
        />
      </Card>

      {/* MODAL */}
      <AddSubject
        open={open}
        setOpen={setOpen}
        form={form}
        editingSubject={editingSubject}
        handleSave={handleSave}
      />
    </>
  );
};

export default Subjects;