import React,{useState,useEffect} from "react";

import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  message,
  Select,

} from "antd";
import api from "../../../../Api/indext";

const AddLevel = ({
  open,
  setOpen,
  form,
  handleSave,
  editingLevel,
}) => {

 const [Program, setProgram] = useState([]);
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
   useEffect(() => {

      selectProgram();
    }, []);
  return (
    <Modal
      open={open}
      title={
        editingLevel
          ? "Edit Level"
          : "Add Level"
      }
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      onOk={() => form.submit()}
      okText={
        editingLevel
          ? "Update"
          : "Create"
      }
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Level Name"
              name="LevelName"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter level name",
                },
              ]}
            >
              <Input placeholder="Enter level name" />
            </Form.Item>
          </Col>

        

          <Col span={12}>
              {/* ProgramID */}
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

          </Col>


          <Col span={18}>
<Form.Item
  name="LevelOrder"
  label="Level Order"
  rules={[
    {
      required: true,
      message: "Please select level order",
    },
  ]}
>
  <Select placeholder="Select Level">

    {/* PRE-K */}
    <Select.Option value="Pre-K1">
      Pre-K1
    </Select.Option>

    <Select.Option value="Pre-K2">
      Pre-K2
    </Select.Option>

    <Select.Option value="Pre-K3">
      Pre-K3
    </Select.Option>

    {/* K */}
    <Select.Option value="K1">
      K1
    </Select.Option>

    <Select.Option value="K2">
      K2
    </Select.Option>

    <Select.Option value="K3">
      K3
    </Select.Option>

    {/* STARTER */}
    <Select.Option value="Starter1">
      Starter1
    </Select.Option>

    <Select.Option value="Starter2">
      Starter2
    </Select.Option>

    <Select.Option value="Starter3">
      Starter3
    </Select.Option>

    {/* KHMER */}
    <Select.Option value="Kh 1">
      Kh 1
    </Select.Option>

    <Select.Option value="Kh 2">
      Kh 2
    </Select.Option>

    <Select.Option value="Kh 3">
      Kh 3
    </Select.Option>

    <Select.Option value="Kh 4">
      Kh 4
    </Select.Option>

    <Select.Option value="Kh 5">
      Kh 5
    </Select.Option>

    <Select.Option value="Kh 6">
      Kh 6
    </Select.Option>

    {/* LEVEL 1-12 */}
    {Array.from(
      { length: 12 },
      (_, i) => (
        <Select.Option
          key={i + 1}
          value={`Level ${i + 1}`}
        >
          {`Level ${i + 1}`}
        </Select.Option>
      )
    )}

  </Select>
</Form.Item>
</Col>

        </Row>
      </Form>
    </Modal>
  );
};

export default AddLevel;