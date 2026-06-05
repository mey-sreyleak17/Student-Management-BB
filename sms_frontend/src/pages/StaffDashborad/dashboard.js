import React, { useEffect, useState } from "react";

import {
  Row,
  Col,
  Card,
  Statistic,
  message,
  Typography,
  Spin,
} from "antd";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import api from "../../Api/indext";

import {
  DollarCircleOutlined,
  WalletOutlined,
  CreditCardOutlined,
  TeamOutlined,
  UserOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

import "../../styles/managementFee.css";

const { Title, Text } = Typography;

const Dashboard = () => {

  const [loading, setLoading] =
    useState(false);

  const [summary, setSummary] =
    useState({
      totalStudents: 0,
      totalTeachers: 0,
      totalEnrollment: 0,
      totalPayments: 0,
      pendingPayments: 0,
      paidStudents: 0,
    });

  // =========================================
  // GET DASHBOARD SUMMARY
  // =========================================

  const getSummary = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem(
          "accessToken"
        );

      const res = await api.get(
        "/dashboard/admin/summary",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setSummary(res.data);

    } catch (error) {

      console.log(error);

      message.error(
        "Failed to load dashboard summary"
      );

    } finally {

      setLoading(false);

    }
  };
  const overviewData = [
  {
    name: "Students",
    total: Number(summary.totalStudents || 0),
  },
  {
    name: "Teachers",
    total: Number(summary.totalTeachers || 0),
  },
  {
    name: "Enrollment",
    total: Number(summary.totalEnrollment || 0),
  },
  {
    name: "Paid",
    total: Number(summary.paidStudents || 0),
  },
  {
    name: "Pending",
    total: Number(summary.pendingPayments || 0),
  },
];

const dashboardCards = [
  {
    title: "Teachers",
    value: summary.totalTeachers,
    subtitle: "Active Teachers",
    icon: <TeamOutlined />,
    gradient: "linear-gradient(135deg,#4f46e5,#7c3aed)",
    shadow: "rgba(79,70,229,.3)",
  },
  {
    title: "Students",
    value: summary.totalStudents,
    subtitle: "Registered Students",
    icon: <UserOutlined />,
    gradient: "linear-gradient(135deg,#059669,#06b6d4)",
    shadow: "rgba(5,150,105,.3)",
  },
  {
    title: "Enrollment",
    value: summary.totalEnrollment,
    subtitle: "Enrollment Records",
    icon: <SolutionOutlined />,
    gradient: "linear-gradient(135deg,#7c3aed,#a855f7)",
    shadow: "rgba(124,58,237,.3)",
  },
  {
    title: "Revenue",
    value: `$${Number(
      summary.totalPayments
    ).toLocaleString()}`,
    subtitle: "Successful Payments",
    icon: <DollarCircleOutlined />,
    gradient: "linear-gradient(135deg,#ea580c,#f97316)",
    shadow: "rgba(234,88,12,.3)",
  },
  {
    title: "Pending",
    value: summary.pendingPayments,
    subtitle: "Waiting Transactions",
    icon: <WalletOutlined />,
    gradient: "linear-gradient(135deg,#d97706,#fbbf24)",
    shadow: "rgba(217,119,6,.3)",
  },
  {
    title: "Paid Students",
    value: summary.paidStudents,
    subtitle: "Payment Completed",
    icon: <CreditCardOutlined />,
    gradient: "linear-gradient(135deg,#db2777,#ec4899)",
    shadow: "rgba(219,39,119,.3)",
  },
];
  useEffect(() => {
    getSummary();
  }, []);

  return (
    <div
      className="page-container"
      style={{
        padding: 30,
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#f3f7ff 0%,#ffffff 100%)",
      }}
    >

      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <div
        style={{
          marginBottom: 30,
        }}
      >
        <Title
          level={2}
          style={{
            marginBottom: 4,
            fontWeight: 800,
            color: "#111827",
          }}
        >
          Staff Dashboard
        </Title>

        <Text
          style={{
            fontSize: 16,
            color: "#6b7280",
          }}
        >
          Summary data and statistics of
          school management system
        </Text>
      </div>

      {/* ================================= */}
      {/* Summary Cards */}
      {/* ================================= */}

      <Spin spinning={loading}>

      <Row gutter={[20, 20]}>
  {dashboardCards.map((card, index) => (
    <Col
      xs={24}
      sm={12}
      md={12}
      lg={8}
      xl={8}
      key={index}
    >
      <Card
  bordered={false}
  hoverable
  style={{
    borderRadius: 20,
    background: card.gradient,
    color: "#fff",
    height: 150,
    boxShadow: `0 10px 25px ${card.shadow}`,
  }}
>
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 16,
                opacity: 0.9,
              }}
            >
              {card.title}
            </div>

            <div
              style={{
                fontSize: 42,
                fontWeight: 800,
                marginTop: 12,
              }}
            >
              {card.value}
            </div>
          </div>

          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 20,
              background:
                "rgba(255,255,255,.18)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 30,
            }}
          >
            {card.icon}
          </div>
        </div>

        <div
          style={{
            marginTop: 30,
            borderTop:
              "1px solid rgba(255,255,255,.2)",
            paddingTop: 15,
          }}
        >
          {card.subtitle}
        </div>
      </Card>
    </Col>
  ))}
</Row>
        <Row gutter={[24, 24]} style={{ marginTop: 30 }}>
  <Col xs={24} lg={16}>
    <Card
      title="School Overview"
      bordered={false}
      style={{
        borderRadius: 24,
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.05)",
      }}
    >
      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <BarChart data={overviewData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="total"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </Col>

  <Col xs={24} lg={8}>
    <Card
      title="Quick Summary"
      bordered={false}
      style={{
        borderRadius: 24,
        height: "100%",
      }}
    >
      <Statistic
        title="Revenue"
        value={summary.totalPayments}
        prefix="$"
      />

      <div style={{ marginTop: 30 }}>
        <Statistic
          title="Paid Students"
          value={summary.paidStudents}
        />
      </div>

      <div style={{ marginTop: 30 }}>
        <Statistic
          title="Pending Payments"
          value={summary.pendingPayments}
        />
      </div>
    </Card>
  </Col>
</Row>
      </Spin>
    </div>
  );
};

export default Dashboard;