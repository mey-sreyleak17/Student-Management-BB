import React, { useState } from "react";
import {  Table,  Tag,  Typography,  DatePicker,  Input,  Select,  Button,  Space,  Modal,  Card
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const allData = [
  {
    key: "1",
    day: "Monday",
    date: "2026-05-18",
    time: "10-11AM",
    subject: "English",
    room: "A102",
    teacher: "Thavy",
    status: "Present",
  },
  {
    key: "1",
    day: "Monday",
    date: "2026-05-18",
    time: "10-11AM",
    subject: "English",
    room: "A102",
    teacher: "Thavy",
    status: "Present",
  },
  {
    key: "1",
    day: "Monday",
    date: "2026-05-18",
    time: "10-11AM",
    subject: "English",
    room: "A102",
    teacher: "Thavy",
    status: "Present",
  },

  
];

const TimeTable = () => {
  const [data, setData] = useState(allData);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const applyFilter = ({
    search = "",
    subject = "",
    dates = null,
    todayOnly = false,
  }) => {
    let filtered = [...allData];

    if (search) {
      filtered = filtered.filter((item) =>
        item.subject
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (subject) {
      filtered = filtered.filter(
        (item) => item.subject === subject
      );
    }

    if (dates) {
      const [start, end] = dates;

      filtered = filtered.filter((item) => {
        const d = dayjs(item.date);

        return (
          d.isAfter(start.subtract(1, "day")) &&
          d.isBefore(end.add(1, "day"))
        );
      });
    }

    if (todayOnly) {
      filtered = filtered.filter(
        (item) =>
          item.date === dayjs().format("YYYY-MM-DD")
      );
    }

    setData(filtered);
  };

  const columns = [
    {
      title: "Day",
      dataIndex: "day",
    },
    {
      title: "Time",
      dataIndex: "time",
    },
    {
      title: "Subject",
      dataIndex: "subject",
    },
    {
      title: "Room",
      dataIndex: "room",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = "green";

        if (status === "Permission")
          color = "orange";

        if (status === "Absent")
          color = "red";

        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => {
            setSelected(record);
            setOpen(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Title level={2} style={{ margin: 0 }}>
          Student Timetable
        </Title>

        <Text type="secondary">
          View your personal schedule
        </Text>
      </div>
      <Card>
      <Space
        wrap
        style={{
          width: "100%",
          marginBottom: 20,
          justifyContent: "flex-end" ,
        }}
      >
        
          <RangePicker
            defaultValue={[
              dayjs().subtract(7, "day"),
              dayjs(),
            ]}
            onChange={(dates) =>
              applyFilter({ dates })
            }
          />
        
      </Space>

      <Table
        dataSource={data} columns={columns}
      />
</Card>
      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        title="Class Detail"
      >
        {selected && (
          <>
            <p>
              <b>Subject:</b>{" "}
              {selected.subject}
            </p>

            <p>
              <b>Teacher:</b>{" "}
              {selected.teacher}
            </p>

            <p>
              <b>Room:</b>{" "}
              {selected.room}
            </p>

            <p>
              <b>Time:</b>{" "}
              {selected.time}
            </p>

            <p>
              <b>Status:</b>{" "}
              {selected.status}
            </p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default TimeTable;