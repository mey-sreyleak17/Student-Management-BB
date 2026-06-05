import React, {
  useEffect,
  useState,
} from "react";

import {
  Row,
  Col,
  Card,
  Typography,
  List,
  Spin,
  Empty,
} from "antd";

import {
  TeamOutlined,
  BookOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import api from "../../Api/indext";

const { Title, Text } = Typography;
const TeacherDashboard = () => {

  const [loading, setLoading] =
    useState(false);

  const [dashboard, setDashboard] =
    useState({
      totalClasses: 0,
      totalStudents: 0,
      todayAttendance: 0,
      attendanceRate: 0,
      weeklyAttendance: [],
      todayClasses: [],
    });

  const getDashboard = async () => {
    try {

      setLoading(true);

      const token =
        localStorage.getItem(
          "accessToken"
        );

      const res = await api.get(
        "/dashboard/teacher-sumary",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setDashboard(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };
const chartData =
  dashboard.weeklyAttendance?.length > 0
    ? dashboard.weeklyAttendance
    : [
        { day: "Mon", count: 0 },
        { day: "Tue", count: 0 },
        { day: "Wed", count: 0 },
        { day: "Thu", count: 0 },
        { day: "Fri", count: 0 },
        { day: "Sat", count: 0 },
      ];
  useEffect(() => {
    getDashboard();
  }, []);
    const cards = [
    {
      title: "My Classes",
      value: dashboard.totalClasses,
      icon: <BookOutlined />,
      color:
        "linear-gradient(135deg,#4f46e5,#6366f1)",
    },
    {
      title: "My Students",
      value: dashboard.totalStudents,
      icon: <TeamOutlined />,
      color:
        "linear-gradient(135deg,#10b981,#06b6d4)",
    },
    {
      title: "Attendance Today",
      value:
        dashboard.todayAttendance,
      icon: <CheckCircleOutlined />,
      color:
        "linear-gradient(135deg,#f59e0b,#fbbf24)",
    },
    {
      title: "Attendance Rate",
      value:
        dashboard.attendanceRate +
        "%",
      icon: <BarChartOutlined />,
      color:
        "linear-gradient(135deg,#ec4899,#f472b6)",
    },
  ];
    return (
    <Spin spinning={loading}>
      <div
        style={{
          padding: 24,
          minHeight: "100vh",
          background:
            "#f5f7fb",
        }}
      >
        <Title level={2}>
          Teacher Dashboard
        </Title>

        {/* Cards */}

        <Row gutter={[16, 16]}>
          {cards.map(
            (item, index) => (
              <Col
                xs={24}
                sm={12}
                lg={6}
                key={index}
              >
                <Card
                  bordered={false}
                  style={{
                    borderRadius: 18,
                    background:
                      item.color,
                    color: "#fff",
                    height: 140,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <div>
                      <Text
                        style={{
                          color:
                            "#fff",
                        }}
                      >
                        {
                          item.title
                        }
                      </Text>

                      <Title
                        level={2}
                        style={{
                          color:
                            "#fff",
                          marginTop: 10,
                        }}
                      >
                        {
                          item.value
                        }
                      </Title>
                    </div>

                    <div
                      style={{
                        fontSize: 32,
                      }}
                    >
                      {item.icon}
                    </div>
                  </div>
                </Card>
              </Col>
            )
          )}
        </Row>

        {/* Chart + Classes */}

        <Row
          gutter={[16, 16]}
          style={{
            marginTop: 20,
          }}
        >
          <Col xs={24} lg={16}>
            <Card
              title="Weekly Attendance"
              bordered={false}
              style={{
                borderRadius: 18,
              }}
            >
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="day"
                  />

                  <YAxis />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    fill="#818cf8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title="My Classes"
              bordered={false}
              style={{
                borderRadius: 18,
              }}
            >
              {dashboard.todayClasses
                ?.length ? (
                <List
                  dataSource={
                    dashboard.todayClasses
                  }
                  renderItem={(
                    item
                  ) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          item.ClassName
                        }
                       description={`${item.Shift || "No Shift"} | Room ${item.Room || "-"}`}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default TeacherDashboard;