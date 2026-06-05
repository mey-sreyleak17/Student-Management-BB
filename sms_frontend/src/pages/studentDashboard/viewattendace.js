import React, {
  useEffect,
  useState,
} from "react";

import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  DatePicker,
  Table,
  Tag,
  Progress,
  message,
} from "antd";

import {
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  PercentageOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
import api from "../../Api/indext";
import { useTheme } from "../../context/ThemeContext";

const { Title, Text } =
  Typography;

const { RangePicker } =
  DatePicker;

export default function AttendancePage() {
  const { darkMode } =
    useTheme();

  const [loading,
    setLoading] =
    useState(false);

  const [attendance,
    setAttendance] =
    useState({
      summary: {},
      history: [],
    });

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance =
    async (
      startDate,
      endDate
    ) => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await api.get(
            "/my-attendance",
            {
              params: {
                startDate,
                endDate,
              },
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setAttendance(
          res.data
        );
      } catch (error) {
        console.error(
          error
        );

        message.error(
          "Failed to load attendance"
        );
      } finally {
        setLoading(false);
      }
    };

  const columns = [
    {
      title: "Date",
      dataIndex:
        "AttendanceDate",
      render: (date) =>
        dayjs(date).format(
          "DD MMM YYYY"
        ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (status) => {
        let color =
          "default";

        if (
          status ===
          "Present"
        )
          color = "green";

        if (
          status ===
          "Absent"
        )
          color = "red";

        if (
          status ===
          "Permission"
        )
          color = "orange";

        if (
          status === "Late"
        )
          color = "gold";

        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Remark",
      dataIndex: "Remark",
      render: (text) =>
        text || "-",
    },
  ];

  return (
    <div
      style={{
        minHeight:
          "100vh",
        padding: 24,
        background:
          darkMode
            ? "#0f172a"
            : "#f5f7fb",
      }}
    >
      <Card
        bordered={false}
        style={{
          marginBottom: 24,
          borderRadius: 24,
          background:
            darkMode
              ? "#1e293b"
              : "#fff",
        }}
      >
        <Title
          level={2}
          style={{
            margin: 0,
            color:
              darkMode
                ? "#fff"
                : "#111827",
          }}
        >
          My Attendance
        </Title>

        <Text
          style={{
            color:
              darkMode
                ? "#94a3b8"
                : "#6b7280",
          }}
        >
          Personal attendance summary
        </Text>
      </Card>

      <Row
        gutter={[16, 16]}
      >
        <Col
          xs={24}
          sm={12}
          lg={4}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
            }}
          >
            <Statistic
              title="Total"
              value={
                attendance
                  ?.summary
                  ?.TotalAttendance ||
                0
              }
              prefix={
                <TeamOutlined />
              }
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={4}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
            }}
          >
            <Statistic
              title="Present"
              value={
                attendance
                  ?.summary
                  ?.Present ||
                0
              }
              valueStyle={{
                color:
                  "#52c41a",
              }}
              prefix={
                <CheckCircleOutlined />
              }
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={4}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
            }}
          >
            <Statistic
              title="Absent"
              value={
                attendance
                  ?.summary
                  ?.Absent ||
                0
              }
              valueStyle={{
                color:
                  "#ff4d4f",
              }}
              prefix={
                <CloseCircleOutlined />
              }
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={4}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
            }}
          >
            <Statistic
              title="Permission"
              value={
                attendance
                  ?.summary
                  ?.Permission ||
                0
              }
              valueStyle={{
                color:
                  "#fa8c16",
              }}
              prefix={
                <ClockCircleOutlined />
              }
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={4}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
            }}
          >
            <Statistic
              title="Late"
              value={
                attendance
                  ?.summary
                  ?.Late ||
                0
              }
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={4}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
            }}
          >
            <Statistic
              title="Rate"
              value={
                attendance
                  ?.summary
                  ?.AttendanceRate ||
                0
              }
              
              prefix={
                <PercentageOutlined />
              }
            />
          </Card>
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{
          marginTop: 24,
          borderRadius: 24,
        }}
      >
        <Space
          style={{
            marginBottom: 20,
          }}
        >
          <RangePicker
            onChange={(
              dates
            ) => {
              if (
                !dates
              ) {
                loadAttendance();
                return;
              }

              loadAttendance(
                dates[0].format(
                  "YYYY-MM-DD"
                ),
                dates[1].format(
                  "YYYY-MM-DD"
                )
              );
            }}
          />
        </Space>

        <Progress
          percent={
            attendance
              ?.summary
              ?.AttendanceRate ||
            0
          }
          style={{
            marginBottom: 20,
          }}
        />

        <Table
          rowKey="Id"
          loading={
            loading
          }
          columns={
            columns
          }
          dataSource={
            attendance?.history ||
            []
          }
        />
      </Card>
    </div>
  );
}