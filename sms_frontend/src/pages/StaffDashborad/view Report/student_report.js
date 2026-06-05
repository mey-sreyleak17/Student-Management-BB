import React, {
  useState,
  useEffect,
} from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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
  message,
  Spin,
} from "antd";

import {
  SearchOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  TeamOutlined,
  ManOutlined,
  WomanOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export default function StudentReport() {
  const [students, setStudents] =
    useState([]);

  const [classes, setClasses] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  const [selectedClass, setSelectedClass] =
    useState("");

  const [summary, setSummary] =
    useState({
      totalStudents: 0,
      male: 0,
      female: 0,
      totalClasses: 0,
    });

  // ==========================
  // Fetch Classes
  // ==========================
  const fetchClasses = async () => {
    try {
      const token =
        localStorage.getItem(
          "accessToken"
        );

      const res = await api.get(
        "/classes/select",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setClasses(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // Fetch Students
  // ==========================
  const fetchStudents =
    async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem(
            "accessToken"
          );

        const params = {};

        if (selectedClass) {
          params.classId =
            selectedClass;
        }

        const res = await api.get(
          "/students/report",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            params,
          }
        );

        setStudents(
          res.data.list || []
        );

        setSummary(
          res.data.summary || {
            totalStudents: 0,
            male: 0,
            female: 0,
            totalClasses: 0,
          }
        );
      } catch (error) {
        console.log(error);

        message.error(
          "Cannot load student report"
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================
  // Export Excel
  // ==========================
  const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Student Report", 14, 20);

  autoTable(doc,{
    startY:30,
    head:[[
      "#",
      "ID",
      "Student",
      "Gender",
      "Class",
      "Phone"
    ]],

    body: students.map((item,index)=>[
      index + 1,
      item.Id,
      item.KhmerName,
      item.Gender,
      item.ClassName,
      item.Phone || "-"
    ])
  });

  doc.save(
    `student_report_${Date.now()}.pdf`
  );
};
  // ==========================
  // Export PDF
  // ==========================
  const exportExcel = () => {
  
   const excelData = students.map((item,index)=>({
  No: index + 1,
  StudentID: item.Id,
  StudentName: item.KhmerName,
  Gender: item.Gender,
  Class: item.ClassName,
  Phone: item.Phone,
}));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Student Report"
    );
  
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
  
    const fileData = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      }
    );
  
    saveAs(
      fileData,
      `student_report_${Date.now()}.xlsx`
    );
  };

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  // ==========================
  // Search Filter
  // ==========================
  const searchedStudents =
    students.filter(
      (item) =>
        item.KhmerName
          ?.toLowerCase()
          .includes(
            searchText.toLowerCase()
          ) ||
        item.Phone
          ?.toLowerCase()
          .includes(
            searchText.toLowerCase()
          ) ||
        String(item.Id).includes(
          searchText
        )
    );

  // ==========================
  // Columns
  // ==========================
  const columns = [
    {
      title: "#",
      render: (_, __, index) =>
        index + 1,
      width: 70,
      align: "center",
    },

    {
      title: "Student Name",
      dataIndex:
        "KhmerName",
      render: (text) => (
        <Text strong>
          {text}
        </Text>
      ),
    },

    {
      title: "Gender",
      dataIndex: "Gender",
      render: (gender) => (
        <Tag
          color={
            gender ===
            "Female"
              ? "magenta"
              : "blue"
          }
        >
          {gender}
        </Tag>
      ),
    },

    {
      title: "Class",
      dataIndex:
        "ClassName",
    },

    {
      title: "Phone",
      dataIndex: "Phone",
      render: (text) =>
        text || "-",
    },
  ];

  return (
    <div
      style={{
        padding: 24,
        background:
          "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Card
        bordered={false}
        style={{
          borderRadius: 24,
          marginBottom: 24,
          boxShadow:
            "0 8px 24px rgba(0,0,0,0.05)",
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
              Student Report
            </Title>

            <Text
              type="secondary"
            >
              Manage and
              monitor all
              student records.
            </Text>
          </Col>

          <Col>
            <Button
              icon={
                <ReloadOutlined />
              }
              onClick={
                fetchStudents
              }
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Summary */}
      <Row
        gutter={[20, 20]}
        style={{
          marginBottom: 24,
        }}
      >
        <Col
          xs={24}
          sm={12}
          lg={6}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 24,
            }}
          >
            <Statistic
              title="Total Students"
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
          sm={12}
          lg={6}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 24,
            }}
          >
            <Statistic
              title="Male"
              value={
                summary.male
              }
              prefix={
                <ManOutlined />
              }
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={6}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 24,
            }}
          >
            <Statistic
              title="Female"
              value={
                summary.female
              }
              prefix={
                <WomanOutlined />
              }
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={6}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 24,
            }}
          >
            <Statistic
              title="Classes"
              value={
                summary.totalClasses
              }
              prefix={
                <ApartmentOutlined />
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Filter */}
      <Card
        bordered={false}
        style={{
          borderRadius: 24,
          marginBottom: 24,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col
            xs={24}
            md={8}
          >
            <Input
              placeholder="Search Student"
              prefix={
                <SearchOutlined />
              }
              value={
                searchText
              }
              onChange={(e) =>
                setSearchText(
                  e.target
                    .value
                )
              }
            />
          </Col>

          <Col
            xs={24}
            md={8}
          >
            <Select
              style={{
                width: "100%",
              }}
              placeholder="Select Class"
              value={
                selectedClass ||
                undefined
              }
              onChange={(
                value
              ) =>
                setSelectedClass(
                  value
                )
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
            md={8}
          >
            <Space
              style={{
                width:
                  "100%",
              }}
            >
              <Button
                type="primary"
                onClick={
                  fetchStudents
                }
              >
                Search
              </Button>

              <Button
                danger
                onClick={() => {
                  setSearchText(
                    ""
                  );

                  setSelectedClass(
                    ""
                  );

                  fetchStudents();
                }}
              >
                Reset
              </Button>
            </Space>
          </Col>
        </Row>

        <Space
          style={{
            marginTop: 20,
          }}
        >
          <Button
            icon={
              <FileExcelOutlined />
            }
            type="primary"
            onClick={
              exportExcel
            }
          >
            Export Excel
          </Button>

          <Button
            icon={
              <FilePdfOutlined />
            }
            type="primary"
            onClick={
              exportPDF
            }
          >
            Export PDF
          </Button>
        </Space>
      </Card>

      {/* Table */}
      <Card
        bordered={false}
        style={{
          borderRadius: 24,
        }}
      >
        <Spin
          spinning={loading}
        >
          <Table
            columns={
              columns
            }
            dataSource={
              searchedStudents
            }
            rowKey="Id"
            bordered
            scroll={{
              x: 1200,
            }}
            pagination={{
              pageSize: 10,
              showSizeChanger:
                true,
            }}
          />
        </Spin>
      </Card>
    </div>
  );
}