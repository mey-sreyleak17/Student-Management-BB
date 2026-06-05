import React from "react";

import {
  Modal,
  Form,
  Input,
  Row,
  Col,
} from "antd";

const AddSubject = ({
  open,
  setOpen,
  form,
  handleSave,
  editingSubject,
}) => {
  return (
    <Modal
      open={open}
      title={
        <span
          style={{
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          {editingSubject
            ? "Edit Subject"
            : "Add Subject"}
        </span>
      }
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      onOk={() => form.submit()}
      okText={
        editingSubject
          ? "Update"
          : "Create"
      }
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Row gutter={16}>
          {/* SUBJECT NAME */}
          <Col span={12}>
            <Form.Item
              label="Subject Name"
              name="Name"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter subject name",
                },
              ]}
            >
              <Input placeholder="Enter subject name" />
            </Form.Item>
          </Col>

          {/* KHMER NAME */}
          <Col span={12}>
            <Form.Item
              label="Khmer Name"
              name="KhmerName"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter Khmer name",
                },
              ]}
            >
              <Input placeholder="Enter Khmer name" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddSubject;