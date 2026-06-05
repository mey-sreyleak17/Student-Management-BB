import React, {
  useState,
  useEffect
} from "react";

import {
  Modal,
  Form,
  Input,
  Select,
  message,
  Col
} from "antd";

import api from "../../../../Api/indext";

export default function ClassForm({
  open,
  onCancel,
  onSubmit,
  initialValues,
  mode
}) {

  const [form] = Form.useForm();
  const { Option } = Select;
  // states
  const [teachers, setTeachers] = useState([]);
  const [levels, setLevels] = useState([]);
  const [years, setYears] = useState([]);
  const [Program, setProgram] = useState([]);

  // =========================================
  // SUBMIT
  // =========================================
  const handleOk = async () => {

    try {

      const values =
        await form.validateFields();

      await onSubmit(values);

      form.resetFields();

    } catch (err) {

      console.error(
        "Validation failed:",
        err
      );

    }

  };


  // =========================================
  // FETCH TEACHERS
  // =========================================
  const fetchTeachers = async () => {

    try {

      const token =
        localStorage.getItem(
          "accessToken"
        );

      const res = await api.get(
        "/teachers/select",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setTeachers(res.data);

    } catch (error) {

      console.error(
        "Error fetching teachers:",
        error
      );

      message.error(
        "Failed to load teachers"
      );

    }

  };


  // =========================================
  // FETCH LEVELS
  // =========================================
  const fetchLevels = async () => {

    try {

      const res = await api.get(
        "/levels/select"
      );

      setLevels(res.data);

    } catch (error) {

      console.error(error);

      message.error(
        "Failed to load levels"
      );

    }

  };


  // =========================================
  // FETCH YEARS
  // =========================================
  const fetchYears = async () => {

    try {

      const res = await api.get(
        "/academic/select"
      );

      setYears(res.data);

    } catch (error) {

      console.error(error);

      message.error(
        "Failed to load academic years"
      );

    }

  };


  const selectProgram = async () => {

    try {

      const res = await api.get(
        "/programs/select"
      );

      setProgram(res.data);

    } catch (error) {

      console.error(error);

      message.error(
        "Failed to load academic years"
      );

    }

  };
  // =========================================
  // LOAD DATA
  // =========================================
  useEffect(() => {

    fetchTeachers();
    fetchLevels();
    fetchYears();
    selectProgram();

  }, []);


  return (

    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnHidden
      title={
        mode === "add"
          ? "Add new Class"
          : mode === "update"
          ? "Update Class"
          : "Delete Class"
      }
    >

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >

        {/* CLASS NAME */}
        <Form.Item
          name="ClassName"
          label="ឈ្មោះថ្នាក់"
          rules={[
            {
              required: true,
              message:
                "Please enter class name"
            }
          ]}
        >
          <Input />
        </Form.Item>


        {/* TEACHER */}
        <Form.Item
          name="TeacherId"
          label="ឈ្មោះគ្រូ"
          rules={[
            {
              required: true,
              message:
                "Please select teacher"
            }
          ]}
        >
          <Select
            placeholder="Select Teacher"
            options={teachers.map(
              (item) => ({
                value: item.Id,
                label: item.KhmerName
              })
            )}
          />
        </Form.Item>


        {/* LEVEL */}
        <Form.Item
          name="LevelId"
          label="កម្រិតថ្នាក់"
          rules={[
            {
              required: true,
              message:
                "Please select level"
            }
          ]}
        >
          <Select
            placeholder="Select Level"
            options={levels.map(
              (item) => ({
                value: item.Id,
                label: item.LevelName
              })
            )}
          />
        </Form.Item>
     <Form.Item
              name="ProgramId"
              label="Program Name"
              rules={[
                {
                  required: true,
                  message:
                    "Please select program Name"
                }
              ]}
            >
              <Select
                placeholder="Select program"
                options={Program.map(
                  (item) => ({
                    value: item.Id,
                    label: item.ProgramName
                  })
                )}
              />
            </Form.Item>


        {/* ACADEMIC YEAR */}
        
             
              <Form.Item
                label="Shift"
                name="Shift"
                rules={[
                  {
                    required: true,
                    message: "Please select shift",
                  },
                ]}
              >
                <Select
                  placeholder="Select shift"
                  size="large"
                >
                  <Option value="Morning">
                    Morning
                  </Option>

                  <Option value="Afternoon">
                    Afternoon
                  </Option>

                  <Option value="Evening">
                    Evening
                  </Option>
                </Select>
              </Form.Item>
           <Form.Item
          name="Room"
          label="ឈ្មោះបន្ទប់រៀន"
          rules={[
            {
              required: true,
              message:
                "Please enter class name"
            }
          ]}
        >
          <Input />
        </Form.Item>
            <Form.Item
          name="AcademicYearId"
          label="ឆ្នាំសិក្សា"
          rules={[
            {
              required: true,
              message:
                "Please select academic year"
            }
          ]}
        >
          <Select
            placeholder="Select Academic Year"
            options={years.map(
              (item) => ({
                value: item.Id,
                label: item.Name
              })
            )}
          />
        </Form.Item>
      </Form>

    </Modal>

  );

}