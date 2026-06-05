import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  DatePicker,
  Select,
  Table,
  Tag,
  Statistic,
  Input,
  message,
  Empty,
} from "antd";

import {
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import api from "../../../Api/indext";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Search } = Input;

export default function Attendance() {
  const [attendanceStudent, setAttendanceStudent] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const [ClassId, setClassId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    permission: 0,
  });

  // ================= FETCH DATA =================

  const fetchAttendance = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      const res = await api.get("/attendance/student/getlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.list || res.data || [];

      setAttendanceStudent(data);
    } catch (error) {
      console.log(error);
      message.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
  try {

    const res = await api.get(
      "/attendance/student-summary",
      {
        params: {
          ClassId,
          date: selectedDate,
        },
      }
    );

    setStats({
      total: res.data.total_students,
      present: res.data.present_today,
      absent: res.data.absent_today,
      late: res.data.late_today,
      permission: res.data.permission_today,
    });

  } catch (error) {

    console.log(error);

  }
};
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
    fetchAttendance();
    fetchStats();
    fetchClassesName();
  }, [ClassId, selectedDate]);

  // ================= FILTER =================

  const filteredAttendance = attendanceStudent.filter((item) => {
    const search =
      item.StudentId?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.StudentName?.toLowerCase().includes(searchTerm.toLowerCase());

    const status =
      statusFilter === "all" || item.Status === statusFilter;

    return search && status;
  });

  // ================= TABLE =================

  const columns = [
    {
      title: "Student",
      dataIndex: "StudentName",
      key: "StudentName",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {record.StudentName || "Unknown"}
          </div>

          <Text type="secondary">
            ID: {record.StudentId}
          </Text>
        </div>
      ),
    },

    {
      title: "Date",
      dataIndex: "AttendanceDate",
      key: "AttendanceDate",
      render: (date) =>
        dayjs(date).format("DD MMM YYYY"),
    },

    {
      title: "Teacher",
      dataIndex: "TeacherName",
      key: "TeacherName",
      render: (text) => text || "N/A",
    },

    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (status) => {
        let color = "default";

        if (status === "Present") color = "green";
        if (status === "Absent") color = "red";
        if (status === "Late") color = "orange";
        if (status === "Permission") color = "blue";

        return (
          <Tag color={color} style={{ fontWeight: 600 }}>
            {status}
          </Tag>
        );
      },
    },
  ];

  // ================= UI =================

  return (
  <div
    style={{
      padding: 24,
      background: "#eef2f7",
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
          "linear-gradient(135deg,#1677ff,#4096ff)",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <Row align="middle" justify="space-between">
        <Col>
          <Title
            level={2}
            style={{
              color: "#fff",
              marginBottom: 0,
            }}
          >
            Student Attendance
          </Title>

          <Text style={{ color: "#e6f4ff" }}>
            Monitor daily student attendance records
          </Text>
        </Col>

        <Col>
          <UserOutlined
            style={{
              fontSize: 60,
              color: "rgba(255,255,255,0.3)",
            }}
          />
        </Col>
      </Row>
    </Card>

    {/* STATISTICS */}

    <Row gutter={[20, 20]}>
      <Col xs={24} sm={12} md={6}>
        <Card
          bordered={false}
          style={{
            borderRadius: 24,
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.05)",
          }}
        >
          <Statistic
            title="Total Students"
            value={stats.total}
            valueStyle={{
              fontWeight: "bold",
            }}
            prefix={<TeamOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          bordered={false}
          style={{
            borderRadius: 24,
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.05)",
          }}
        >
          <Statistic
            title="Present"
            value={stats.present}
            valueStyle={{
              color: "#52c41a",
              fontWeight: "bold",
            }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          bordered={false}
          style={{
            borderRadius: 24,
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.05)",
          }}
        >
          <Statistic
            title="Absent"
            value={stats.absent}
            valueStyle={{
              color: "#ff4d4f",
              fontWeight: "bold",
            }}
            prefix={<CloseCircleOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          bordered={false}
          style={{
            borderRadius: 24,
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.05)",
          }}
        >
          <Statistic
            title="Late"
            value={stats.late}
            valueStyle={{
              color: "#faad14",
              fontWeight: "bold",
            }}
            prefix={<ClockCircleOutlined />}
          />
        </Card>
      </Col>
    </Row>

    {/* FILTER SECTION */}

    <Card
      bordered={false}
      style={{
        marginTop: 24,
        borderRadius: 24,
        boxShadow:
          "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Search
            placeholder="Search student name or ID..."
            allowClear
            size="large"
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </Col>

        <Col xs={24} md={5}>
          <Select
            size="large"
            style={{ width: "100%" }}
            placeholder="Select Class"
            onChange={(value) =>
              setClassId(value)
            }
            allowClear
          >
            {ClassName.map((item) => (
              <Select.Option
                key={item.Id}
                value={item.Id}
              >
                {item.ClassName}
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} md={5}>
          <Select
            size="large"
            style={{ width: "100%" }}
            value={statusFilter}
            onChange={(value) =>
              setStatusFilter(value)
            }
          >
            <Select.Option value="all">
              All Status
            </Select.Option>

            <Select.Option value="Present">
              Present
            </Select.Option>

            <Select.Option value="Absent">
              Absent
            </Select.Option>

            <Select.Option value="Late">
              Late
            </Select.Option>

            <Select.Option value="Permission">
              Permission
            </Select.Option>
          </Select>
        </Col>

        <Col xs={24} md={6}>
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            defaultValue={dayjs()}
            onChange={(date, dateString) =>
              setSelectedDate(dateString)
            }
          />
        </Col>
      </Row>
    </Card>

    {/* TABLE */}

    <Card
      bordered={false}
      style={{
        marginTop: 24,
        borderRadius: 24,
        boxShadow:
          "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <Table
        columns={columns}
        dataSource={filteredAttendance}
        loading={loading}
        rowKey={(record) =>
          record.AttendanceId ||
          record.StudentId
        }
        pagination={{
          pageSize: 7,
          showSizeChanger: false,
        }}
        locale={{
          emptyText: (
            <Empty description="No Attendance Found" />
          ),
        }}
      />
    </Card>
  </div>
);
}