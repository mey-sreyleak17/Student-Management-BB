import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Input,
  Button,
  Select,
  Statistic,
  Typography,
  Space,
  Tag,
  Progress,
  DatePicker,
} from "antd";

import {
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
export default function TeacherAttendanceReport() {
  const [searchText, setSearchText] =
    useState("");

  const teacherData = [
    {
      Id: 1,
      TeacherName: "Mr. Dara",
      Position: "Math Teacher",
      Phone: "012345678",
      Present: 22,
      Absent: 1,
      Late: 2,
      Leave: 0,
      TotalDays: 25,
    },
    {
      Id: 2,
      TeacherName: "Mrs. Lina",
      Position: "English Teacher",
      Phone: "098765432",
      Present: 24,
      Absent: 0,
      Late: 1,
      Leave: 0,
      TotalDays: 25,
    },
    {
      Id: 3,
      TeacherName: "Mr. Vanna",
      Position: "Science Teacher",
      Phone: "011223344",
      Present: 20,
      Absent: 2,
      Late: 3,
      Leave: 0,
      TotalDays: 25,
    },
  ];

  const filteredData =
    teacherData.filter((item) =>
      item.TeacherName
        .toLowerCase()
        .includes(
          searchText.toLowerCase()
        )
    );

  const columns = [
    {
      title: "#",
      render: (_, __, index) =>
        index + 1,
      width: 70,
      align: "center",
    },
    {
      title: "Teacher Name",
      dataIndex: "TeacherName",
    },
    {
      title: "Position",
      dataIndex: "Position",
    },
    {
      title: "Phone",
      dataIndex: "Phone",
    },
    {
      title: "Present",
      dataIndex: "Present",
      align: "center",
      render: (value) => (
        <Tag color="green">
          {value}
        </Tag>
      ),
    },
    {
      title: "Absent",
      dataIndex: "Absent",
      align: "center",
      render: (value) => (
        <Tag color="red">
          {value}
        </Tag>
      ),
    },
    {
      title: "Late",
      dataIndex: "Late",
      align: "center",
      render: (value) => (
        <Tag color="orange">
          {value}
        </Tag>
      ),
    },
    {
      title: "Leave",
      dataIndex: "Leave",
      align: "center",
      render: (value) => (
        <Tag color="blue">
          {value}
        </Tag>
      ),
    },
    {
      title: "Attendance %",
      render: (_, record) => {
        const percent =
          Math.round(
            (record.Present /
              record.TotalDays) *
              100
          ) || 0;

        return (
          <Progress
            percent={percent}
            size="small"
          />
        );
      },
    },
  ];

  return (
    <div
      style={{
        padding: 24,
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Card
        bordered={false}
        style={{
          borderRadius: 20,
          marginBottom: 20,
        }}
      >
        <Title level={2}>
          Teacher Attendance Report
        </Title>

        <Text type="secondary">
          Monitor teacher attendance,
          absences, late arrivals,
          and leave requests.
        </Text>
      </Card>

      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Teachers"
              value={45}
              prefix={
                <TeamOutlined />
              }
            />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Present"
              value={40}
              valueStyle={{
                color: "#52c41a",
              }}
              prefix={
                <CheckCircleOutlined />
              }
            />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Absent"
              value={3}
              valueStyle={{
                color: "#ff4d4f",
              }}
              prefix={
                <CloseCircleOutlined />
              }
            />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Late"
              value={2}
              valueStyle={{
                color: "#faad14",
              }}
              prefix={
                <ClockCircleOutlined />
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Attendance Rate */}
      <Card
        bordered={false}
        style={{
          marginTop: 20,
          borderRadius: 20,
        }}
      >
        <Row justify="space-between">
          <Col>
            <Title level={4}>
              School Attendance
              Rate
            </Title>
          </Col>

          <Col>
            <Text strong>
              92%
            </Text>
          </Col>
        </Row>

        <Progress
          percent={92}
          status="active"
        />
      </Card>

      {/* Filters */}
      <Card
        bordered={false}
        style={{
          marginTop: 20,
          marginBottom: 20,
          borderRadius: 20,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <RangePicker
              style={{
                width: "100%",
              }}
            />
          </Col>

          <Col xs={24} md={6}>
            <Select
              placeholder="Position"
              style={{
                width: "100%",
              }}
            >
              <Option value="Teacher">
                Teacher
              </Option>

              <Option value="Coordinator">
                Coordinator
              </Option>

              <Option value="Principal">
                Principal
              </Option>
            </Select>
          </Col>

          <Col xs={24} md={6}>
            <Input
              prefix={
                <SearchOutlined />
              }
              placeholder="Search Teacher"
              value={
                searchText
              }
              onChange={(e) =>
                setSearchText(
                  e.target
                    .value
                )
              }
            />
          </Col>

          <Col xs={24} md={6}>
            <Space>
              <Button type="primary">
                Search
              </Button>

              <Button danger>
                Reset
              </Button>
            </Space>
          </Col>
        </Row>

        <Space
          style={{
            marginTop: 16,
          }}
        >
          <Button
            type="primary"
            icon={
              <FileExcelOutlined />
            }
          >
            Export Excel
          </Button>

          <Button
            danger
            icon={
              <FilePdfOutlined />
            }
          >
            Export PDF
          </Button>
        </Space>
      </Card>

      {/* Table */}
      <Card
        bordered={false}
        style={{
          borderRadius: 20,
        }}
      >
        <Table
          rowKey="Id"
          columns={columns}
          dataSource={
            filteredData
          }
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
          scroll={{
            x: 1200,
          }}
        />
      </Card>
    </div>
  );
}