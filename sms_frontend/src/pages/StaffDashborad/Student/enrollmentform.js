import React, { useEffect,useState } from "react";
import {
  Modal,
  Form,
  Select,
  DatePicker,
  Row,
  Col,
  Button,
  message
} from "antd";
import api from "../../../Api/indext";
import dayjs from "dayjs";

const EnrollmentForm = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  mode,
}) => {
  const [form] = Form.useForm();
  // states
   const [stuName, setStuName] = useState([]);
    const [ClassName, SetClassName] = useState([]);
    const [years, setYears] = useState([]);
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

   const fetchClassesName = async () => {

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
              `Bearer ${token}`
          }}
      );

      SetClassName(res.data);

    } catch (error) {

      console.error(error);

      message.error(
        "Failed to load class name"
      );

    }

  };
   const fetchStuName = async () => {

    try {
        const token =
        localStorage.getItem(
          "accessToken"
        );
      const res = await api.get(
        "/students/select",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }}
      );

     setStuName(res.data);

    } catch (error) {

      console.error(error);

      message.error(
        "Failed to load class name"
      );

    }

  };
     useEffect(() => {
        fetchYears();
        fetchClassesName();
        fetchStuName();
      }, []);
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        EnrollmentDate: initialValues.EnrollmentDate
          ? dayjs(initialValues.EnrollmentDate)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const formData = {
      ...values,
      EnrollmentDate:
        values.EnrollmentDate.format("YYYY-MM-DD"),
    };

    onSubmit(formData);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnHidden
      title={
        mode === "update"
          ? "Update Enrollment"
          : mode === "view"
          ? "Enrollment Details"
          : "New Enrollment"
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="ឈ្មោះសិស្ស"
              name="StudentId"
              rules={[{ required: true }]}
            >
              <Select placeholder="ជ្រើសរើសឈ្មោះសិស្ស">
              {stuName.map(item => (
                <Select.Option key={item.Id} value={item.Id}>
                  {item.KhmerName}
                </Select.Option>
              ))}
            </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
                   <Form.Item label="ឈ្មោះថ្នាក់រៀន" name="ClassId" rules={[{ required: true }]}>
            <Select placeholder="ជ្រើសរើសថ្នាក់រៀន">
              {ClassName.map(item => (
                <Select.Option key={item.Id} value={item.Id}>
                  {item.ClassName}
                </Select.Option>
              ))}
            </Select>
            </Form.Item>
                </Col>
          <Col span={12}>
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
          </Col>

          <Col span={12}>
            <Form.Item
              label="ថ្ងៃខែឆ្នាំចុះឈ្មោះ"
              name="EnrollmentDate"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabled={mode === "view"}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="ស្ថានភាព"
              name="Status"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Status"
                disabled={mode === "view"}
                options={[
                  {
                    value: "Active",
                    label: "Active",
                  },
                  {
                    value: "Inactive",
                    label: "Inactive",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {mode !== "view" && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <Button
              onClick={onCancel}
              style={{ marginRight: 10 }}
            >
              Cancel
            </Button>

            <Button type="primary" htmlType="submit">
              {mode === "update"
                ? "Update"
                : "Save"}
            </Button>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default EnrollmentForm;