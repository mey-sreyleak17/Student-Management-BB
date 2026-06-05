import React from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Button,
  Progress,
  Tag,
} from "antd";

import {
  DatabaseOutlined,
  FolderOpenOutlined,
  CloudUploadOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";

import "../../../styles/managementData.css";

const ManagementData = () => {
  const columns = [
    {
      title: "Document",
      dataIndex: "document",
    },
    {
      title: "Student",
      dataIndex: "student",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Date",
      dataIndex: "date",
    },
  ];

  const data = [
    {
      id: 1,
      document: "Birth Certificate",
      student: "John Doe",
      type: "PDF",
      date: "2026-05-10",
    },
    {
      id: 2,
      document: "Transcript",
      student: "Sok Dara",
      type: "DOCX",
      date: "2026-05-11",
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Management Data</h2>
        <Button type="primary">Upload Document</Button>
      </div>

      <Row gutter={[20, 20]}>
        <Col span={6}>
          <Card className="summary-card">
            <Statistic
              title="Total Documents"
              value={1240}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card className="summary-card">
            <Statistic
              title="Uploaded Files"
              value={840}
              prefix={<CloudUploadOutlined />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card className="summary-card">
            <Statistic
              title="Protected Files"
              value={430}
              prefix={<FileProtectOutlined />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card className="summary-card">
            <Statistic
              title="Student Records"
              value={650}
              prefix={<FolderOpenOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col span={8}>
          <Card title="Storage Usage" className="custom-card">
            <Progress type="circle" percent={75} />
            <p className="storage-text">75% Storage Used</p>
          </Card>
        </Col>

        <Col span={16}>
          <Card title="Recent Documents" className="custom-card">
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManagementData;