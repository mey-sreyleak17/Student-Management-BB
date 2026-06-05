import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Input,
  Select,
  Space,
  Tag,
  Button,
  Avatar,
} from "antd";
import {
  TrophyOutlined,
  StarOutlined,
  SmileOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  SearchOutlined,
  DownloadOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const Grade = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedClass, setSelectedClass] = useState();

  const grades = [
    {
      Id: 1,
      StudentId: "ST001",
      EnglishName: "John Smith",
      KhmerName: "ចន ស្មីត",
      ClassName: "Beginner 4th",
      AverageScore: 96,
    },
    {
      Id: 2,
      StudentId: "ST002",
      EnglishName: "Mary Jane",
      KhmerName: "ម៉ារី",
      ClassName: "Beginner 4th",
      AverageScore: 84,
    },
    {
      Id: 3,
      StudentId: "ST003",
      EnglishName: "David Kim",
      KhmerName: "ដេវីដ",
      ClassName: "Elementary",
      AverageScore: 73,
    },
    {
      Id: 4,
      StudentId: "ST004",
      EnglishName: "Sophia",
      KhmerName: "សុភា",
      ClassName: "Elementary",
      AverageScore: 58,
    },
  ];

  const getGrade = (score) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A":
        return "green";
      case "B":
        return "blue";
      case "C":
        return "orange";
      case "D":
        return "gold";
      default:
        return "red";
    }
  };

  const filteredData = grades.filter((item) => {
    const searchMatch =
      item.StudentId
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      item.EnglishName
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      item.KhmerName.includes(searchText);

    const classMatch =
      !selectedClass ||
      item.ClassName === selectedClass;

    return searchMatch && classMatch;
  });

  const sortedData = [...filteredData].sort(
    (a, b) =>
      b.AverageScore - a.AverageScore
  );

  const columns = [
    {
      title: "#",
      width: 70,
      render: (_, __, index) => index + 1,
    },

    {
      title: "Student",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />

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
    },

    {
      title: "Class",
      dataIndex: "ClassName",
    },

    {
      title: "Average Score",
      dataIndex: "AverageScore",
      render: (score) => (
        <b>{score}</b>
      ),
    },

    {
      title: "Grade",
      render: (_, record) => {
        const grade = getGrade(
          record.AverageScore
        );

        return (
          <Tag
            color={getGradeColor(grade)}
          >
            {grade}
          </Tag>
        );
      },
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
          Student Grades
        </Title>

        <Text type="secondary">
          Calculate and review student
          grades
        </Text>
      </div>

      {/* Statistics */}

    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
  <Col xs={24} sm={12} lg={6}>
    <Card
      bordered={false}
      style={{
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        borderLeft: "5px solid #52c41a",
      }}
    >
      <Statistic
        title="Grade A"
        value={
          filteredData.filter(
            (x) => getGrade(x.AverageScore) === "A"
          ).length
        }
        prefix={
          <TrophyOutlined
            style={{ color: "#52c41a" }}
          />
        }
        valueStyle={{
          color: "#52c41a",
          fontWeight: 700,
        }}
      />
    </Card>
  </Col>

  <Col xs={24} sm={12} lg={6}>
    <Card
      bordered={false}
      style={{
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        borderLeft: "5px solid #1677ff",
      }}
    >
      <Statistic
        title="Grade B"
        value={
          filteredData.filter(
            (x) => getGrade(x.AverageScore) === "B"
          ).length
        }
        prefix={
          <StarOutlined
            style={{ color: "#1677ff" }}
          />
        }
        valueStyle={{
          color: "#1677ff",
          fontWeight: 700,
        }}
      />
    </Card>
  </Col>

  <Col xs={24} sm={12} lg={6}>
    <Card
      bordered={false}
      style={{
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        borderLeft: "5px solid #faad14",
      }}
    >
      <Statistic
        title="Grade C"
        value={
          filteredData.filter(
            (x) => getGrade(x.AverageScore) === "C"
          ).length
        }
        prefix={
          <SmileOutlined
            style={{ color: "#faad14" }}
          />
        }
        valueStyle={{
          color: "#faad14",
          fontWeight: 700,
        }}
      />
    </Card>
  </Col>

  <Col xs={24} sm={12} lg={6}>
    <Card
      bordered={false}
      style={{
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        borderLeft: "5px solid #ff4d4f",
      }}
    >
      <Statistic
        title="Failed"
        value={
          filteredData.filter(
            (x) => getGrade(x.AverageScore) === "F"
          ).length
        }
        prefix={
          <CloseCircleOutlined
            style={{ color: "#ff4d4f" }}
          />
        }
        valueStyle={{
          color: "#ff4d4f",
          fontWeight: 700,
        }}
      />
    </Card>
  </Col>
</Row>

<Card
  style={{
    borderRadius: 20,
    background:
      "linear-gradient(135deg,#52c41a,#73d13d)",
    color: "#fff",
    border: 0,
  }}
>
  <Space
    style={{
      width: "100%",
      justifyContent: "space-between",
    }}
  >
    <div>
      <div style={{ opacity: 0.9 }}>
        Grade A
      </div>

      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        {
          filteredData.filter(
            (x) => getGrade(x.AverageScore) === "A"
          ).length
        }
      </div>
    </div>

    <TrophyOutlined
      style={{
        fontSize: 40,
        opacity: 0.8,
      }}
    />
  </Space>
</Card>


      {/* Filters */}

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
              placeholder="Search student..."
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
              style={{
                width: "100%",
              }}
              placeholder="Select Class"
              value={selectedClass}
              onChange={
                setSelectedClass
              }
            >
              <Option value="Beginner 4th">
                Beginner 4th
              </Option>

              <Option value="Elementary">
                Elementary
              </Option>
            </Select>
          </Col>

          <Col xs={24} md={8}>
            <Button
              type="primary"
              icon={
                <DownloadOutlined />
              }
            >
              Export Grades
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}

      <Card
        style={{
          borderRadius: 16,
        }}
      >
        <Table
          rowKey="Id"
          columns={columns}
          dataSource={sortedData}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default Grade;