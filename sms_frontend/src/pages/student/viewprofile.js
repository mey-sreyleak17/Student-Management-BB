import React, { useState } from "react";
import { Card, Row, Col, Avatar, Typography, Button, Divider, Input, Select, DatePicker, Space,
} from "antd";
import {EditOutlined, CameraOutlined, SaveOutlined, CloseOutlined,
} from "@ant-design/icons";
import profile from "../../assets/Me1.jpg";
const { Title, Text } = Typography;
const { Option } = Select;

const Profile = () => {
  const [editing, setEditing] = useState(false);

  const [student, setStudent] = useState({
    name: "Von Chanthavy",
    khmerName: "វ៉ុន ច័ន្ទថាវី",
    gender: "Female",
    dob: "2005-01-15",
    dadName: "Dad Name",
    momName: "Mom Name",
    phone: "012345678",
    address: "Svay Rieng, Cambodia",
    role: "Student",
  });

  const [tempData, setTempData] =useState(student);
  const renderField = (
    label,
    field,
    span = 8
      ) => (
        <Col span={span}>
          <Text type="secondary">
            {label}
          </Text>

          <div
            style={{
              marginTop: 8,
            }}
          >
            {editing ? (
              field === "gender" ? (
                <Select
                  value={tempData[field]}
                  // onChange={(value) =>
                  //   handleChange(
                  //     field,
                  //     value
                  //   )
                  // }
                  style={{
                    width: "100%",
                  }}
                >
                  <Option value="Male">
                    Male
                  </Option>

                  <Option value="Female">
                    Female
                  </Option>
                </Select>
              ) : field === "dob" ? (
                <DatePicker
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                <Input
                  value={
                    tempData[field]
                  }
                  // onChange={(e) =>
                  //   handleChange(
                  //     field,
                  //     e.target.value
                  //   )
                  // }
                />
              )
            ) : (
              <Text strong>
                {
                  student[
                    field
                  ]
                }
              </Text>
            )}
          </div>
        </Col>
      );

  return (
    <div>
      <Card
        style={{
          borderRadius: 18,
          marginBottom: 20,
        }}
      >
        <Row  align="middle"  gutter={20}
        >
          <Col>
            <div
              style={{
                position:  "relative",
              }}
            >
              <Avatar
                size={100}
                src={profile}
              />
              <Button
                shape="circle"
                icon={
                  <CameraOutlined />
                }
                size="small"
                style={{
                  position:
                    "absolute",
                  bottom: 0,
                  right: 0,
                  background:
                    "#1677ff",
                  color:
                    "white",
                }}
              />
            </div>
          </Col>

          <Col>
            <Title level={4} style={{   margin: 0, }} >
              {
                student.name
              }
            </Title>

            <Text type="secondary">
              {
                student.role
              }
            </Text>

            <br />

            <Text
              type="secondary"
            >
              {
                student.phone
              }
            </Text>
          </Col>
        </Row>
      </Card>
      <Card
        style={{
          borderRadius: 18,
        }}
      >
        <Row
          justify="space-between"
          align="middle"
        >
          <Title level={4}>   Personal   Information
          </Title>
          {!editing ? (
            <Button
              type="primary"
              icon={
                <EditOutlined />
              }
              onClick={() =>  setEditing(true)
              }
              style={{
                borderRadius: 8,
                background:  "#ff9500",
              }}
            >
              Edit
            </Button>
               ) : (
            <Space>
              <Button
                icon={<CloseOutlined />}  
              >
                Cancel
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
              >
                Save Changes
              </Button>
            </Space>
          )}
        </Row>
        <Divider />
        <Row gutter={[30, 30]}>
          {renderField(
            "Name",
            "name"
          )}

          {renderField(
            "Khmer Name",
            "khmerName"
          )}

          {renderField(
            "Gender",
            "gender"
          )}

          {renderField(
            "Date of Birth",
            "dob"
          )}

          {renderField(
            "Dad Name",
            "dadName"
          )}

          {renderField(
            "Mom Name",
            "momName"
          )}

          {renderField(
            "Phone Number",
            "phone"
          )}

          {renderField(
            "Address",
            "address"
          )}

          {renderField(
            "User Role",
            "role"
          )}
        </Row>
      </Card>
    </div>
  );
};

export default Profile;