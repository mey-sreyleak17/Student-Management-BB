import  { useState,useEffect } from "react";
// import "./layout.css";
import bb  from "../../assets/bb.jpg"
import { Dropdown, Avatar } from "antd";
//import { UserOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import {HomeOutlined,MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, UsergroupAddOutlined, CreditCardOutlined, SettingOutlined,
        BankOutlined,CalendarOutlined,BellOutlined,GlobalOutlined,LogoutOutlined,SearchOutlined} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Input, Space, message,Modal} from "antd";
import api from "../../Api/indext";
const { Header, Sider, Content, Footer } = Layout;

const StaffDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [ setLoading] = useState(false);
  // Add 'currentLang' to your states
const [currentLang, setCurrentLang] = useState(localStorage.getItem("language") || "en");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

const handleLogout =  async() => {
      try {
         const token = localStorage.getItem("accessToken");
      if (!token) {
        message.error("No token found, please log in");
        setLoading(false);
        return;
      }
     const res = await api.post(
         "/auth/logout",
        {},
         { headers: { Authorization: `Bearer ${token}` } }
        );
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
    onOk: () => handleLogout(), // 👈 call your existing logout function
  });
};

  useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  api.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setUser(res.data))
  .catch(err => console.error(err));
}, []);

const items = [
  {
    key: "profile",
    label: user?.name || user?.email || localStorage.getItem("userEmail"),
  }
];
//change language
const handleChange = (lang) => {
  localStorage.setItem("language", lang);
  setCurrentLang(lang); // This triggers the re-render!
  message.success(`Language changed to ${lang === 'en' ? 'English' : 'Khmer'}`);
};

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
    'en': {
        'welcome': 'Welcome back  Student ',
        'viewProfile': 'My Profile',
        'viewAttendance': 'My Attendance',
        'ViewTimeTable': 'My Timetable',
        'ViewResults': 'My Results',
        'Notifications': 'View Notification'
    },
    'kh': {
         'welcome': 'ស្វាគមន៍ការត្រឡប់មកវិញ',
        'viewProfile': 'គណនីរបស់ខ្ញុំ',
        'viewAttendance': 'មើលវត្តមានរបស់ខ្ញុំ',
        'ViewTimeTable': 'មើលកាលវិភាគរៀន',
        'ViewResults': 'មើលលទ្ធផលសិក្សា',
        'Notifications': 'មើលព័ត៌មានសាលាជូនដំណឹង',
    }
};
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={300}
      >
        <Menu
          theme="dark"
          mode="inline"
          style={{paddingTop:80}}
          defaultSelectedKeys={["viewProfiles"]}
          defaultOpenKeys={["viewProfiles"]}
          onClick={({ key }) => navigate(key)}
          items={[
    {
      key: 'viewAttendance',
      icon: <HomeOutlined style={{fontSize:20}}/>,
      label: translations[currentLang].viewAttendance,
       children: [
                { key: "user", label: "Absent Days" },
                { key: "role", label: "Permissions Days" },
                { key: "user", label: "Present Days" },
              ],
    },
    {
      key: "ViewTimeTable",
      icon: <BankOutlined style={{fontSize:20}}/>,
      label: translations[currentLang].ViewTimeTable,
      children: [
                { key: "user", label: "Subjects" },
                { key: "role", label: "Time" },
                { key: "user", label: "Teacher" },
              ],
    },
    {
      key: "ViewResults",
      icon: <UsergroupAddOutlined style={{fontSize:20}}/>,
      label: translations[currentLang].ViewResults,
    },
     {
      key: "Notifications",
      icon: <UserOutlined style={{fontSize:20}}/>,
      label: translations[currentLang].Notifications,
      children: [
                { key: "user", label: "Fee Reminder" },
                { key: "role", label: "Exam Schedule" },
                { key: "user", label: "School Announcement" },
              ],
    },
    {
      key: "viewProfiles",
      icon: <UserOutlined style={{fontSize:20}}/>,
      label: translations[currentLang].viewProfile,
    }
  ]}
        />
      </Sider>
      <Layout>
        {/* HEADER */}
        <Header
          style={{
            background: colorBgContainer,
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height:"80px"
          }}
        >
          {/* LEFT */}
          <Space size="large">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{fontSize:20,width:50, height: 50}}
            />
            <img
              src={bb}
              alt="logo"
              style={{ height: 70,marginTop:25 }}/>
            <h2 style={{ margin: 0, color: "#16c5ff", fontSize: "23px" }}>
               {translations[currentLang].welcome}
              </h2>
          </Space>

          {/* RIGHT */}
          <Space size="middle">
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />

         <Dropdown menu={{ items: items_lang }} placement="bottom" trigger={["click"]}>
             <Button
                    type="text"
                    icon={<GlobalOutlined />}
                    style={{ fontSize: 20 }}
              />
          </Dropdown>

            <Button type="text" icon={<BellOutlined />} style={{fontSize:20}}/>

        <Dropdown menu={{ items }} placement="bottomCenter">
              <Avatar style={{ backgroundColor: "#87d068" }}>
                     {user?.name
                      ? user.name[0].toUpperCase()
                      : user?.email
                      ? user.email[0].toUpperCase()
                      : <UserOutlined />}
              </Avatar>
        </Dropdown>

            <Button danger icon={<LogoutOutlined />}
               onClick={confirmLogout}
             />
          </Space>
        </Header>
        {/* CONTENT */}
        <Content
          style={{
            margin: 16,
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>

        {/* FOOTER */}
        <Footer style={{ textAlign: "center" }}>
          © Bright Brain School 2026
        </Footer>
      </Layout>
    </Layout>
  );
}
export default StaffDashboard;