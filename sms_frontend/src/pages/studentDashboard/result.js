import React, {
  useEffect,
  useState,
} from "react";

import {
  Table,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Progress,
  Avatar,
  Space,
  Spin,
  message,
} from "antd";

import api from "../../Api/indext";

import {
  TrophyOutlined,
  BookOutlined,
  TeamOutlined,
  RiseOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Score = () => {
  const [loading, setLoading] =
    useState(false);

  const [dataSource, setDataSource] =
    useState([]);

  useEffect(() => {
    getScores();
  }, []);

  const getScores = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "accessToken"
        );

      const res =
        await api.get(
          "/report",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data =
        res.data.map(
          (item, index) => ({
            key: index + 1,
            id:
              item.StudentCode,
            name:
              item.StudentName,
            english:
              item.English || 0,
            math:
              item.Math || 0,
            science:
              item.Science || 0,
            history:
              item.History || 0,
          })
        );

      setDataSource(data);
    } catch (err) {
      console.error(err);

      message.error(
        "Failed to load scores"
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (
    student
  ) => {
    return (
      student.english +
      student.math +
      student.science +
      student.history
    );
  };

  const calculateAverage = (
    student
  ) => {
    return (
      calculateTotal(student) / 4
    ).toFixed(1);
  };

  const getGrade = (avg) => {
    if (avg >= 90) return "A";
    if (avg >= 80) return "B+";
    if (avg >= 70) return "B";
    if (avg >= 60) return "C+";
    return "F";
  };

  const getGradeColor = (
    grade
  ) => {
    if (grade === "A")
      return "green";
    if (grade === "B+")
      return "blue";
    if (grade === "B")
      return "orange";
    if (grade === "C+")
      return "gold";

    return "red";
  };

  const highestAverage =
    dataSource.length > 0
      ? Math.max(
          ...dataSource.map(
            (s) =>
              Number(
                calculateAverage(s)
              )
          )
        )
      : 0;

  const passRate =
    dataSource.length > 0
      ? (
          (dataSource.filter(
            (s) =>
              calculateAverage(
                s
              ) >= 50
          ).length /
            dataSource.length) *
          100
        ).toFixed(1)
      : 0;

  const columns = [
    {
      title: "Student",
      render: (_, record) => (
        <Space>
          <Avatar>
            {record.name?.charAt(
              0
            )}
          </Avatar>

          <div>
            <Text strong>
              {record.name}
            </Text>
            <br />
            <Text type="secondary">
              {record.id}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "English",
      dataIndex: "english",
      align: "center",
    },
    {
      title: "Math",
      dataIndex: "math",
      align: "center",
    },
    {
      title: "Science",
      dataIndex: "science",
      align: "center",
    },
    {
      title: "History",
      dataIndex: "history",
      align: "center",
    },
    {
      title: "Total",
      render: (_, record) => (
        <Text strong>
          {calculateTotal(
            record
          )}
          /400
        </Text>
      ),
    },
    {
      title: "Average",
      render: (_, record) => (
        <Progress
          percent={
            Number(
              calculateAverage(
                record
              )
            )
          }
          size="small"
        />
      ),
    },
    {
      title: "Grade",
      render: (_, record) => {
        const grade =
          getGrade(
            calculateAverage(
              record
            )
          );

        return (
          <Tag
            color={getGradeColor(
              grade
            )}
          >
            {grade}
          </Tag>
        );
      },
    },
  ];

  return (
    <div
      style={{
        padding: 24,
      }}
    >
      <Title level={2}>
        Class Result Summary
      </Title>

      <Row
        gutter={[16, 16]}
        style={{
          marginBottom: 20,
        }}
      >
        <Col span={6}>
          <Card>
            <Statistic
              title="Students"
              value={
                dataSource.length
              }
              prefix={
                <TeamOutlined />
              }
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Highest Average"
              value={
                highestAverage
              }
              suffix="%"
              prefix={
                <TrophyOutlined />
              }
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Subjects"
              value={4}
              prefix={
                <BookOutlined />
              }
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Pass Rate"
              value={passRate}
              suffix="%"
              prefix={
                <RiseOutlined />
              }
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Spin spinning={loading}>
          <Table
            rowKey="id"
            dataSource={
              dataSource
            }
            columns={columns}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default Score;