import React, {
  useEffect,
  useState
} from "react";

import api from "../../../Api/indext";

import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Select,
  Upload,
  Avatar,
  Switch,
  Divider,
  Row,
  Col,
  Space,
  message,
} from "antd";

import {
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const Settings = () => {

  const [form] = Form.useForm();

  const [loading, setLoading] =
    useState(false);

  const [logo, setLogo] =
    useState(null);
  const [schoolPicture,
setSchoolPicture] =
useState(null);
  // =========================
  // GET SETTINGS
  // =========================

  const getSettings = async () => {

    try {

      const res = await api.get(
        "/settings"
      );

      const data = res.data.settings;

      form.setFieldsValue({
        schoolName: data.SchoolName,//the same DB
        schoolKhName:data.SchoolKhName,
        country: data.Country,
        currency: data.Currency,
        phone:data.Phone,
        email: data.Email,
        emailNotification:
          Boolean(data.EmailNotification),
        darkMode:
          Boolean(data.DarkMode),
      });

      setLogo(data.Logo);
      setSchoolPicture(
  data.SchoolPicture
);

    } catch (error) {

      console.log(error);

      message.error(
        "Failed to load settings"
      );
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    getSettings();
  }, []);

  // =========================
  // SUBMIT
  // =========================

  const onFinish = async (values) => {

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "schoolName",
        values.schoolName
      );
       formData.append(
        "schoolKhName",
        values.schoolKhName
      );

      formData.append(
        "country",
        values.country
      );

      formData.append(
        "currency",
        values.currency
      );
       formData.append(
        "phone",
        values.phone
      );

      formData.append(
        "email",
        values.email
      );

      formData.append(
        "emailNotification",
        values.emailNotification
      );

      formData.append(
        "darkMode",
        values.darkMode
      );

      // upload image
 if (
  values.logo?.fileList?.[0]
) {

  formData.append(
    "logo",
    values.logo.fileList[0]
      .originFileObj
  );
}

if (
  values.schoolPicture
    ?.fileList?.[0]
) {

  formData.append(
    "schoolPicture",

    values.schoolPicture
      .fileList[0]
      .originFileObj
  );
}

      await api.put(
        "/settings",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      message.success(
        "Settings updated successfully"
      );

      getSettings();

    } catch (error) {

      console.log(error);

      message.error(
        "Failed to update settings"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div style={{ padding: 0 }}>

      {/* HEADER */}

      <div style={{ marginBottom: 10 }}>

        <Title
          level={2}
          style={{ marginBottom: 0 }}
        >
          Settings
        </Title>

        <Text type="secondary">
          View and update your setting details
        </Text>

      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: 20,
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.06)",
        }}
      >

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >

          {/* ACTION BUTTONS */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 30,
            }}
          >
            <Space>

              <Button
                size="large"
                onClick={() =>
                  form.resetFields()
                }
              >
                Cancel
              </Button>

              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                style={{
                  borderRadius: 10,
                }}
              >
                Save Changes
              </Button>

            </Space>
          </div>

          {/* SCHOOL NAME */}

          <Form.Item
  name="schoolName"
  style={{ marginBottom: 16 }}
>

  <Input
    size="large"
    placeholder="School Name"
  />

</Form.Item>

<Form.Item
  name="schoolKhName"
>

  <Input
    size="large"
    placeholder="School Khmer Name"
  />

</Form.Item>

          <Divider />

          {/* LOGO */}

 <Row
  gutter={32}
  style={{
    marginBottom: 20,
    alignItems: "center",
  }}
>

  {/* LOGO */}

  <Col>

    <Space
      direction="vertical"
      align="center"
    >

      <Avatar
        size={120}
        src={logo}
        shape="square"
      />

      <Form.Item name="logo">

        <Upload
          beforeUpload={() => false}
          showUploadList={false}

          onChange={(info) => {

            const file =
              info.fileList[0];

            if (
              file?.originFileObj
            ) {

              setLogo(
                URL.createObjectURL(
                  file.originFileObj
                )
              );
            }
          }}
        >

          <Button
            icon={
              <UploadOutlined />
            }
          >
            Upload Logo
          </Button>

        </Upload>

      </Form.Item>

    </Space>

  </Col>

  {/* SCHOOL PICTURE */}

  <Col>

    <Space
      direction="vertical"
      align="center"
    >

      <img
        src={schoolPicture}
        alt=""
        style={{
          width: 180,
          height: 110,
          objectFit: "cover",
          borderRadius: 10,
          border:
            "1px solid #ddd",
        }}
      />

      <Form.Item
        name="schoolPicture"
      >

        <Upload
          beforeUpload={() => false}
          showUploadList={false}

          onChange={(info) => {

            const file =
              info.fileList[0];

            if (
              file?.originFileObj
            ) {

              setSchoolPicture(
                URL.createObjectURL(
                  file.originFileObj
                )
              );
            }
          }}
        >

          <Button>
            Upload School Picture
          </Button>

        </Upload>

      </Form.Item>

    </Space>

  </Col>

</Row>
          <Divider />

          {/* COUNTRY */}

          <Row
            gutter={32}
            style={{ marginBottom: 20 }}
          >

            <Col xs={24} md={8}>

              <Title
                level={5}
                style={{ margin: 0 }}
              >
                Country
              </Title>

            </Col>

            <Col xs={24} md={16}>

              <Form.Item
                name="country"
              >

                <Select size="large">

                  <Option value="Cambodia">
                    Cambodia
                  </Option>

                  <Option value="US">
                    US
                  </Option>

                </Select>

              </Form.Item>

            </Col>

          </Row>

          <Divider />

          {/* CURRENCY */}

          <Row
            gutter={32}
            style={{ marginBottom: 20 }}
          >

            <Col xs={24} md={8}>

              <Title
                level={5}
                style={{ margin: 0 }}
              >
                Currency
              </Title>

            </Col>

            <Col xs={24} md={16}>

              <Form.Item
                name="currency"
              >

                <Select size="large">

                  <Option value="USD">
                    USD
                  </Option>

                  <Option value="KHR">
                    KHR
                  </Option>

                </Select>

              </Form.Item>

            </Col>

          </Row>

          <Divider />

          {/* EMAIL */}
          <Row
            gutter={32}
            style={{ marginBottom: 20 }}
          >

            <Col xs={24} md={8}>

              <Title
                level={5}
                style={{ margin: 0 }}
              >
                Phone
              </Title>

            </Col>

            <Col xs={24} md={16}>

              <Form.Item
                name="phone"
              >

                <Input
                  size="large"
                  placeholder="Phone"
                />

              </Form.Item>

            </Col>

          </Row>
          <Row
            gutter={32}
            style={{ marginBottom: 20 }}
          >

            <Col xs={24} md={8}>

              <Title
                level={5}
                style={{ margin: 0 }}
              >
                Email
              </Title>

            </Col>

            <Col xs={24} md={16}>

              <Form.Item
                name="email"
              >

                <Input
                  size="large"
                  placeholder="Email"
                />

              </Form.Item>

            </Col>

          </Row>

          <Divider />

          {/* EMAIL NOTIFICATION */}

          <Row
            gutter={32}
            style={{ marginBottom: 20 }}
          >

            <Col xs={24} md={8}>

              <Title
                level={5}
                style={{ margin: 0 }}
              >
                Email Notifications
              </Title>

            </Col>

            <Col xs={24} md={16}>

              <Form.Item
                name="emailNotification"
                valuePropName="checked"
              >

                <Switch />

              </Form.Item>

            </Col>

          </Row>

          <Divider />

          {/* DARK MODE */}

          <Row gutter={32}>

            <Col xs={24} md={8}>

              <Title
                level={5}
                style={{ margin: 0 }}
              >
                Dark Mode
              </Title>

            </Col>

            <Col xs={24} md={16}>

              <Form.Item
                name="darkMode"
                valuePropName="checked"
              >

                <Switch />

              </Form.Item>

            </Col>

          </Row>

        </Form>

      </Card>

    </div>
  );
};

export default Settings;