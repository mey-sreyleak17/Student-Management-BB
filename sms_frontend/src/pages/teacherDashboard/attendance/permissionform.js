import React, { useState } from "react";
import { Modal, Input, DatePicker, Button, message } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import Permission from "./permissionform";
import dayjs from "dayjs";
import api from "../../../Api/indext";

const RequestPermission = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(false);

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleSubmit = async () => {
    if (!form.startDate || !form.endDate || !form.reason) {
      return message.error("All fields are required");
    }

    if (form.startDate > form.endDate) {
      return message.error("Start date cannot be after end date");
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/attendance/teacher/permission",
        {
          startDate: form.startDate,
          EndDate: form.endDate, // Match backend field names
          Reason: form.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      message.success(res.data.message);
      setOpen(false);
      setPermission(true); // disable button after request

      // reset form
      setForm({
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button */}
      <Button
        icon={<CalendarOutlined />}
        size="large"
        disabled={permission}
        onClick={() => setOpen(true)} 
        style={{ width: "150px", height: "90px", borderRadius: "20px",backgroundColor:"pink" }}
      >
        Permission
      </Button>

      {/* Modal */}
      <Modal
        title="Request Permission"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
      >
        <DatePicker
          style={{ width: "100%", marginBottom: 10 }}
          placeholder="Start Date"
          value={form.startDate ? dayjs(form.startDate) : null}
          onChange={(date) =>
            setForm({ ...form, startDate: date?.format("YYYY-MM-DD") })
          }
        />

        <DatePicker
          style={{ width: "100%", marginBottom: 10 }}
          placeholder="End Date"
          value={form.endDate ? dayjs(form.endDate) : null}
          onChange={(date) =>
            setForm({ ...form, endDate: date?.format("YYYY-MM-DD") })
          }
        />

        <Input
          placeholder="Reason"
           style={{ width: "100%", height:80 ,textAlign:"center"}}
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
      </Modal>
    </>
  );
};

export default RequestPermission;
