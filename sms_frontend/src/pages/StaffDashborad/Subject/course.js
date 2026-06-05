import React, { useState } from "react";
import { Card, Row, Col, Input, Select, Button, Tag, Typography, Space,Drawer } from "antd";
import {SearchOutlined,UserOutlined,CalendarOutlined,EnvironmentOutlined,PlusOutlined,} from "@ant-design/icons";
import AddSubject from "./addsubject";
import ViewDetail from './ViewDetail'

const { Title, Text } = Typography;
const { Option } = Select;

const courses = [
  {
    code: "S003-Maths",
    title: "Calculus II",
    description: "Introduction of Math",
    instructor: "Thavy",
    schedule: "Mon/Wed 9:00 AM – 10:30 AM",
    room: "Building A, Room 101",
    enrolled: 35,
    capacity: 40,
  },
  {
    code: "S011-Physical",
    title: "Physical II",
    description: "Introduction of physical",
    instructor: "Thavy",
    schedule: "Mon/Wed 9:00 AM – 10:30 AM",
    room: "Building A, Room 101",
    enrolled: 35,
    capacity: 40,
  },
];

const Courses = () => {
const [openDetail, setOpenDetail] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      
      {/* Header */}
      <Row justify="space-between" align="middle">
        <div>
          <Title level={2} style={{ marginBottom: 0 }}>
            Courses
          </Title>
          <Text type="secondary">
            Manage course offerings and schedules
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Add Course
        </Button>
      </Row>

      {/* Filters */}
      <Card style={{ marginTop: 20 }}>
        <Row gutter={16}>
          <Col span={16}>
            <Input
              size="large"
              placeholder="Search courses, codes, or instructors..."
              prefix={<SearchOutlined />}
            />
          </Col>

          <Col span={8}>
            <Select defaultValue="all" size="large" style={{ width: "100%" }}>
              <Option value="all">All Level</Option>
              <Option value="level1">Level 1</Option>
              <Option value="level2">Level 2</Option>
              <Option value="level3">Level 3</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Course Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        {courses.map((course) => (
          <Col xs={24} md={12} key={course.code}>
            <Card bordered>

              <Space>
                <Tag color="blue">{course.code}</Tag>
              </Space>

              <div style={{ float: "right" }}>
                <Tag color="green">active</Tag>
              </div>

              <Title level={4} style={{ marginTop: 12 }}>
                {course.title}
              </Title>

              <Text type="secondary">{course.description}</Text>

              <div style={{ marginTop: 12 }}>
                <Space direction="vertical">
                  <Text>
                    <UserOutlined /> {course.instructor}
                  </Text>

                  <Text>
                    <CalendarOutlined /> {course.schedule}
                  </Text>

                  <Text>
                    <EnvironmentOutlined /> {course.room}
                  </Text>
                </Space>
              </div>

              <hr style={{ margin: "16px 0" }} />

              <Row justify="space-between" align="middle">
                <div>
                  <Text type="secondary">Enrollment</Text>
                  <br />
                  <Text strong style={{ color: "red" }}>
                    {course.enrolled} / {course.capacity}
                  </Text>
                </div>

                <Space>
                  {/* <Button onClick={() => setOpenDetail(true)}>View Details</Button> */}
                  {/* Call ViewDetail */}
                  <ViewDetail
                    open={openDetail}
                    onClose={() => setOpenDetail(false)}
                  />
                  <Button>Manage</Button>
                </Space>
              </Row>

            </Card>
          </Col>
        ))}
      </Row>

      <AddSubject
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />

    </div>
  );
};

export default Courses;