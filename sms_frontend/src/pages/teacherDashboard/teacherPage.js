import { useState, useEffect } from "react";
import bb from "../../assets/bb.jpg";
import "../../styles/teacherdash.css";
import { Dropdown, Avatar, Button, Layout, Menu, theme, Space, message, Typography, Modal,Badge } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  BankOutlined,
  BookOutlined,
  SettingOutlined,
  BellOutlined,
  GlobalOutlined,
  LogoutOutlined,
  DashOutlined
} from "@ant-design/icons";
import api from "../../Api/indext";

const { Text } = Typography;
const { Header, Sider, Content, Footer } = Layout;

const TeacherDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ fixed state
  const [currentLang, setCurrentLang] = useState(localStorage.getItem("language") || "en");
  const [notificationCount, setNotificationCount] =
  useState(0);

  const [notifications, setNotifications] =
  useState([]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        message.error("No token found, please log in");
        setLoading(false);
        return;
      }
      await api.post("/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      message.success("Logout Successfully");
      navigate("/"); // redirect
    } catch (error) {
      message.error("Logout Failed");
    }
  };

  const confirmLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Do you really want to log out?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleLogout(),
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    api
      .get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  const items = [
    {
      key: "profile",
      label: user?.name || user?.email || localStorage.getItem("userEmail"),
    },
    {
      key: "logout",
      label: (
        <span>
          <LogoutOutlined style={{ marginRight: 8 }} />
          Logout
        </span>
      ),
      onClick: confirmLogout,
    },
  ];

  const items_lang = [
    {
      key: "en",
      label: "English",
      onClick: () => handleChange("en"),
    },
    {
      key: "kh",
      label: "ខ្មែរ",
      onClick: () => handleChange("kh"),
    },
  ];

  const translations = {
    en: {
      welcome: "Welcome to Attendance Management",
      dashboard: "Dashboard",
      class: "Class Management",
      studentList: "Students List",
      takeAttendance: "Take Attendance",
      totalAttendance: "Total Attendance",
      inputScore: "Input Score",
      studentAttendance: "Student Attendance",
      scoreList: "Score List",
      grade: "Student Grade",
      attendance:"Management Attendance",
      setting:"setting",
      profile:"profile"
    },
    kh: {
      welcome: "ស្វាគមន៍មកកាន់ការគ្រប់គ្រងវត្តមាន",
      dashboard: "ផ្ទាំងគ្រប់គ្រង",
      class: "ការគ្រប់គ្រងថ្នាក់រៀន",
      studentList: "ការគ្រប់គ្រងសិស្ស",
      takeAttendance: "ការចុះវត្តមាន",
      totalAttendance: "វត្តមានសរុប",
      inputScore: "បញ្ចូលពិន្ទុ",
      studentAttendance: "វត្តមានសិស្ស",
      scoreList: "បញ្ជីពិន្ទុ",
      grade: "កម្រិតសិស្ស",
      attendance:"វត្តមាន",
      setting:"ការកំំណត់",
      profile:"គណនីផ្ទាល់ខ្លួន"

    },
  };

  //language change
  const handleChange = (lang) => {
    localStorage.setItem("language", lang);
    setCurrentLang(lang);
    message.success(`Language changed to ${lang === "en" ? "English" : "ខ្មែរ"}`);
  };

  const routeMap = {
  dashboard: "/teacher/dashboard",
 class: "/teacher/class/stulist",
  attendance:
    "/teacher/attendance/teacher",

  setting:
    "/teacher/setting/profile",

  profile:
    "/teacher/setting/profile",
};
const loadNotifications = async () => {
  try {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    const [notificationRes, countRes] =
      await Promise.all([
        api.get(
          "/notifications",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        ),

        api.get(
          "/notifications/unread-count",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        ),
      ]);

    setNotifications(
      notificationRes.data
    );

    setNotificationCount(
      countRes.data.count
    );

  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
  loadNotifications();
}, []);
useEffect(() => {

  loadNotifications();

  const interval =
    setInterval(
      loadNotifications,
      30000
    );

  return () =>
    clearInterval(
      interval
    );

}, []);

const markAsRead = async (id) => {
  try {

    const token =
      localStorage.getItem(
        "accessToken"
      );

    await api.put(
      `/notifications/${id}/read`,
      {},
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    setNotifications(prev =>
      prev.map(n =>
        n.Id === id
          ? {
              ...n,
              IsRead: 1,
            }
          : n
      )
    );

    setNotificationCount(prev =>
      Math.max(prev - 1, 0)
    );

  } catch (error) {
    console.log(error);
  }
};

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={250}>
        <div style={{ textAlign: "center", padding: "20px 10px" }}>
          <Avatar size={80} src={bb} alt="logo" style={{ marginBottom: 10 }} />
          <div style={{ color: "#fff", fontWeight: "bold", fontSize: 15,fontFamily:"Siemreap" }}>{translations[currentLang].welcome} </div>
        </div>
       <Menu
  theme="dark"
  mode="inline"
  defaultSelectedKeys={["dashboard"]}
  onClick={({ key }) => navigate(routeMap[key])}
  items={[
    {
      key: "dashboard",
      icon: <DashOutlined style={{ fontSize: 20  }} />,
      label: translations[currentLang].dashboard,
    },
    { 
      key:"class",
      icon: <BankOutlined style={{ fontSize: 20}} />,
      label: translations[currentLang].class,
    },
    {
      key: "attendance",
      label: translations[currentLang].attendance,
      icon: <BookOutlined style={{ fontSize: 20 }} />,
    },
    {
      key: "setting",
      icon: <SettingOutlined style={{ fontSize: 20 }} />,
      label: translations[currentLang].setting,
      children:[
        { key: "profile", label: translations[currentLang].profile}
      ]
    },
  ]}
   />
      </Sider>
      <Layout>
        {/* CONTENT */}
       {/* HEADER */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    padding: "16px 24px",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  }}
>
  {/* LEFT */}
  <div>
    <h2
      style={{
        margin: 0,
        color: "#1677ff",
        fontWeight: 700,
      }}
    >
      Teacher Dashboard
    </h2>

    <Text
      style={{
        color: "#888",
      }}
    >
      Welcome back,{" "}
      <strong>
        {user?.name || "Teacher"}
      </strong>
    </Text>
  </div>

  {/* RIGHT */}
  <Space size="middle">

    {/* Language */}
    <Dropdown
      menu={{
        items: items_lang,
      }}
      trigger={["click"]}
    >
      <Button
        shape="circle"
        icon={<GlobalOutlined />}
        style={{
          width: 42,
          height: 42,
        }}
      />
    </Dropdown>

    {/* Notification */}
    <Dropdown
      trigger={["click"]}
      menu={{
        items:
          notifications.length > 0
            ? notifications
                .slice(0, 5)
                .map((n) => ({
                  key: n.Id,
                  label: (
  <div
    onClick={() =>
      markAsRead(n.Id)
    }
    style={{
      width: 280,
      cursor: "pointer",
    }}
  >
    <div
      style={{
        fontWeight: 600,
      }}
    >
      {n.Title}
    </div>

    <div
      style={{
        fontSize: 12,
        color: "#888",
      }}
    >
      {n.Message}
    </div>
  </div>
)
                }))
            : [
                {
                  key: "empty",
                  label:
                    "No Notifications",
                },
              ],
      }}
    >
      <Badge
        count={notificationCount}
        overflowCount={99}
        size="small"
      >
        <Button
          shape="circle"
          icon={<BellOutlined />}
          style={{
            width: 42,
            height: 42,
          }}
        />
      </Badge>
    </Dropdown>

    {/* User */}
    <Dropdown
      menu={{
        items,
      }}
      placement="bottomRight"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          padding: "6px 12px",
          borderRadius: 12,
          background: "#fafafa",
          transition: "0.3s",
        }}
      >
        <Avatar
          size={42}
          style={{
            background:
              "linear-gradient(135deg,#1677ff,#69b1ff)",
            fontWeight: 700,
          }}
        >
          {user?.name
            ? user.name[0].toUpperCase()
            : <UserOutlined />}
        </Avatar>

        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {user?.name ||
              "Teacher"}
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#888",
            }}
          >
            Teacher
          </div>
        </div>
      </div>
    </Dropdown>

  </Space>
</div>

{/* PAGE CONTENT */}
<Outlet />
        {/* FOOTER */}
        <Footer style={{ textAlign: "center" }}>© Bright Brain School {new Date().getFullYear()}</Footer>
      </Layout>
    </Layout>
  );
};

export default TeacherDashboard;
