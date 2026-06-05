import { Modal, Form, Input, Button, Upload, DatePicker,Select,Row,Col ,message} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../Api/indext";
import React,{useEffect,useState} from "react";
export default function StudentForm({ open, onCancel, onSubmit, initialValues ,mode}) {
  const [form] = Form.useForm();
  // states
    const [classes, setClassed] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const { Option } = Select;

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("Name", values.Name);
      formData.append("KhmerName", values.KhmerName);
      formData.append("Gender", values.Gender);

      if (values.DOB) {
        formData.append("DOB", values.DOB.format("YYYY-MM-DD"));
      }

      formData.append("ClassId", values.ClassId);
      formData.append("TeacherId", values.TeacherId);
      formData.append("DadName", values.DadName);
      formData.append("MomName", values.MomName);
      formData.append("Address", values.Address);
      formData.append("Phone", values.Phone);

formData.append(
  "ProgramId",
  values.ProgramId
);

formData.append(
  "LevelId",
  values.LevelId
);

formData.append(
  "ProgramType",
  values.ProgramType
);

formData.append(
  "CurrentFeeId",
  values.CurrentFeeId
);
      if (values.Image && values.Image.length > 0) {
        formData.append("Image", values.Image[0].originFileObj);
      }

      await onSubmit(formData);
      form.resetFields();
    } catch (err) {
      console.error("Validation or submit failed:", err);
    }
  };
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

      setClassed(res.data);

    } catch (error) {

      console.error(error);

      message.error(
        "Failed to load class name"
      );

    }

  };

useEffect(() => {

    fetchTeachers();
    fetchClassesName();

  }, []);


  return (
    <Modal
  open={open}
  onCancel={onCancel}
  onOk={handleOk}
  title={
    mode === "view"
      ? "View Student"
      : mode === "update"
      ? "Update Student"
      : "Add Student"
  }
  destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...initialValues,
          DOB: initialValues?.DOB ? dayjs(initialValues.DOB) : null,
          Image: initialValues?.Image
            ? [
                {
                  uid: "-1",
                  name: "existing.png",
                  status: "done",
                  url: initialValues.Image, // backend URL for preview
                },
              ]
            : [],
        }}
      >
      <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="Name" label="ឈ្មោះឡាតាំង" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="KhmerName" label="ឈ្មោះខែ្មរ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      </Row>
      <Row gutter={16}>
      <Col span={12}>
          <Form.Item
          name="Gender"
          label="ជ្រើសរើសភេទ"
          rules={[{ required: true, message: "Please select a gender" }]}
              >
          <Select placeholder="Select gender">
            <Option value="Male">ប្រុស</Option>
            <Option value="Female">ស្រី</Option>
            <Option value="Other">ផ្សេងៗ</Option>
            </Select>
            </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="DOB" label="ថ្ងៃ​ ខែ ឆ្នាំកំណើត" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

      </Col>
      <Col span={12}>
         <Form.Item label="ឈ្មោះថ្នាក់រៀន" name="ClassId" rules={[{ required: true }]}>
  <Select placeholder="ជ្រើសរើសថ្នាក់រៀន">
    {classes.map(item => (
      <Select.Option key={item.Id} value={item.Id}>
        {item.ClassName}
      </Select.Option>
    ))}
  </Select>
  </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="ឈ្មោះគ្រូ" name="TeacherId" rules={[{ required: true }]}>
  <Select placeholder="ជ្រើសរើសឈ្មោះគ្រូ">
    {teachers.map(teacher => (
      <Select.Option key={teacher.Id} value={teacher.Id}>
        {teacher.KhmerName}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
        </Col>
      <Col span={12}>
         <Form.Item name="DadName" label="ឈ្មោះឪពុក" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
       <Form.Item name="MomName" label="ឈ្មោះម្ដាយ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
       <Form.Item name="Address" label="អាស័យដ្ឋាន" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
         <Form.Item name="Phone" label="លេខទូរស័ព្ទ">
          <Input />
        </Form.Item>
      </Col>
      </Row>
      <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name="Image"
          label="រូបថត"
          rules={[{ required: true }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e && e.fileList ? e.fileList : [];
          }}
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>
      </Col>
      </Row>
      </Form>
    </Modal>
  );
}