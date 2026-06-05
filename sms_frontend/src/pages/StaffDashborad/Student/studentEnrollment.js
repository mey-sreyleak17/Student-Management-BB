import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Space,
  Input,
  message,
  Popconfirm,
  Modal
} from "antd";

import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import api from "../../../Api/indext";
import EnrollmentForm from "./enrollmentform";

const { Title, Text } = Typography;
const { Search } = Input;

const Enrollment = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [mode, setMode] = useState("add");
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
 // const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
  try {

    setLoading(true);

    const token = localStorage.getItem("accessToken");

    const res = await api.get("/students/enroll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setEnrollments(res.data.list);

  } catch (error) {

    console.log(error);

    message.error("Failed to fetch enrollments");

  } finally {

    setLoading(false);

  }
};
  const handleAddEnrollment = async (formData) => {
    try {
      const token = localStorage.getItem("accessToken");

      await api.post("/students/enroll", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Enrollment created successfully");

      setOpen(false);

      fetchEnrollments();
    } catch (error) {
      console.log(error);
      message.error("Create failed");
    }
  };

  const handleUpdateEnrollment = async (formData) => {
    try {
      const token = localStorage.getItem("accessToken");

      await api.put(
        `/students/enrollments/${selectedEnrollment.Id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Enrollment updated");

      setOpen(false);

      fetchEnrollments();
    } catch (error) {
      console.log(error);
      message.error("Update failed");
    }
  };
 const confirmUpdate = (enroll) => {
  Modal.confirm({
    title: "Confirm Update",
    content: `Do you want to update ${enroll.Name}'s information?`,
    okText: "Yes",
    cancelText: "No",
    onOk: () => {
      setSelectedEnrollment(enrollments);
      setMode("update");
      setOpen(true);
    },
  });
};
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      await api.delete(`/students/enrollments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Enrollment deleted");

      fetchEnrollments();
    } catch (error) {
      console.log(error);
      message.error("Delete failed");
    }
  };
const confirmDelete = (enrollment) => {
  Modal.confirm({
    title: "Confirm Delete",
    content: `Do you want to delete student ${enrollment.Name} enrollment ? `,
    okText: "Yes",
    cancelText: "No",
    onOk: () => {
      setSelectedEnrollment(enrollments);
      handleDelete(enrollments.Id);
    },
  });
};
  const columns = [
    {
      title: "Enrollment No",
      dataIndex: "Id",
    },
    {
      title: "Name",
      dataIndex: "StudentName",
    },
    {
      title: "Class Name",
      dataIndex: "ClassName",
    },
    {
      title: "Academic Year",
      dataIndex: "AcademicName",
    },
    {
      title: "Enrollment Date",
      dataIndex: "EnrollDate",
    },
    {
      title: "Status",
      dataIndex: "Status",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space size="middle">
          <EyeOutlined
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={() => {
              setSelectedEnrollment(record);
              setMode("view");
              setOpen(true);
            }}
          />

          <EditOutlined
             style={{ color: "#52c41a" }}
              onClick={() => confirmUpdate(enrollments)}
          />

          <Popconfirm
            title="Delete Enrollment"
            description="Are you sure?"
            onConfirm={() => handleDelete(record.Id)}
          >
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

 const filteredEnrollments = (enrollments || []).filter((enroll) => {
  const matchesSearch =
    (enroll.Id &&
      enroll.Id.toString().includes(searchTerm)) ||
    (enroll.StudentName &&
    enroll.StudentName.toString().includes(searchTerm));
  return matchesSearch
});


  return (
    <div style={{ padding: 30 }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={2}>Student Enrollment</Title>

          <Text type="secondary">
            Manage student enrollment records
          </Text>
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedEnrollment(null);
              setMode("add");
              setOpen(true);
            }}
          >
            New Enrollment
          </Button>
        </Col>
      </Row>

      <Card style={{ marginTop: 20, marginBottom: 20 }}>
        <Search
          placeholder="Search student..."
          size="large"
          allowClear
          style={{ width: 350 }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <EnrollmentForm
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelectedEnrollment(null);
        }}
        onSubmit={
          mode === "update"
            ? handleUpdateEnrollment
            : handleAddEnrollment
        }
        initialValues={selectedEnrollment}
        mode={mode}
      />

      <Table
        rowKey="Id"
        columns={columns}
         pagination={{ pageSize: 5 }}
        dataSource={filteredEnrollments}
        loading={loading}
      />
    </div>
  );
};

export default Enrollment;