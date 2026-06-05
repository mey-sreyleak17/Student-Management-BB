import React, {
  useState,
  useEffect,
} from "react";

import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  Row,
  Col,
  message,
  Switch,
  Popconfirm
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
} from "@ant-design/icons";

import api from "../../../Api/indext";

const { Option } = Select;

export default function AddUserDrawer({
  fetchData,
  initialValues,
  isEdit = false,
  onSubmit,
}) {

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [role, setRole] =
    useState("");

  const [teachers, setTeachers] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [staffs, setStaffs] =
    useState([]);

  const [form] = Form.useForm();

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    fetchTeachers();
    fetchStudents();
    fetchStaffs();

  }, []);

  // =========================
  // EDIT MODE
  // =========================

  useEffect(() => {

    if (
      initialValues &&
      open
    ) {

      form.setFieldsValue({
        ...initialValues,
        IsActive:
          initialValues.IsActive === 1 ||
          initialValues.IsActive === true,
      });

      setRole(
        initialValues.Role
      );
    }

  }, [
    initialValues,
    open,
  ]);

  // =========================
  // FETCH TEACHERS
  // =========================

  const fetchTeachers =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "accessToken"
          );

        const res =
          await api.get(
            "/teachers/select",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setTeachers(
          res.data.Data ||
          res.data ||
          []
        );

      } catch (err) {

        console.log(err);

      }

    };

  // =========================
  // FETCH STUDENTS
  // =========================

  const fetchStudents =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "accessToken"
          );

        const res =
          await api.get(
            "/students/select",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setStudents(
          res.data.Data ||
          res.data ||
          []
        );

      } catch (err) {

        console.log(err);

      }

    };

  // =========================
  // FETCH STAFFS
  // =========================

  const fetchStaffs =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "accessToken"
          );

        const res =
          await api.get(
            "/staff/select",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setStaffs(
          res.data.Data ||
          res.data ||
          []
        );

      } catch (err) {

        console.log(err);

      }

    };

  // =========================
  // OPEN/CLOSE
  // =========================

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {

    setOpen(false);

    form.resetFields();

    setRole("");

  };

  // =========================
  // SUBMIT
  // =========================

  const onFinish =
    async (values) => {

      try {

        setLoading(true);

        const payload = {
          Name:
            values.Name,
          Email:
            values.Email,
          Password:
            values.Password,
          Role:
            values.Role,
          TeacherId:
            values.TeacherId ||
            null,
          StudentId:
            values.StudentId ||
            null,
          StaffId:
            values.StaffId ||
            null,
          IsActive:
            values.IsActive
              ? 1
              : 0,
        };

        // UPDATE
        if (
          isEdit &&
          onSubmit
        ) {

          await onSubmit(
            payload
          );

        } else {

          // CREATE
          const token =
            localStorage.getItem(
              "accessToken"
            );

          await api.post(
            "/user/create",
            payload,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          message.success(
            "User created successfully"
          );
        }

        form.resetFields();

        setOpen(false);

        if (fetchData) {
          fetchData();
        }

      } catch (err) {

        console.log(err);

        message.error(
          isEdit
            ? "Update failed"
            : "Create failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (
    <>
      {/* BUTTON */}
      <Button
        type={
          isEdit
            ? "default"
            : "primary"
        }
        icon={
          isEdit
            ? <EditOutlined />
            : <PlusOutlined />
        }
        onClick={showDrawer}
      >
        {
          isEdit
            ? "Edit"
            : "Add User"
        }
      </Button>

      {/* DRAWER */}
      <Drawer
        title={
          isEdit
            ? "Update User"
            : "Create User"
        }
        width={520}
        open={open}
        onClose={onClose}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            IsActive: true,
          }}
        >

          <Form.Item
            label="Full Name"
            name="Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="Email"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="Role"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              onChange={(v) =>
                setRole(v)
              }
            >
              <Option value="admin">
                Admin
              </Option>

              <Option value="teacher">
                Teacher
              </Option>

              <Option value="student">
                Student
              </Option>

              <Option value="staff">
                Staff
              </Option>
            </Select>
          </Form.Item>

          {role ===
            "teacher" && (
            <Form.Item
              name="TeacherId"
              label="Teacher"
            >
              <Select>
                {teachers.map(
                  (x) => (
                    <Option
                      key={
                        x.Id
                      }
                      value={
                        x.Id
                      }
                    >
                      {x.Name}
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>
          )}

          {role ===
            "student" && (
            <Form.Item
              name="StudentId"
              label="Student"
            >
              <Select>
                {students.map(
                  (x) => (
                    <Option
                      key={
                        x.Id
                      }
                      value={
                        x.Id
                      }
                    >
                      {
                        x.KhmerName
                      }
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>
          )}

          {role ===
            "staff" && (
            <Form.Item
              name="StaffId"
              label="Staff"
            >
              <Select>
                {staffs.map(
                  (x) => (
                    <Option
                      key={
                        x.Id
                      }
                      value={
                        x.Id
                      }
                    >
                      {x.Name}
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>
          )}

          {!isEdit && (
            <Form.Item
              label="Password"
              name="Password"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            label="Active"
            name="IsActive"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

     <Popconfirm

  title={
    isEdit
      ? "Update User"
      : "Create User"
  }

  description={
    isEdit
      ? "Are you sure you want to update this user?"
      : "Are you sure you want to create this user?"
  }

  okText="Yes"

  cancelText="No"

  onConfirm={() =>
    form.submit()
  }

>

  <Button
    type="primary"
    loading={loading}
    block
  >

    {
      isEdit
        ? "Update User"
        : "Create User"
    }

  </Button>

</Popconfirm>

        </Form>
      </Drawer>
    </>
  );
}