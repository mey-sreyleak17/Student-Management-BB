import React, {
  useEffect,
  useState
} from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
 import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Select,
  DatePicker,
  Input,
  Statistic,
  message
} from "antd";

import {
  TeamOutlined,
  UserOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";

import api from "../../../Api/indext";

import "../../../styles/report.css";

const { RangePicker } = DatePicker;

export default function TeacherReport() {

  const [teachers, setTeachers] =
    useState([]);

  const [Shift,
    setShift] =
    useState([]);

  const [selectedShift,
    setSelectedShift] =
    useState(null);

  const [dateRange,
    setDateRange] =
    useState([]);

  const [searchText,
    setSearchText] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  useEffect(() => {

    fetchTeachers();

    fetchShift();

  }, []);

  const fetchTeachers =
    async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "accessToken"
          );

        const params = {};

        if (
          selectedShift
        ) {

          params.shiftId =
            selectedShift;
        }

        if (
          dateRange &&
          dateRange.length === 2
        ) {

          params.startDate =
            dateRange[0].format(
              "YYYY-MM-DD"
            );

          params.endDate =
            dateRange[1].format(
              "YYYY-MM-DD"
            );
        }

        const res =
          await api.get(
            "/teachers/report",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
              params,
            }
          );

        setTeachers(
          res.data.list || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  const fetchShift =
    async () => {

      try {

        const res =
          await api.get(
            "/teachers/select-shift"
          );

        setShift(
          res.data || []
        );

      } catch (error) {

        console.log(error);

        message.error(
          "Failed to load shift"
        );

      }

    };

  const exportExcel = () => {

  const excelData =
    teachers.map((item, index) => ({

      No: index + 1,

      TeacherID: item.Id,

      TeacherName: item.Name,

      Gender: item.Gender,

      Department: item.DepartmentName,

      Phone: item.Phone || "-",

      Status: item.Status,

      JoinDate: item.HireDate
    }));

  const worksheet =
    XLSX.utils.json_to_sheet(
      excelData
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Teacher Report"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  const fileData =
    new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      }
    );

  saveAs(
    fileData,
    `teacher_report_${Date.now()}.xlsx`
  );
};

const exportPDF = () => {

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Teacher Report", 14, 20);

  autoTable(doc, {
    startY: 30,

    head: [[
      "#",
      "ID",
      "Teacher Name",
      "Gender",
      "Department",
      "Phone",
      "Status"
    ]],

    body: teachers.map((item, index) => [
      index + 1,
      item.Id,
      item.Name,
      item.Gender,
      item.DepartmentName,
      item.Phone || "-",
      item.Status
    ])
  });

  doc.save(
    `teacher_report_${Date.now()}.pdf`
  );
};
 

const filteredTeachers = teachers.filter(
  (teacher) => {

    const matchName =
      !searchText ||
      teacher.Name
        ?.toLowerCase()
        .includes(
          searchText.toLowerCase()
        );

    const matchShift =
      !selectedShift ||
      teacher.Shift
        ?.toLowerCase()
        .includes(
          selectedShift.toLowerCase()
        );

    return (
      matchName &&
      matchShift
    );
  }
);

  const columns = [
{
      title: "#",
      render: (_, __, index) =>
        index + 1,
      width: 70,
      align: "center",
    },

    {
      title: "Teacher Name",
      dataIndex: "Name",
    },

    {
      title: "Gender",
      dataIndex: "Gender",
    },

    {
      title: "Phone",
      dataIndex: "Phone",
    },

    {
      title: "Shift",
      dataIndex:
        "Shift",
    },

    {
      title: "Address",
      dataIndex:
        "Address",
    },
    {
      title:"Status",
      dataIndex:"Status"
    }
  ];

  return (

    <div
      className="report-page"
    >

      <Row
        gutter={16}
        style={{
          marginBottom: 20,
        }}
      >

        <Col span={12}>
          <Card>
            <Statistic
              title="Total Teachers"
              value={
                teachers.length
              }
              prefix={
                <TeamOutlined />
              }
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <Statistic
              title="Active Teachers"
              value={
                teachers.filter(
                  (t) =>
                    t.Status ===
                    "Active"
                ).length
              }
              prefix={
                <UserOutlined />
              }
            />
          </Card>
        </Col>

      </Row>

      <Card>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom: 20,
          }}
        >

          <h2>
            Teacher Report
          </h2>

          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >

            <Button
  icon={<FilePdfOutlined />}
  onClick={exportPDF}
>
  Export PDF
</Button>

<Button
  icon={<FileExcelOutlined />}
  onClick={exportExcel}
>
  Export Excel
</Button>

          </div>

        </div>

        <Row
          gutter={16}
          style={{
            marginBottom: 20,
          }}
        >

          <Col span={6}>
            <Input
              placeholder="Search Teacher By Name"
              value={searchText}
              onChange={(e) =>
                setSearchText(
                  e.target.value
                )
              }
            />
          </Col>

          <Col span={6}>
            <Select
  placeholder="Select Shift"
  style={{ width: "100%" }}
  value={selectedShift}
  onChange={setSelectedShift}
  allowClear
>
  <Select.Option value="Morning">
    Morning
  </Select.Option>

  <Select.Option value="Afternoon">
    Afternoon
  </Select.Option>

  <Select.Option value="Evening">
    Evening
  </Select.Option>

  <Select.Option value="Morning + Afternoon">
    Morning + Afternoon
  </Select.Option>

  <Select.Option value="Morning + Evening">
    Morning + Evening
  </Select.Option>

  <Select.Option value="Afternoon + Evening">
    Afternoon + Evening
  </Select.Option>

  <Select.Option value="Morning + Afternoon + Evening">
    Morning + Afternoon + Evening
  </Select.Option>
</Select>
          </Col>

          <Col span={8}>
            <RangePicker
              style={{
                width: "100%",
              }}
              onChange={(
                dates
              ) =>
                setDateRange(
                  dates
                )
              }
            />
          </Col>

          <Col span={4}>
            <Button
              type="primary"
              block
              onClick={
                fetchTeachers
              }
            >
              Filter
            </Button>
          </Col>

        </Row>

        <Table
          columns={columns}
          dataSource={
            filteredTeachers
          }
          rowKey="Id"
          loading={loading}
          bordered
          pagination={{
            pageSize: 7,
          }}
        />

      </Card>

    </div>

  );

}