import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import dayjs from "dayjs";

import {

  Card,
  Typography,
  Table,
  Tag,
  Space,
  Input,
  Button,
  Row,
  Col,
  Avatar,
  message,
  DatePicker

} from "antd";

import {

  SearchOutlined,
  ReloadOutlined,
  UserOutlined

} from "@ant-design/icons";

const {
  Title,
  Text
} = Typography;

const ActivityLogs = () => {

  // =====================================
  // STATES
  // =====================================

  const [data, setData] =
  useState([]);

  const [filteredData,
  setFilteredData] =
  useState([]);

  const [loading,
  setLoading] =
  useState(false);

  const [search,
  setSearch] =
  useState("");

  const [selectedDate,
  setSelectedDate] =
  useState(null);

  // =====================================
  // TOKEN
  // =====================================

  const token =
  localStorage.getItem(
    "accessToken"
  );

  // =====================================
  // FETCH LOGS
  // =====================================

  const fetchLogs =
  async (date = null) => {

    try {

      setLoading(true);

      let url =
      "http://localhost:8001/api/activity-logs";

      // DATE FILTER
      if (date) {

        url +=
        `?date=${date}`;

      }

      const res =
      await axios.get(

        url,

        {
          headers: {
            Authorization:
            `Bearer ${token}`
          }
        }

      );

      const logs =
      res.data.data || [];

      setData(logs);

      setFilteredData(logs);

    } catch (error) {

      console.log(error);

      message.error(
        "Failed to load activity logs"
      );

    } finally {

      setLoading(false);

    }

  };

  // =====================================
  // LOAD DATA
  // =====================================

  useEffect(() => {

    fetchLogs();

  }, []);

  // =====================================
  // SEARCH FILTER
  // =====================================

 const handleSearch = (
  value
) => {

  setSearch(value);

  const keyword =
  value.toLowerCase();

  const filtered =
  data.filter((item) =>

    item.action
    ?.toLowerCase()
    .includes(keyword)

  );

  setFilteredData(filtered);

};
  // =====================================
  // TABLE COLUMNS
  // =====================================

  const columns = [

    {
      title: "User",

      dataIndex: "user",

      render: (text) => (

        <Space>

          <Avatar
            icon={
              <UserOutlined />
            }
          />

          <Text strong>
            {text}
          </Text>

        </Space>

      ),

    },

    {
      title: "Action",
      dataIndex: "action",
    },

    {
      title: "Time",
      dataIndex: "time",
    },

    {
      title: "Status",

      dataIndex: "status",

      render: (status) => {

        let color = "blue";

        if (
          status === "Success"
        ) {
          color = "green";
        }

        if (
          status === "Deleted"
        ) {
          color = "red";
        }

        if (
          status === "Updated"
        ) {
          color = "orange";
        }

        return (

          <Tag color={color}>
            {status}
          </Tag>

        );

      },

    },

  ];

  return (

    <div style={{ padding: 0 }}>

      {/* =====================================
          HEADER
      ===================================== */}

      <Col
        style={{
          marginBottom: 10
        }}
      >

        <Title
          level={3}
          style={{ margin: 0 }}
        >
          Activity Logs
        </Title>

        <Text type="secondary">
          Monitor all user
          activities and
          system actions
        </Text>

      </Col>

      {/* =====================================
          CARD
      ===================================== */}

      <Card

        style={{

          borderRadius: 20,

          boxShadow:
          "0 4px 12px rgba(0,0,0,0.08)",

        }}

      >

        {/* =====================================
            TOP BAR
        ===================================== */}

        <Row
          justify="space-between"
          align="middle"
          style={{
            marginBottom: 20
          }}
        >

          <Col flex="auto">

            <Space

              style={{

                display: "flex",

                justifyContent:
                "space-between",

                alignItems:
                "center",

                width: "100%",

              }}

            >

              {/* SEARCH */}

             <Input

  value={search}

  onChange={(e) =>
    handleSearch(
      e.target.value
    )
  }

  placeholder="Search actions like login, create, delete..."

  prefix={
    <SearchOutlined />
  }

  style={{
    width: 350
  }}

/>
              {/* DATE FILTER */}

              <Space>

                <DatePicker

                  value={
                    selectedDate
                  }

                  onChange={(date) => {

                    // RESET
                    if (!date) {

                      setSelectedDate(
                        null
                      );

                      fetchLogs();

                      return;

                    }

                    const formatted =
                    dayjs(date)
                    .format(
                      "YYYY-MM-DD"
                    );

                    setSelectedDate(
                      date
                    );

                    fetchLogs(
                      formatted
                    );

                  }}

                />

                {/* TODAY BUTTON */}

                <Button

                  onClick={() => {

                    const today =
                    dayjs()
                    .format(
                      "YYYY-MM-DD"
                    );

                    setSelectedDate(
                      dayjs()
                    );

                    fetchLogs(today);

                  }}

                >
                  Today
                </Button>

                {/* REFRESH */}

                <Button

                  type="primary"

                  icon={
                    <ReloadOutlined />
                  }

                  onClick={() =>
                    fetchLogs()
                  }

                >
                  Refresh
                </Button>

              </Space>

            </Space>

          </Col>

        </Row>

        {/* =====================================
            TABLE
        ===================================== */}

        <Table

          columns={columns}

          dataSource={
            filteredData
          }

          rowKey="key"

          loading={loading}

          pagination={{
            pageSize: 8
          }}

        />

      </Card>

    </div>

  );

};

export default ActivityLogs;