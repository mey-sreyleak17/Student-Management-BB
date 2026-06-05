import React, {
  useEffect,
  useState,
} from "react";

import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Statistic,
  Button,
  Descriptions,
  Upload,
  Spin,
  message,
} from "antd";

import {
  UserOutlined,
  CameraOutlined,
  TeamOutlined,
  TrophyOutlined,
  BookOutlined,
  EditOutlined,
} from "@ant-design/icons";

import api from "../../Api/indext";
import ProfileForm from "./formProfile";
const { Title, Text } =
  Typography;

export default function Profile() {
  const [loading,
    setLoading] =
    useState(false);

  const [profile,
    setProfile] =
    useState({
      student: {},
      attendance: {},
      score: {},
    });
    
    const [openEdit, setOpenEdit] = useState(false);
  useEffect(() => {
    getProfile();
  }, []);

  const getProfile =
    async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await api.get(
            "/student/profile",
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
      } catch (error) {
        console.log(
          error
        );
      } finally {
        setLoading(false);
      }
    };

 const handleUpdateProfile = async (formData) => {
  try {
    const token = localStorage.getItem("accessToken");

    await api.put(
      `/students/${profile.student.Id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    message.success("Profile updated");

    setOpenEdit(false);

    getProfile();
  } catch (error) {
    console.error(error);

    message.error("Update failed");
  }
};

const uploadImage = async ({ file }) => {
  try {
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("Image", file);

    await api.put(
      `/students/${profile.student.Id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    message.success("Profile image updated");

    getProfile();
  } catch (error) {
    console.error(error);
    message.error("Upload failed");
  }
};
  const attendanceRate =
    profile?.attendance
      ?.TotalAttendance
      ? (
          (profile
            .attendance
            .Present *
            100) /
          profile
            .attendance
            .TotalAttendance
        ).toFixed(1)
      : 0;

  return (
    <Spin
      spinning={loading}
    >
      <div
        style={{
          padding: 20,
          background:
            "#f5f7fb",
          minHeight:
            "100vh",
        }}
      >
        {/* HEADER */}

        <Card
          bordered={false}
          style={{
            borderRadius: 20,
            marginBottom: 16,
          }}
        >
          <Row
            align="middle"
            justify="space-between"
          >
            <Col>
              <Row
                gutter={16}
                align="middle"
              >
                <Col>
                  <div
  style={{
    position: "relative",
  }}
>
  <Avatar
    size={80}
    src={profile?.student?.Image}
    icon={<UserOutlined />}
  />

  <Upload
    accept="image/*"
    showUploadList={false}
    customRequest={uploadImage}
  >
    <Button
      size="small"
      shape="circle"
      icon={<CameraOutlined />}
      style={{
        position: "absolute",
        bottom: 0,
        right: -5,
      }}
    />
  </Upload>
</div>
                </Col>

                <Col>
                  <Title
                    level={4}
                    style={{
                      margin:
                        0,
                    }}
                  >
                    {
                      profile
                        ?.student
                        ?.Name
                    }
                  </Title>

                  <Text
                    type="secondary"
                  >
                    {
                      profile
                        ?.student
                        ?.KhmerName
                    }
                  </Text>

                  <br />

                  <Text>
                    ID:
                    {" "}
                    {
                      profile
                        ?.student
                        ?.StudentCode
                    }
                  </Text>

                  <br />

                  <Text
                    type="secondary"
                  >
                    {
                      profile
                        ?.student
                        ?.ProgramType
                    }
                  </Text>
                </Col>
              </Row>
            </Col>

            <Col>
 <Button
  type="primary"
  icon={<EditOutlined />}
  style={{
    borderRadius: 10,
  }}
  onClick={() => setOpenEdit(true)}
>
  Update Profile
</Button>
            </Col>
          </Row>
        </Card>

        {/* SUMMARY */}

        <Row
          gutter={[
            12,
            12,
          ]}
          style={{
            marginBottom: 16,
          }}
        >
          <Col
            xs={24}
            md={8}
          >
            <Card
              size="small"
              bordered={
                false
              }
            >
              <Statistic
                title="Attendance"
                value={
                  attendanceRate
                }
                suffix="%"
                prefix={
                  <TeamOutlined />
                }
              />
            </Card>
          </Col>

          <Col
            xs={24}
            md={8}
          >
            <Card
              size="small"
              bordered={
                false
              }
            >
              <Statistic
                title="Average Score"
                value={
                  profile
                    ?.score
                    ?.AverageScore ||
                  0
                }
                prefix={
                  <TrophyOutlined />
                }
              />
            </Card>
          </Col>

          <Col
            xs={24}
            md={8}
          >
            <Card
              size="small"
              bordered={
                false
              }
            >
              <Statistic
                title="Program"
                value={
                  profile
                    ?.student
                    ?.ProgramName ||
                  "-"
                }
                prefix={
                  <BookOutlined />
                }
              />
            </Card>
          </Col>
        </Row>

        {/* INFORMATION */}

        <Card
          title="Student Information"
          bordered={false}
          style={{
            borderRadius: 20,
          }}
        >
          <Descriptions
            bordered
            size="small"
            column={2}
          >
            <Descriptions.Item label="Name">
              {
                profile
                  ?.student
                  ?.Name
              }
            </Descriptions.Item>

            <Descriptions.Item label="Khmer Name">
              {
                profile
                  ?.student
                  ?.KhmerName
              }
            </Descriptions.Item>

            <Descriptions.Item label="Gender">
              {
                profile
                  ?.student
                  ?.Gender
              }
            </Descriptions.Item>

            <Descriptions.Item label="DOB">
              {
                profile
                  ?.student
                  ?.DOB
              }
            </Descriptions.Item>

            <Descriptions.Item label="Father">
              {
                profile
                  ?.student
                  ?.DadName
              }
            </Descriptions.Item>

            <Descriptions.Item label="Mother">
              {
                profile
                  ?.student
                  ?.MomName
              }
            </Descriptions.Item>

            <Descriptions.Item label="Phone">
              {
                profile
                  ?.student
                  ?.Phone
              }
            </Descriptions.Item>

            <Descriptions.Item label="Program">
              {
                profile
                  ?.student
                  ?.ProgramName
              }
            </Descriptions.Item>

            <Descriptions.Item
              span={2}
              label="Address"
            >
              {
                profile
                  ?.student
                  ?.Address
              }
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
      {/*Table*/}
              <ProfileForm
  open={openEdit}
  mode="update"
  initialValues={profile.student}
  onCancel={() => setOpenEdit(false)}
  onSubmit={handleUpdateProfile}
/>
    </Spin>
    
  );
}