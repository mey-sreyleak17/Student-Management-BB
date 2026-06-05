import React, { useState } from "react";
import {Table,Card,InputNumber,Typography,Space,Button,DatePicker,Select,
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const ScoreList = () => {
  const baseStudents = [
    { key: "1", id: "00001", name: "Von Chanthavy" },
    { key: "2", id: "00002", name: "Mey Sreyleak" },
  ];

  //  Level + Class
  const levels = [
    {
      id: "l1",
      name: "Level 1",
      classes: [
        { id: "c1", name: "English Part Time " },
        { id: "c2", name: "English Full Time " },
      ],
    },
    {
      id: "l2",
      name: "Level 2",
      classes: [{ id: "c3", name: "English Part Time" }],
    },
    {
      id: "l3",
      name: "Level 3",
      classes: [{ id: "c4", name: "English Part Time" }],
    },
  ];
  const [selectedLevel, setSelectedLevel] = useState("l1");
  const [selectedClass, setSelectedClass] = useState("c1");
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const monthKey = selectedMonth.format("YYYY-MM");
  const dataKey = `${selectedLevel}_${selectedClass}_${monthKey}`;

  const [scoresByMonth, setScoresByMonth] = useState({
    [dataKey]: baseStudents,
  });

  const data = scoresByMonth[dataKey] || [];

  const handleScoreChange = (value, record, field) => {
    const newData = data.map((student) => {
      if (student.key === record.key) {
        return { ...student, [field]: value };
      }
      return student;
    });

    setScoresByMonth((prev) => ({
      ...prev,
      [dataKey]: newData,
    }));
  };

  //  process
  const processedData = data
    .map((item) => {
      const homework = item.homework ?? 0;
      const listening = item.listening ?? 0;
      const reading = item.reading ?? 0;
      const exam = item.exam ?? 0;

      const total = homework + listening + reading + exam;
      const average = total / 4;

      let grade = "F";
      if (average >= 90) grade = "A";
      else if (average >= 80) grade = "B";
      else if (average >= 70) grade = "C";
      else if (average >= 60) grade = "D";

      return { ...item, total, average, grade };
    })
    .sort((a, b) => b.average - a.average)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  //  change month
  const handleMonthChange = (date) => {
    if (!date) return;

    setSelectedMonth(date);

    const newKey = `${selectedLevel}_${selectedClass}_${date.format(
      "YYYY-MM"
    )}`;

    setScoresByMonth((prev) => ({
      ...prev,
      [newKey]: prev[newKey] || baseStudents,
    }));
  };

  //  change level
  const handleLevelChange = (val) => {
    setSelectedLevel(val);

    const firstClass = levels.find((l) => l.id === val).classes[0];
    setSelectedClass(firstClass.id);

    const newKey = `${val}_${firstClass.id}_${monthKey}`;

    setScoresByMonth((prev) => ({
      ...prev,
      [newKey]: prev[newKey] || baseStudents,
    }));
  };

  //  change class
  const handleClassChange = (val) => {
    setSelectedClass(val);

    const newKey = `${selectedLevel}_${val}_${monthKey}`;

    setScoresByMonth((prev) => ({
      ...prev,
      [newKey]: prev[newKey] || baseStudents,
    }));
  };

  
  const scoreColumn = (title, field) => ({
    title,
    dataIndex: field,
    align: "center",
    render: (value, record) => (
      <InputNumber
        min={0}
        max={100}
        value={value}
        onChange={(v) => handleScoreChange(v, record, field)}
        style={{ width: "100%" }}
      />
    ),
  });

  const columns = [
    { title: "ID", dataIndex: "id", width: 100 },
    { title: "Name", dataIndex: "name", width: 200 },

    scoreColumn("Homework", "homework"),
    scoreColumn("Listening", "listening"),
    scoreColumn("Reading", "reading"),
    scoreColumn("Exam", "exam"),

    { title: "Total", dataIndex: "total", align: "center" },
    {
      title: "Average",
      dataIndex: "average",
      align: "center",
      render: (avg) => avg.toFixed(1),
    },
    { title: "Grade", dataIndex: "grade", align: "center" },
    { title: "Rank", dataIndex: "rank", align: "center" },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* HEADER */}
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Score Management
          </Title>
          <Text type="secondary">
            Manage score by level, class and month
          </Text>
        </div>

        <Space>
          {/* LEVEL */}
          <Select
            value={selectedLevel}
            onChange={handleLevelChange}
            style={{ width: 140 }}
          >
            {levels.map((lvl) => (
              <Option key={lvl.id} value={lvl.id}>
                {lvl.name}
              </Option>
            ))}
          </Select>

          {/* CLASS */}
          <Select
            value={selectedClass}
            onChange={handleClassChange}
            style={{ width: 200 }}
          >
            {levels
              .find((l) => l.id === selectedLevel)
              .classes.map((cls) => (
                <Option key={cls.id} value={cls.id}>
                  {cls.name}
                </Option>
              ))}
          </Select>

          {/* MONTH */}
          <DatePicker
            picker="month"
            value={selectedMonth}
            onChange={handleMonthChange}
          />

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          >
            Export
          </Button>

          <Button type="primary">Save</Button>
        </Space>
      </Space>

      {/* TITLE */}
      <Title level={5}>
        {levels.find((l) => l.id === selectedLevel)?.name} -{" "}
        {
          levels
            .find((l) => l.id === selectedLevel)
            ?.classes.find((c) => c.id === selectedClass)?.name
        }{" "}
        ({selectedMonth.format("MMMM YYYY")})
      </Title>

      {/* TABLE */}
      <Card style={{ marginTop: 12, borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={processedData}
          pagination={false}
          bordered
        />
      </Card>
    </div>
  );
};

export default ScoreList;