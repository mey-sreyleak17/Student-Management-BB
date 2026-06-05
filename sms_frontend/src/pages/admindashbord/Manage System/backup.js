import React, {
  useEffect,
  useState,
} from "react";

import api from "../../../Api/indext";

import {
  Layout,
  Card,
  Typography,
  Button,
  Space,
  Table,
  Tag,
  Switch,
  Select,
  Upload,
  message,
  Divider,
  Row,
  Col,
  Statistic,
  Popconfirm,
} from "antd";

import {
  DownloadOutlined,
  UploadOutlined,
  SyncOutlined,
  DeleteOutlined,
  DatabaseOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";

const { Title, Text } =
  Typography;

const { Content } = Layout;

const { Option } = Select;

export default function BackupSettings() {

  const [loading,
  setLoading] =
    useState(false);

  const [backups,
  setBackups] =
    useState([]);

  const [autoBackup,
  setAutoBackup] =
    useState(true);

  const [frequency,
  setFrequency] =
    useState("daily");

  // =====================
  // GET BACKUPS
  // =====================

  const getBackups =
    async () => {

    try {

      const res =
        await api.get(
          "/backup"
        );

      setBackups(
        res.data.backups
      );

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {
    getBackups();
  }, []);

  // =====================
  // CREATE BACKUP
  // =====================

const createBackup =
async () => {

  try {

    setLoading(true);

    await api.post(
      "/backup/create"
    );

    message.success(
      "Backup uploaded to Google Drive"
    );

    // refresh table

    getBackups();

  } catch (error) {

    console.log(error);

    message.error(
      "Backup failed"
    );

  } finally {

    setLoading(false);
  }
};
  // =====================
  // DELETE
  // =====================

  const deleteBackup =
    async (id) => {

    try {

      await api.delete(
        `/backup/${id}`
      );

      message.success(
        "Backup deleted"
      );

      getBackups();

    } catch (error) {

      console.log(error);
    }
  };

  // =====================
  // TABLE
  // =====================

  const columns = [

  {
    title: "Backup",
    dataIndex: "FileName",
  },

  {
    title: "Size",
    dataIndex: "FileSize",
  },

  {
    title: "Date",

    dataIndex: "CreatedAt",

    render: (date) => (

      new Date(date)
        .toLocaleString()

    ),
  },

  {
    title: "Type",

    dataIndex: "BackupType",

    render: (type) => (

      <Tag color="blue">

        {type}

      </Tag>
    ),
  },

  {
    title: "Status",

    dataIndex: "Status",

    render: (status) => (

      <Tag
        color={
          status ===
          "Completed"

            ? "green"

            : "red"
        }
      >

        {status}

      </Tag>
    ),
  },

  {
    title: "Actions",

    render: (_, record) => (

      <Space>

        <Button
          icon={
            <DownloadOutlined />
          }
        >

          Download

        </Button>

        <Popconfirm
          title="Delete backup?"

          onConfirm={() =>
            deleteBackup(
              record.Id
            )
          }
        >

          <Button
            danger

            icon={
              <DeleteOutlined />
            }
          >

            Delete

          </Button>

        </Popconfirm>

      </Space>
    ),
  },
];
  return (

    <Layout
      style={{
        background: "#fff",
      }}
    >

      <Content>

        {/* HEADER */}

        <div
          style={{
            marginBottom: 25,
          }}
        >

          <Title level={2}>

            Backup Management

          </Title>

          <Text type="secondary">

            Protect and restore
            your school system
            data

          </Text>

        </div>

        {/* STATS */}

        <Row
          gutter={20}
          style={{
            marginBottom: 25,
          }}
        >

          <Col span={8}>

            <Card>

              <Statistic
                title="Total Backups"

                value={
                  backups.length
                }

                prefix={
                  <DatabaseOutlined />
                }
              />

            </Card>

          </Col>

          <Col span={8}>

            <Card>

              <Statistic
                title="Auto Backup"

                value={
                  autoBackup
                    ? "Enabled"
                    : "Disabled"
                }
              />

            </Card>

          </Col>

          <Col span={8}>

            <Card>

              <Statistic
                title="Frequency"

                value={
                  frequency
                }
              />

            </Card>

          </Col>

        </Row>

        {/* BACKUP TABLE */}

        <Card
          style={{
            borderRadius: 15,
            marginBottom: 25,
          }}

          extra={

            <Button
  type="primary"

  loading={loading}

  icon={<SyncOutlined />}

  onClick={createBackup}
>

  Create Backup

</Button>
          }
        >

         <Table
  loading={loading}
  columns={columns}
  dataSource={backups}
  rowKey="Id"
/>

        </Card>

        {/* SETTINGS */}

        <Card
          title="Auto Backup Settings"

          style={{
            borderRadius: 15,
            marginBottom: 25,
          }}
        >

          <Space
            direction="vertical"
            size="large"
          >

            <div>

              <Text strong>

                Enable Auto Backup

              </Text>

              <br />

              <Switch
                checked={
                  autoBackup
                }

                onChange={
                  setAutoBackup
                }
              />

            </div>

            <div>

              <Text strong>

                Backup Frequency

              </Text>

              <br />

              <Select
                value={frequency}

                style={{
                  width: 220,
                }}

                onChange={
                  setFrequency
                }
              >

                <Option value="daily">
                  Daily
                </Option>

                <Option value="weekly">
                  Weekly
                </Option>

                <Option value="monthly">
                  Monthly
                </Option>

              </Select>

            </div>

          </Space>

        </Card>

        {/* RESTORE */}

        <Card
          title="Restore Backup"

          style={{
            borderRadius: 15,
          }}
        >

          <Upload
            beforeUpload={() => false}

            showUploadList={false}

            onChange={() =>
              message.success(
                "Backup restored"
              )
            }
          >

            <Button
              icon={
                <CloudUploadOutlined />
              }
            >

              Upload Backup File

            </Button>

          </Upload>

        </Card>

      </Content>

    </Layout>
  );
}