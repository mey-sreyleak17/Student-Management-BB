import { Modal, Form, Input, Button, Upload, DatePicker,Select,Row,Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function TeacherForm({ open, onCancel, onSubmit, initialValues ,mode}) {
  const [form] = Form.useForm();
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
      formData.append("Phone", values.Phone);
      formData.append("Shift", values.Shift);
      formData.append("Address", values.Address);
      if (values.Image && values.Image.length > 0) {
        formData.append("Image", values.Image[0].originFileObj);
      }
      

      await onSubmit(formData);
      form.resetFields();
    } catch (err) {
      console.error("Validation or submit failed:", err);
    }
  };

  return (
    <Modal
   open={open}
  onCancel={onCancel}
  onOk={handleOk}
  title={
    mode === "view"
      ? "View Teacher"
      : mode === "update"
      ? "Update Teacher"
      : "Add Teacher"
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
        <Form.Item name="Name" label="ឈ្មោះជាអក្សរឡាំង" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="KhmerName" label="ឈ្មោះខ្មែរ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      </Row> 
      <Row gutter={16}>
      <Col span={12}>
          <Form.Item
       name="Gender"
       label="ភេទ"
       rules={[{ required: true, message: "Please select a gender" }]}
          >
        <Select placeholder="ជហរើសរើសភេទ">
            <Option value="Male">ប្រុស</Option>
            <Option value="Female">ស្រី</Option>
            <Option value="Other">ផ្សេងៗ</Option>
            </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="DOB" 
        label="ថ្ងៃ​ខែឆ្នាំកំណើត"
         rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      </Row>
      <Row gutter={16}>
      <Col span={12}>
          <Form.Item name="Phone" 
          label="លេខទូរស័ព្ទ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
          <Form.Item
       name="Shift"
       label="ជ្រើសរើសពេលបង្រៀន"
       rules={[{ required: true, message: "Please select a gender" }]}
          >
        <Select placeholder="ជ្រើសរើសពេលបង្រៀន">
            <Option value="Morning">ពេលព្រឹក</Option>
            <Option value="Afternoon">ពេលរសៀល</Option>
            <Option value="Evening">ពេលយប់</Option>
             <Option value="Afternoon + Evening">ពេលរសៀល+ពេលយប់</Option>
            <Option value="Morning + Evening"> ពេលព្រឹក + ពេលយប់</Option>
             <Option value="Morning + Afternoon">ពេលព្រឹក+ពេលរសៀល</Option>
              <Option value="Morning + Afternoon + Evening">បង្រៀនទាំង៣ពេល</Option>
            </Select>
        </Form.Item>
      </Col>
      </Row>
    
      <Row gutter={16}>
         <Col span={12}>
          <Form.Item name="Address" label="ទីលំនៅចប្ចុប្បន្ន" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
          <Form.Item
          name="Image"
          label="រូបថត"
          rules={[{required:true}]}
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e && e.fileList ? e.fileList : [];
          }}
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>ជ្រើសរើសរូបភាព</Button>
          </Upload>
        </Form.Item>
      </Col>
     
      </Row>
      </Form>
    </Modal>
  );
}