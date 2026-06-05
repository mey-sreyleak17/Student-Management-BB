import React, { useEffect, useState } from "react";
import api from "../../../Api/indext";
import {
  Card,
  Row,
  Col,
  Table,
  Typography,
  Tag,
  Select,
  DatePicker,
  Input,
  Button,
  Statistic,
  Space,
  message,
  Spin,
} from "antd";

import {
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const PaymentReport = () => {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalPaid: 0,
    totalPending: 0,
    totalFailed: 0,
  });

  const [filters, setFilters] = useState({
    Status: "",
    PaymentMethod: "",
    StudentId: "",
    StartDate: "",
    EndDate: "",
  });

  // =========================
  // Fetch Payment Report
  // =========================
  const fetchPaymentReport = async (customFilters = filters) => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    // remove empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(customFilters).filter(
        ([_, value]) =>
          value !== "" &&
          value !== null &&
          value !== undefined
      )
    );

    console.log("Sending Filters => ", cleanFilters);

    const response = await api.get(
      "/payments/report",
      {
        params: cleanFilters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setPayments(response.data.data || []);
    setSummary(response.data.summary || {});
  } catch (error) {
    console.log(error);
    message.error("Cannot load payment report");
  } finally {
    setLoading(false);
  }
};
const exportExcel = () => {

  const excelData = payments.map((item, index) => ({
    No: index + 1,
    Student: item.StudentName,
    Fee: item.FeeName,
    Amount: item.Amount,
    Currency: item.Currency,
    Method: item.PaymentMethod,
    Status: item.Status,
    TransactionId: item.TransactionId,
    PaymentDate: item.PaymentDate
      ? dayjs(item.PaymentDate).format("DD/MM/YYYY hh:mm A")
      : "-",
    Remark: item.Remark || "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Payment Report"
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
    `payment_report_${Date.now()}.xlsx`
  );
};

const exportPDF = () => {

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text("Payment Report", 14, 20);

  autoTable(doc, {
    startY: 30,

    head: [[
      "#",
      "Student",
      "Fee",
      "Amount",
      "Method",
      "Status",
      "Date",
    ]],

    body: payments.map((item, index) => [
      index + 1,
      item.StudentName,
      item.FeeName,
      `${item.Amount} ${item.Currency}`,
      item.PaymentMethod,
      item.Status,
      item.PaymentDate
        ? dayjs(item.PaymentDate).format(
            "DD/MM/YYYY"
          )
        : "-",
    ]),
  });

  doc.save(
    `payment_report_${Date.now()}.pdf`
  );
};
  useEffect(() => {
    fetchPaymentReport();
  }, []);

  // =========================
  // Status Tag Color
  // =========================
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "green";
      case "pending":
        return "orange";
      case "failed":
        return "red";
      case "cancelled":
        return "default";
      default:
        return "blue";
    }
  };

  // =========================
  // Table Columns
  // =========================
  const columns = [
    {
      title: "#",
      render: (_, __, index) => index + 1,
      width: 70,
      align: "center",
    },
    {
      title: "Student",
      dataIndex: "StudentName",
      key: "StudentName",
      render: (text) => (
        <Text strong style={{ color: "#1e293b" }}>
          {text || "N/A"}
        </Text>
      ),
    },
    {
      title: "Fee",
      dataIndex: "FeeName",
      key: "FeeName",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "Amount",
      render: (amount, record) => (
        <Text strong style={{ color: "#16a34a" }}>
          {Number(amount).toLocaleString()} {record.Currency}
        </Text>
      ),
    },
    {
      title: "Method",
      dataIndex: "PaymentMethod",
      key: "PaymentMethod",
      render: (method) => (
        <Tag
          color="processing"
          style={{
            borderRadius: 20,
            paddingInline: 12,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {method}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (status) => (
        <Tag
          color={getStatusColor(status)}
          style={{
            borderRadius: 20,
            paddingInline: 14,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "TransactionId",
      key: "TransactionId",
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
  title: "Payment Date",
  dataIndex: "PaymentDate",
  key: "PaymentDate",
  render: (date) =>
    date
      ? new Date(date).toLocaleString()
      : "-"
},
    {
      title: "Remark",
      dataIndex: "Remark",
      key: "Remark",
      ellipsis: true,
      render: (text) => text || "-",
    },
  ];

  return (
    <div
      style={{
        padding: 24,
        background: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Card
        bordered={false}
        style={{
          borderRadius: 24,
          marginBottom: 24,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Payment Report
            </Title>
            <Text type="secondary">
              Manage and monitor all student payment transactions.
            </Text>
          </Col>

          <Col>
            <Button
              icon={<ReloadOutlined />}
              size="large"
              onClick={() => fetchPaymentReport(filters)}
              style={{
                borderRadius: 14,
                height: 46,
                paddingInline: 22,
                fontWeight: 600,
              }}
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Summary Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: 24,
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            }}
          >
            <Statistic
              title="Total Amount"
              value={summary.totalAmount || 0}
              precision={2}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: 24,
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            }}
          >
            <Statistic
              title="Paid"
              value={summary.totalPaid || 0}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: 24,
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            }}
          >
            <Statistic
              title="Pending"
              value={summary.totalPending || 0}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: 24,
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            }}
          >
            <Statistic
              title="Failed"
              value={summary.totalFailed || 0}
              prefix={<CloseCircleOutlined />}
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
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search Student ID"
              size="large"
              value={filters.StudentId}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  StudentId: e.target.value,
                })
              }
              prefix={<SearchOutlined />}
              style={{ borderRadius: 14 }}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Select Status"
              size="large"
              value={filters.Status || undefined}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  Status: value,
                })
              }
              style={{ width: "100%" }}
            >
              <Option value="paid">Paid</Option>
              <Option value="pending">Pending</Option>
              <Option value="failed">Failed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Payment Method"
              size="large"
              value={filters.PaymentMethod || undefined}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  PaymentMethod: value,
                })
              }
              style={{ width: "100%" }}
            >
              <Option value="cash">Cash</Option>
              <Option value="bakong">Bakong</Option>
              <Option value="aba">ABA</Option>
              <Option value="acleda">ACLEDA</Option>
              <Option value="card">Card</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <RangePicker
              size="large"
              style={{ width: "100%", borderRadius: 14 }}
              onChange={(dates) => {
                setFilters({
                  ...filters,
                  StartDate: dates?.[0]
                    ? dayjs(dates[0]).format("YYYY-MM-DD")
                    : "",
                  EndDate: dates?.[1]
                    ? dayjs(dates[1]).format("YYYY-MM-DD")
                    : "",
                });
              }}
            />
          </Col>
        </Row>
 
        <Space style={{ marginTop: 20 }}>
          <Button
            type="primary"
            size="large"
            onClick={() => fetchPaymentReport(filters)}
            style={{
              borderRadius: 14,
              height: 46,
              paddingInline: 30,
              fontWeight: 600,
            }}
          >
            Search
          </Button>

              <Button
                type="primary"
                size="large"
                onClick={exportExcel}
                style={{
                 borderRadius: 14,
                  height: 46,
                  paddingInline: 30,
                fontWeight: 600,
               }}
              >
              Export Excel
              </Button>

<Button
  type="primary"
  size="large"
  onClick={exportPDF}
  style={{
    borderRadius: 14,
    height: 46,
    paddingInline: 30,
    fontWeight: 600,
  }}
>
  Export PDF
</Button>

          <Button
  danger
  size="large"
  onClick={() => {
    const resetFilter = {
      Status: "",
      PaymentMethod: "",
      StudentId: "",
      StartDate: "",
      EndDate: "",
    };

    setFilters(resetFilter);
    fetchPaymentReport(resetFilter);
  }}
>
  Reset
</Button>
        </Space>
      </Card>

      {/* Table */}
      <Card
        bordered={false}
        style={{
          borderRadius: 24,
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        }}
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={payments}
            rowKey="Id"
            bordered
            scroll={{ x: 1300 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default PaymentReport;