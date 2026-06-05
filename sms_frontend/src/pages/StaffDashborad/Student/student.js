import React, { useEffect, useState } from "react";
import api from "../../../Api/indext";
import {
  Table, Input, Select,Button, Tag, Space, Row,Modal, Col, Typography, Card, message,
} from "antd";
import {
  EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined,
} from "@ant-design/icons";
import StudentForm from "./addstudent";
const { Search } = Input;
const { Title, Text } = Typography;
// NEW state for filters

const Students = () => {
  const [mode, setMode] = useState( "add"); // "add" or "update"
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
//create function update
const handleAddStudent = async (formData) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        message.error("No token found, please log in");
        setLoading(false);
        return;
      }
      await api.post("/students", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Student created successfully");
      setOpen(false);
      fetchStudents();
    } catch (error) {
      console.error(error);
      message.error("Create failed");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  //done
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        message.error("No token found, please log in");
        setLoading(false);
        return;
      }
      const res = await api.get("/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.list);
    } catch (err) {
      console.error(err.response?.data || err.message);
      message.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  //done
const handleUpdate = async (formData) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("No token found, please log in");
      setLoading(false);
      return;
    }
    await api.put(`/students/${selectedStudent.Id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    message.success("Updated Student Successfully");
    setOpen(false);
    fetchStudents();
  } catch (error) {
    console.error(error);
    message.error("Student Not Found");
  }
};
const confirmUpdate = (student) => {
  Modal.confirm({
    title: "Confirm Update",
    content: `Do you want to update ${student.Name}'s information?`,
    okText: "Yes",
    cancelText: "No",
    onOk: () => {
      setSelectedStudent(student);
      setMode("update");
      setOpen(true);
    },
  });
};

// DELETEStudent done
const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("accessToken");
    await api.delete(`/students/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    message.success("Student deleted successfully");
    fetchStudents(); // refresh
  } catch (error) {
    console.error(error);
    message.error("Delete failed");
  }
};

const confirmDelete = (student) => {
  Modal.confirm({
    title: "Confirm Delete",
    content: `Do you want to delete student ${student.Name}?`,
    okText: "Yes",
    cancelText: "No",
    onOk: () => {
      setSelectedStudent(student);
      handleDelete(student.Id);
    },
  });
};

  const columns = [
    { title: "Student Code", dataIndex: "StudentCode" },
    {title:" Name",dataIndex: "KhmerName"},
    { title: "Gender", dataIndex: "Gender" },
    { title: "Phone", dataIndex: "Phone" },
     {title:"Address",dataIndex:"Address"},
    {
      title: "Status",
      render: () => <Tag color="green">Active</Tag>,
    },
    {
      title: "Actions",
      render: (student) => (
        <Space>
          <EyeOutlined
                style={{ color: "#1890ff" }}
                onClick={() => {
                  setSelectedStudent(student);
                  setMode("view");
                  setOpen(true);
               }}
            />

             <EditOutlined
               style={{ color: "#52c41a" }}
              onClick={() => confirmUpdate(student)}
               />

          <DeleteOutlined
                style={{ color: "red" }}
                 onClick={() => confirmDelete(student)}

          />
        </Space>
      ),
    },
  ];

 const filteredStudents = (students || []).filter((student) => {
  const matchesSearch =
    (student.Id &&
      student.Id.toString().includes(searchTerm)) ||
    (student.StudentCode &&
      student.StudentCode.toString().includes(searchTerm)) ||
    (student.KhmerName &&
      student.KhmerName.toLowerCase().includes(searchTerm.toLowerCase()));

  const matchesStatus =
    statusFilter === "all" ||
    (statusFilter === "active" && student.Status === "Active") ||
    (statusFilter === "inactive" && student.Status === "Inactive");

  return matchesSearch && matchesStatus;
});

  return (
    <div style={{ padding: 30 }}>
      {/* HEADER */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={2} style={{ marginBottom: 0 }}>
            Student informations
          </Title>
          <Text type="secondary">Manage student records and information</Text>
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
            setSelectedStudent(null);
            setMode("add");
              setOpen(true);
            }}
              >
           ចុះឈ្មោះសិស្សថ្មី
      </Button>
        </Col>
      </Row>

     
 {/* MODAL */}
<StudentForm
  key={selectedStudent ? selectedStudent.Id : "new-student"} // Add this line
  open={open}
  onCancel={() => {
    setOpen(false);
    setSelectedStudent(null);
    setMode(null);
  }}
  onSubmit={
    mode === "update"
      ? handleUpdate
      : mode === "add"
      ? handleAddStudent
      : undefined
  }
  initialValues={selectedStudent}
  mode={mode}
/>
      {/* FILTER */}
      <Card style={{ marginTop: 20, marginBottom: 20 }}>
        <Row gutter={20}>
          <Col>
            <Search
              size="large"
              placeholder="Search by name, ID, or code..."
              allowClear
              style={{ width: 400 }}
              onSearch={(value) => setSearchTerm(value)}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>

          <Col>
            <Select
              value={statusFilter}
              size="large"
              style={{ width: 250 }}
              options={[
                { value: "all", label: "All Gender" },
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "others", label: "others" },
              ]}
              onChange={(value) => setStatusFilter(value)}
            />
          </Col>
        </Row>
      </Card>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={filteredStudents}
        loading={loading}
        rowKey="Id"
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "No students found" }}
      />
    </div>
  );
};

export default Students;