import React from "react";
import { Modal, Form, Input, Select } from "antd";

export default function AddClass({ open, onOk, onCancel }) {
  return (
    <Modal
      title="Create Coures"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Create"
    >
      <Form layout="vertical">
        <Form.Item label="Coures Code">
          <Input placeholder="Enter coures code" />
        </Form.Item>
        <Form.Item label="Coures Name">
          <Input placeholder="Enter coures name" />
        </Form.Item>
        <Form.Item label="Description ">
          <Input placeholder="Enter coures des" />
        </Form.Item>
        <Form.Item label="Teacher Name ">
          <Input placeholder="Enter teacher name" />
        </Form.Item>


        <Form.Item label="Room">
          <Input placeholder="Room number" />
        </Form.Item>

        <Form.Item label="Teacher">
          <Input placeholder="Teacher name" />
        </Form.Item>
      </Form>
    </Modal>
  );
}