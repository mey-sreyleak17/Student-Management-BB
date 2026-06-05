import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  List,
  Avatar,
  Spin,
} from "antd";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import api from "../../Api/indext";
const { Title, Text } = Typography;

export default function DashboardMain() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalTeacher: 0,
    totalStudent: 0,
    totalPayment: 0,
    totalClass: 0,
  });

  const [activities, setActivities] = useState([]);
  //const [chartData, setChartData] = useState([]);
  const COLORS = [
  "#1677ff",
  "#52c41a",
  "#faad14",
  "#eb2f96",
];
  const chartData = [
  {
    name: "Students",
    value: stats.totalStudent || 0,
  },
  {
    name: "Teachers",
    value: stats.totalTeacher || 0,
  },
  {
    name: "Classes",
    value: stats.totalClass || 0,
  }
];
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await api.get(
        "/dashboard/admin-summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data.stats);
      setActivities(res.data.activities || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Teacher",
      value: stats.totalTeacher,
      icon: <UserOutlined />,
      color: "linear-gradient(135deg,#1677ff,#4096ff)",
    },
    {
      title: "Total Student",
      value: stats.totalStudent,
      icon: <FileTextOutlined />,
      color: "linear-gradient(135deg,#52c41a,#73d13d)",
    },
    {
      title: "Total Payment",
      value: `$${Number(stats.totalPayment).toLocaleString()}`,
      icon: <DollarOutlined />,
      color: "linear-gradient(135deg,#faad14,#ffc53d)",
    },
    {
      title: "Total Class",
      value: stats.totalClass,
      icon: <HomeOutlined />,
      color: "linear-gradient(135deg,#eb2f96,#ff85c0)",
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
console.log(stats);
console.log(chartData);
  return (
    <div>
      <Title level={3}>Dashboard Overview</Title>

      <Row gutter={[16, 16]}>
        {statCards.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              bordered={false}
              style={{
                borderRadius: 16,
                background: item.color,
                color: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Text style={{ color: "#fff" }}>
                    {item.title}
                  </Text>

                  <Title
                    level={3}
                    style={{
                      color: "#fff",
                      margin: 0,
                    }}
                  >
                    {item.value}
                  </Title>
                </div>

                <Avatar
                  size={50}
                  icon={item.icon}
                  style={{
                    background: "rgba(255,255,255,.2)",
                  }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
 <Card
  title="School Statistics"
  style={{ borderRadius: 16 }}
>
  <ResponsiveContainer
    width="100%"
    height={350}
  >
    <PieChart>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={120}
        dataKey="value"
        label={({ name, percent }) =>
          `${name} ${(percent * 100).toFixed(0)}%`
        }
      >
        {chartData.map((entry, index) => (
          <Cell
            key={index}
            fill={
              COLORS[index % COLORS.length]
            }
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Recent Activity"
            style={{ borderRadius: 16 }}
          >
            <List
              dataSource={activities}
              locale={{
                emptyText: "No Activity",
              }}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<UserOutlined />}
                        style={{
                          backgroundColor:
                            "#1677ff",
                        }}
                      />
                    }
                    title={item.Description}
                    description={new Date(
                      item.CreatedAt
                    ).toLocaleString()}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}