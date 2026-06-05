import { Modal, Form, Input ,Button,Upload,DatePicker} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";


export default function StudentForm({ open, onCancel, onSubmit, initialValues}) {
  const [form] = Form.useForm();

  const handleOk = async () => {
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
  formData.append("ParentPhone", values.ParentPhone);

  if (values.Image) {
    formData.append("Image", values.Image[0].originFileObj);
  }

  onSubmit(formData);

  form.resetFields();
};

  return (
    <Modal open={open} onCancel={onCancel} onOk={handleOk}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...initialValues,
          DOB: initialValues?.DOB ? dayjs(initialValues.DOB) : null,
        }}
      >
        <Form.Item name="Name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="KhmerName" label="KhmerName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
          <Form.Item name="Gender" label="Gender" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

         <Form.Item name="DOB" label="DOB" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

          <Form.Item name="ClassId" label="ClassId" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

          <Form.Item name="TeacherId" label="TeacherId" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

          <Form.Item name="DadName" label="DadName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
          <Form.Item name="MomName" label="MomName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
        name="Image"
        label="Image"
        valuePropName="fileList"
        getValueFromEvent={(e) => e.fileList}
        >
         <Upload beforeUpload={() => false} maxCount={1}>
         <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="ParentPhone" label="ParentPhone">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}