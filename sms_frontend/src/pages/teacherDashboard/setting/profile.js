import React, {
  useState,
  useEffect
} from "react";

import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Button,
  Tag,
  Descriptions,
  Drawer,
  Form,
  Input,
  Upload,
  message,
  Divider,
} from "antd";

import {
  UserOutlined,
  EditOutlined,
  UploadOutlined,
  LockOutlined,
} from "@ant-design/icons";

import api from "../../../Api/indext";

const { Title, Text } =
  Typography;

export default function ProfilePage() {

  const [form] = Form.useForm();

  const [open,
    setOpen] =
    useState(false);

  const [profile,
    setProfile] =
    useState({});

  const [loading,
    setLoading] =
    useState(false);

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "accessToken"
          );

        const res =
          await api.get(
            "/users/profile",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setProfile(
          res.data
        );

        form.setFieldsValue({
          Name:
            res.data.Name,
          KhmerName:
            res.data.KhmerName,
          Phone:
            res.data.Phone,
          Address:
            res.data.Address,
        });

      } catch (error) {

        console.log(error);

      }

    };

  const handleSave =
    async (values) => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "accessToken"
          );

        await api.put(
          "/users/profile",
          values,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        message.success(
          "Profile Updated"
        );

        fetchProfile();

        setOpen(false);

      } catch (error) {

        message.error(
          "Update Failed"
        );

      } finally {

        setLoading(false);

      }

    };

  const uploadAvatar =
    async (file) => {

      try {

        const token =
          localStorage.getItem(
            "accessToken"
          );

        const formData =
          new FormData();

        formData.append(
          "image",
          file
        );

        await api.post(
          "/users/upload-avatar",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        message.success(
          "Photo Updated"
        );

        fetchProfile();

      } catch (error) {

        message.error(
          "Upload Failed"
        );

      }

      return false;
    };

  return (

    <div
      style={{
        padding: 24,
      }}
    >

      <Card
        bordered={false}
        style={{
          borderRadius: 20,
          overflow:
            "hidden",
          marginBottom: 24,
        }}
      >

        {/* Cover */}

        <div
          style={{
            height: 220,
            background:
              "linear-gradient(135deg,#1677ff,#69b1ff)",
          }}
        />

        {/* Profile */}

        <div
          style={{
            textAlign:
              "center",
            marginTop: -70,
          }}
        >

          <Avatar
            size={140}
            src={
              profile.Image
            }
            icon={
              <UserOutlined />
            }
            style={{
              border:
                "5px solid white",
            }}
          />

          <Title
            level={3}
            style={{
              marginTop: 15,
              marginBottom: 0,
            }}
          >
            {profile.Name}
          </Title>

          <Text>
            {
              profile.KhmerName
            }
          </Text>

          <br />

          <Tag
            color="blue"
            style={{
              marginTop: 10,
            }}
          >
            Admin
          </Tag>

          <div
            style={{
              marginTop: 15,
            }}
          >

            <Button
              type="primary"
              icon={
                <EditOutlined />
              }
              onClick={() =>
                setOpen(
                  true
                )
              }
            >
              Edit Profile
            </Button>

          </div>

        </div>

      </Card>

      <Row gutter={20}>

        <Col
          xs={24}
          md={12}
        >

          <Card
            title="Personal Information"
            style={{
              borderRadius:
                15,
            }}
          >

            <Descriptions
              column={1}
            >

              <Descriptions.Item
                label="Name"
              >
                {
                  profile.Name
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="Khmer Name"
              >
                {
                  profile.KhmerName
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="Phone"
              >
                {
                  profile.Phone
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="Address"
              >
                {
                  profile.Address
                }
              </Descriptions.Item>

            </Descriptions>

          </Card>

        </Col>

        <Col
          xs={24}
          md={12}
        >

          <Card
            title="Account Information"
            style={{
              borderRadius:
                15,
            }}
          >

            <Descriptions
              column={1}
            >

              <Descriptions.Item
                label="User ID"
              >
                {
                  profile.Id
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="Role"
              >
                {
                  profile.Role
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="Status"
              >
                Active
              </Descriptions.Item>

            </Descriptions>

          </Card>

          <Card
            title="Security"
            style={{
              marginTop: 20,
              borderRadius:
                15,
            }}
          >

            <Button
              icon={
                <LockOutlined />
              }
            >
              Change Password
            </Button>

          </Card>

        </Col>

      </Row>

      {/* Drawer */}

      <Drawer
        title="Edit Profile"
        width={500}
        open={open}
        onClose={() =>
          setOpen(false)
        }
      >

        <Upload
          showUploadList={
            false
          }
          beforeUpload={
            uploadAvatar
          }
        >

          <Button
            icon={
              <UploadOutlined />
            }
          >
            Change Photo
          </Button>

        </Upload>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={
            handleSave
          }
        >

          <Form.Item
            name="Name"
            label="Name"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="KhmerName"
            label="Khmer Name"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Phone"
            label="Phone"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Address"
            label="Address"
          >
            <Input.TextArea
              rows={4}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={
              loading
            }
            block
          >
            Save Changes
          </Button>

        </Form>

      </Drawer>

    </div>

  );

}