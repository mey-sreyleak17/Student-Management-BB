import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Input,
  Select,
  Button,
  Space,
  Table,
  Avatar,
  Tag,
  message,
} from "antd";

import {
  TeamOutlined,
  BookOutlined,
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import api from "../../../Api/indext";

const { Title, Text } = Typography;
const { Option } = Select;

const StudentList = () => {
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [searchText, setSearchText] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/teacher/students"
      );

      setStudents(res.data.data || []);
      setFilteredStudents(res.data.data || []);
    } catch (error) {
      message.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const res = await api.get(
        "/teacher/classes"
      );

      setClasses(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  useEffect(() => {
    let data = [...students];

    if (searchText) {
      data = data.filter(
        (item) =>
          item.StudentId
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.EnglishName
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.KhmerName?.includes(searchText)
      );
    }

    if (selectedClass) {
      data = data.filter(
        (item) =>
          item.ClassId === selectedClass
      );
    }

    setFilteredStudents(data);
  }, [searchText, selectedClass, students]);

  const columns = [
    {
      title: "Student",
      width: 250,
      render: (_, record) => (
        <Space>
          <Avatar
            size={45}
            icon={<UserOutlined />}
          />

          <div>
            <div
              style={{
                fontWeight: 600,
              }}
            >
              {record.EnglishName}
            </div>

            <Text type="secondary">
              {record.KhmerName}
            </Text>
          </div>
        </Space>
      ),
    },

    {
      title: "Student ID",
      dataIndex: "StudentId",
      width: 120,
    },

    {
      title: "Gender",
      dataIndex: "Gender",
      width: 100,
    },

    {
      title: "Class",
      dataIndex: "ClassName",
      width: 180,
    },

    {
      title: "Level",
      dataIndex: "LevelName",
      width: 180,
    },

    {
      title: "Parent Phone",
      dataIndex: "ParentPhone",
      width: 150,
    },

    {
      title: "Status",
      width: 120,
      render: () => (
        <Tag color="green">
          Active
        </Tag>
      ),
    },

    {
      title: "Actions",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
          >
            Profile
          </Button>

          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            size="small"
          >
            Attendance
          </Button>

          <Button
            icon={<FileTextOutlined />}
            size="small"
          >
            Scores
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}

      <div
        style={{
          marginBottom: 24,
        }}
      >
        <Title level={2}>
          My Students
        </Title>

        <Text type="secondary">
          View students assigned to your classes
        </Text>
      </div>

      {/* Statistics */}

      <Row
        gutter={[16, 16]}
        style={{ marginBottom: 24 }}
      >
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Students"
              value={students.length}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="My Classes"
              value={classes.length}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Showing"
              value={filteredStudents.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filter Card */}

      <Card
        style={{
          marginBottom: 20,
          borderRadius: 16,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <Input
              size="large"
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search by ID, English Name, Khmer Name"
              value={searchText}
              onChange={(e) =>
                setSearchText(
                  e.target.value
                )
              }
            />
          </Col>

          <Col xs={24} md={6}>
            <Select
              size="large"
              allowClear
              style={{ width: "100%" }}
              placeholder="Select Class"
              value={selectedClass}
              onChange={setSelectedClass}
            >
              {classes.map((item) => (
                <Option
                  key={item.Id}
                  value={item.Id}
                >
                  {item.LevelName} -{" "}
                  {item.ClassName}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} md={8}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setSearchText("");
                  setSelectedClass(null);
                }}
              >
                Reset
              </Button>

            </Space>
          </Col>
        </Row>
      </Card>

      {/* Student Table */}

      <Card
        style={{
          borderRadius: 16,
        }}
      >
        <Table
          rowKey="Id"
          loading={loading}
          columns={columns}
          dataSource={filteredStudents}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) =>
              `Total ${total} students`,
          }}
        />
      </Card>
    </div>
  );
};

export default StudentList;