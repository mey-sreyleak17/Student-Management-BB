import React, {
  useState,
  useEffect,
} from "react";

import api from "../../../Api/indext";

import {
  Card,
  Row,
  Col,
  Table,
  Input,
  Button,
  Select,
  Statistic,
  Typography,
  Space,
  Tag,
  Progress,
  DatePicker,
  message,
} from "antd";

import {
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text } =
  Typography;

const { Option } =
  Select;

const { RangePicker } =
  DatePicker;

export default function StudentAttendanceReport() {

  const [loading, setLoading] =
    useState(false);

  const [attendanceData,
    setAttendanceData] =
    useState([]);

  const [classes,
    setClasses] =
    useState([]);

  const [selectedClass,
    setSelectedClass] =
    useState("");

  const [searchText,
    setSearchText] =
    useState("");

  const [dateRange,
    setDateRange] =
    useState([]);

  const [summary,
    setSummary] =
    useState({
      totalStudents: 0,
      present: 0,
      absent: 0,
      permission: 0,
      rate: 0,
    });

  // ====================
  // Load Classes
  // ====================

  const fetchClasses =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "accessToken"
          );

        const res =
          await api.get(
            "/classes/select",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setClasses(
          res.data || []
        );

      } catch (error) {

        console.log(error);

      }

    };

  // ====================
  // Load Attendance
  // ====================

  const fetchAttendance =
    async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "accessToken"
          );

        const params = {};

        if (
          selectedClass
        ) {
          params.classId =
            selectedClass;
        }

        if (
          dateRange &&
          dateRange.length === 2
        ) {

          params.startDate =
            dateRange[0]
              .format(
                "YYYY-MM-DD"
              );

          params.endDate =
            dateRange[1]
              .format(
                "YYYY-MM-DD"
              );

        }

        const res =
          await api.get(
            "/students/attendance-report",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
              params,
            }
          );

        setAttendanceData(
          res.data.list || []
        );

        setSummary(
          res.data.summary || {
            totalStudents: 0,
            present: 0,
            absent: 0,
            permission: 0,
            rate: 0,
          }
        );

      } catch (error) {

        console.log(error);

        message.error(
          "Cannot load attendance report"
        );

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchClasses();
    fetchAttendance();

  }, []);

  // ====================
  // Search
  // ====================

  const filteredData =
    attendanceData.filter(
      (item) =>
        item.KhmerName
          ?.toLowerCase()
          .includes(
            searchText.toLowerCase()
          ) ||
        item.ClassName
          ?.toLowerCase()
          .includes(
            searchText.toLowerCase()
          )
    );

  // ====================
  // Table Columns
  // ====================

  const columns = [
    {
      title: "#",
      width: 70,
      align: "center",
      render: (
        _,
        __,
        index
      ) => index + 1,
    },

    {
      title:
        "Student Name",
      dataIndex:
        "KhmerName",
    },

    {
      title: "Class",
      dataIndex:
        "ClassName",
    },

    {
      title:
        "Present",
      dataIndex:
        "Present",
      align: "center",
      render: (
        value
      ) => (
        <Tag color="green">
          {value}
        </Tag>
      ),
    },

    {
      title:
        "Absent",
      dataIndex:
        "Absent",
      align: "center",
      render: (
        value
      ) => (
        <Tag color="red">
          {value}
        </Tag>
      ),
    },

    {
      title:
        "Permission",
      dataIndex:
        "Permission",
      align: "center",
      render: (
        value
      ) => (
        <Tag color="orange">
          {value}
        </Tag>
      ),
    },

    {
      title:
        "Total Days",
      dataIndex:
        "TotalDays",
      align: "center",
    },

    {
      title:
        "Attendance %",
      render: (
        _,
        record
      ) => {

        const percent =
          record.TotalDays > 0
            ? Math.round(
                (
                  record.Present /
                  record.TotalDays
                ) * 100
              )
            : 0;

        return (
          <Progress
            percent={
              percent
            }
            size="small"
          />
        );

      },
    },
  ];

  return (
    <div
      style={{
        padding: 24,
        background:
          "#f5f7fb",
        minHeight:
          "100vh",
      }}
    >

      {/* Header */}

      <Card
        bordered={false}
        style={{
          borderRadius: 20,
          marginBottom: 20,
        }}
      >
        <Row
          justify="space-between"
          align="middle"
        >

          <Col>
            <Title
              level={2}
              style={{
                margin: 0,
              }}
            >
              Student Attendance Report
            </Title>

            <Text
              type="secondary"
            >
              Monitor student attendance performance.
            </Text>
          </Col>

          <Col>
            <Button
              icon={
                <ReloadOutlined />
              }
              onClick={
                fetchAttendance
              }
            >
              Refresh
            </Button>
          </Col>

        </Row>
      </Card>

      {/* Summary */}

      <Row
        gutter={[16,16]}
      >

        <Col
          xs={24}
          md={12}
          lg={6}
        >
          <Card>
            <Statistic
              title="Students"
              value={
                summary.totalStudents
              }
              prefix={
                <TeamOutlined />
              }
            />
          </Card>
        </Col>

        <Col
          xs={24}
          md={12}
          lg={6}
        >
          <Card>
            <Statistic
              title="Present"
              value={
                summary.present
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
          md={12}
          lg={6}
        >
          <Card>
            <Statistic
              title="Absent"
              value={
                summary.absent
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
          md={12}
          lg={6}
        >
          <Card>
            <Statistic
              title="Permission"
              value={
                summary.permission
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

      </Row>

      {/* Rate */}

      <Card
        style={{
          marginTop:20,
          borderRadius:20,
        }}
      >
        <Row
          justify="space-between"
        >
          <Col>
            <Title
              level={4}
            >
              Attendance Rate
            </Title>
          </Col>

          <Col>
            <Text strong>
              {summary.rate}%
            </Text>
          </Col>
        </Row>

        <Progress
          percent={
            summary.rate
          }
        />
      </Card>

      {/* Filter */}

      <Card
        style={{
          marginTop:20,
          marginBottom:20,
          borderRadius:20,
        }}
      >
        <Row
          gutter={[16,16]}
        >

          <Col
            xs={24}
            md={6}
          >
            <RangePicker
              style={{
                width:"100%",
              }}
              onChange={(
                dates
              ) =>
                setDateRange(
                  dates || []
                )
              }
            />
          </Col>

          <Col
            xs={24}
            md={6}
          >
            <Select
              style={{
                width:"100%",
              }}
              placeholder="Select Class"
              value={
                selectedClass ||
                undefined
              }
              onChange={
                setSelectedClass
              }
              allowClear
            >
              {classes.map(
                (
                  item
                ) => (
                  <Option
                    key={
                      item.Id
                    }
                    value={
                      item.Id
                    }
                  >
                    {
                      item.ClassName
                    }
                  </Option>
                )
              )}
            </Select>
          </Col>

          <Col
            xs={24}
            md={6}
          >
            <Input
              prefix={
                <SearchOutlined />
              }
              placeholder="Search Student"
              value={
                searchText
              }
              onChange={(
                e
              ) =>
                setSearchText(
                  e.target
                    .value
                )
              }
            />
          </Col>

          <Col
            xs={24}
            md={6}
          >
            <Space>
              <Button
                type="primary"
                onClick={
                  fetchAttendance
                }
              >
                Search
              </Button>

              <Button
                danger
                onClick={()=>{
                  setSearchText("");
                  setSelectedClass("");
                  setDateRange([]);
                  fetchAttendance();
                }}
              >
                Reset
              </Button>
            </Space>
          </Col>

        </Row>
      </Card>

      {/* Table */}

      <Card
        bordered={false}
        style={{
          borderRadius:20,
        }}
      >
        <Table
          rowKey="StudentId"
          columns={
            columns
          }
          dataSource={
            filteredData
          }
          loading={
            loading
          }
          pagination={{
            pageSize:10,
            showSizeChanger:true,
          }}
          scroll={{
            x:1200,
          }}
        />
      </Card>

    </div>
  );
}