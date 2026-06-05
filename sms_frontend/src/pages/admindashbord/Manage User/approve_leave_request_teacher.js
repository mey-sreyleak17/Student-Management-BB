import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, message } from "antd";
import api from "../../../Api/indext";

export default function LeaveRequest() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/admin/leave-requests",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      await api.put(
        `/admin/leave-requests/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      message.success("Approved");
      loadRequests();
    } catch (err) {
      message.error("Failed");
    }
  };

  const rejectRequest = async (id) => {
    try {
      await api.put(
        `/admin/leave-requests/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      message.success("Rejected");
      loadRequests();
    } catch (err) {
      message.error("Failed");
    }
  };

  const columns = [
  {
    title: "Teacher Name",
    dataIndex: "Name",
    width: 180,
  },

  {
    title: "Start Date",
    dataIndex: "StartDate",
    render: (date) =>
      new Date(date).toLocaleDateString(),
  },

  {
    title: "End Date",
    dataIndex: "EndDate",
    render: (date) =>
      new Date(date).toLocaleDateString(),
  },

  {
    title: "Reason",
    dataIndex: "Reason",
    ellipsis: true,
  },

  {
    title: "Status",
    dataIndex: "Status",
    render: (status) => (
      <Tag
        color={
          status === "approved"
            ? "green"
            : status === "rejected"
            ? "red"
            : "orange"
        }
      >
        {status.toUpperCase()}
      </Tag>
    ),
  },

  {
    title: "Action",
    width: 200,
    render: (_, record) =>
      record.Status === "pending" ? (
        <Space>
          <Button
            type="primary"
            onClick={() =>
              approveRequest(record.Id)
            }
          >
            Approve
          </Button>

          <Button
            danger
            onClick={() =>
              rejectRequest(record.Id)
            }
          >
            Reject
          </Button>
        </Space>
      ) : (
        <Tag color="blue">
          Completed
        </Tag>
      ),
  },
];
  return (
    <Table
  rowKey="Id"
  loading={loading}
  columns={columns}
  dataSource={data}
  bordered
  pagination={{
    pageSize: 10,
  }}
  scroll={{
    x: 1200,
  }}
/>
  );
}