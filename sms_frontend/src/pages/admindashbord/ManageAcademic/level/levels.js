import React, {
  useEffect,
  useState,
} from "react";

import {
  Card,
  Typography,
  Button,
  Space,
  Dropdown,
  message,
  Form,
  Popconfirm,
  Spin,
  Table,
  Tag,
  fontSize
} from "antd";

import {
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import api from "../../../../Api/indext";

import AddLevel from "./AddLevel";

const { Title, Text } = Typography;

const Levels = () => {

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [data, setData] =
    useState([]);

  const [editingLevel,
    setEditingLevel,
  ] = useState(null);

  const [form] = Form.useForm();

  // =========================
  // FETCH
  // =========================

  const fetchData = async () => {
    try {

      setLoading(true);

      const token =
        localStorage.getItem(
          "accessToken"
        );

      const res = await api.get(
        "/level",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setData(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.log(err);

      message.error(
        "Failed to load levels"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // ADD
  // =========================

  const handleAdd = () => {

    setEditingLevel(null);

    form.resetFields();

    setOpen(true);
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (item) => {

    setEditingLevel(item);

    form.setFieldsValue({
      LevelName:
        item.LevelName,

      ProgramId:
        item.ProgramId,

      LevelOrder:
        item.LevelOrder,
    });

    setOpen(true);
  };

  // =========================
  // SAVE
  // =========================

  const handleSave = async (
    values
  ) => {

    try {

      const token =
        localStorage.getItem(
          "accessToken"
        );

      const payload = {
        LevelName:
          values.LevelName,

        ProgramId:
          values.ProgramId,

        LevelOrder:
          values.LevelOrder,
      };

      // UPDATE
      if (editingLevel) {

       await api.put(
  `/level/${editingLevel.Id}`,
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
          "/level/create",
          payload,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        message.success(
          "Created successfully"
        );
      }

      fetchData();

      setOpen(false);

      form.resetFields();

    } catch (err) {

      console.log(err);

      message.error(
        "Failed to save level"
      );
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete =
    async (id) => {

      try {

        const token =
          localStorage.getItem(
            "accessToken"
          );

       await api.delete(
  `/level/${id}`,
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

        console.log(err);

        message.error(
          "Failed to delete"
        );
      }
    };

  // =========================
  // TABLE COLUMNS
  // =========================

  const columns = [
    {
      title: "ID",
      dataIndex: "Id",
      key: "Id",
      width: 80,
    },

    {
      title: "Level Name",
      dataIndex: "LevelName",
      key: "LevelName",
    },

    {
      title: "Students",
      dataIndex: "TotalStudent",
      key: "TotalStudent",
      align: "center",
      
      render: (value) => (
        <Tag color="purple" style={{fontSize:25}}>
          {value || 0}
        </Tag>
      ),
    },
    {
      title:"Program Name",
      dataIndex:"ProgramName",
      key:"LevelOrder"
    },

   {
  title: "Actions",
  key: "actions",
  align: "center",

  render: (_, record) => (
    <Space>

      {/* UPDATE */}
      <Popconfirm
        title="Update Level"
        description="Do you want to edit this level?"
        okText="Yes"
        cancelText="No"
        onConfirm={() =>
          handleEdit(record)
        }
      >
        <Button
          type="primary"
          icon={<EditOutlined />}
        >
          Edit
        </Button>
      </Popconfirm>

      {/* DELETE */}
      <Popconfirm
        title="Delete Level"
        description="Are you sure to delete this level?"
        okText="Delete"
        cancelText="Cancel"
        onConfirm={() =>
          handleDelete(record.Id)
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
    <>
      <Card
        bordered={false}
        style={{
          borderRadius: 20,
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <Title level={3}>
              Academic Levels
            </Title>

            <Text type="secondary">
              Manage all levels
            </Text>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Level
          </Button>
        </div>

        {/* TABLE */}

        <Spin spinning={loading}>

          <Table
            columns={columns}
            dataSource={data}
            rowKey="Id"
            bordered
            pagination={{
              pageSize: 8,
            }}
          />

        </Spin>
      </Card>

      {/* MODAL */}

      <AddLevel
  open={open}
  setOpen={setOpen}
  form={form}
  editingLevel={editingLevel}
  handleSave={handleSave}
/>
    </>
  );
};

export default Levels;