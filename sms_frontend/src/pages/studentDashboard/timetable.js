import React,{useState,useEffect} from "react";
import { Table, Typography, Card, Tag } from "antd";
import api from "../../Api/indext";
const { Title, Text } = Typography;


const subjectColor = (subject) => {
  const colors = {
    English: "blue",
    Khmer: "green",
    Math: "purple",
    Science: "cyan",
    History: "orange",
    Biology: "lime",
    Computer: "geekblue",
    PE: "magenta",
    Chemistry: "volcano",
  };

  return colors[subject] || "default";
};

const columns = [
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    fixed: "left",
    width: 180,
    render: (text) => (
      <Text strong style={{ fontSize: 15 }}>
        {text}
      </Text>
    ),
  },
  {
    title: "Monday",
    dataIndex: "monday",
    key: "monday",
    render: (subject) => (
      <Tag
        color={subjectColor(subject)}
        style={{
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {subject}
      </Tag>
    ),
  },
  {
    title: "Tuesday",
    dataIndex: "tuesday",
    key: "tuesday",
    render: (subject) => (
      <Tag
        color={subjectColor(subject)}
        style={{
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {subject}
      </Tag>
    ),
  },
  {
    title: "Wednesday",
    dataIndex: "wednesday",
    key: "wednesday",
    render: (subject) => (
      <Tag
        color={subjectColor(subject)}
        style={{
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {subject}
      </Tag>
    ),
  },
  {
    title: "Thursday",
    dataIndex: "thursday",
    key: "thursday",
    render: (subject) => (
      <Tag
        color={subjectColor(subject)}
        style={{
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {subject}
      </Tag>
    ),
  },
  {
    title: "Friday",
    dataIndex: "friday",
    key: "friday",
    render: (subject) => (
      <Tag
        color={subjectColor(subject)}
        style={{
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {subject}
      </Tag>
    ),
  },
   {
    title: "Saturday",
    dataIndex: "saturday",
    key: "friday",
    render: (subject) => (
      <Tag
        color={subjectColor(subject)}
        style={{
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {subject}
      </Tag>
    ),
  },
];

const TimeTable = () => {
  const [timetableData, setTimetableData] =
  useState([]);

useEffect(() => {
  loadTimetable();
}, []);

const loadTimetable = async () => {
  try {
    const token = localStorage.getItem("accesstoken");

    const res = await api.get(
      "/mytime-table",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = res.data.data;

    const grouped = {};

    data.forEach((item) => {
      const timeKey =
        `${item.StartTime.substring(0, 5)} - ${item.EndTime.substring(0, 5)}`;

      if (!grouped[timeKey]) {
        grouped[timeKey] = {
          key: timeKey,
          time: timeKey,
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
        };
      }

      grouped[timeKey][
        item.DayOfWeek.toLowerCase()
      ] = item.SubjectName;
    });

    setTimetableData(
      Object.values(grouped)
    );
  } catch (error) {
    console.log(error);
  }
};
  return (
    <div
      style={{
        padding: 24,
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <Title
          level={2}
          style={{
            marginBottom: 0,
            fontWeight: 700,
          }}
        >
          Weekly Timetable
        </Title>

        <Text type="secondary">
          Student class schedule for the week
        </Text>
      </div>

      {/* TABLE */}
      <Card
        bordered={false}
        style={{
          borderRadius: 20,
          boxShadow:
            "0 6px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Table
          columns={columns}
          dataSource={timetableData}
          pagination={false}
          bordered={false}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
};

export default TimeTable;