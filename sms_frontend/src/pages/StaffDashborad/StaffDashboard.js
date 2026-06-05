import  { useState,useEffect } from "react";
import {
  FacebookFilled,
  MailOutlined,
} from "@ant-design/icons";
import {
  useSettings
} from "../../context/SettingsContext";
// import "./layout.css";
//import bb  from "../../assets/bb.jpg"

import { Dropdown, Avatar } from "antd";
//import { UserOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import {HomeOutlined,MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, UsergroupAddOutlined, CreditCardOutlined, SettingOutlined,
        BankOutlined,CalendarOutlined,BellOutlined,GlobalOutlined,LogoutOutlined,SearchOutlined} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Space, message,Modal} from "antd";
import api from "../../Api/indext";
import {
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { useTheme }
from "../../context/ThemeContext";


const { Header, Sider, Content, Footer } = Layout;

const StaffDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [ setLoading] = useState(false);
   const {
  settings
} = useSettings();
const {
  darkMode,
  toggleTheme,
} = useTheme();
  // Add 'currentLang' to your states
const [currentLang, setCurrentLang] = useState(localStorage.getItem("language") || "en");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const iconColor = darkMode ? "#ffffff" : "#000000a4";

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

  /*
   {
              key: 'subject',
              icon: <BookOutlined style={{fontSize:20}}/>,
              label: "Subject",
            },
           {
              key:'grade',
              label:'Grade',
              icon:<MenuUnfoldOutlined style={{fontSize:20}}/>
            },
  */
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
        'welcome': 'Welcome to Student Management',
        'dashboard': 'Dashboard',
        'class': 'Class Management',
        'students': ' Management Students',
        'teachers': ' Management Teachers',
        'fee':'Managegement Fee',
        'attendance': 'View Attendance ',
        'payment': 'Management Payment',
        'data': 'Management Data',
        'report': 'View Report ',


    },
    'kh': {
        'welcome': 'ស្វាគមន៍មកកាន់ការគ្រប់គ្រងសិស្ស',
        'dashboard': 'ផ្ទាំងគ្រប់គ្រង',
        'class': 'ការគ្រប់គ្រងថ្នាក់រៀន',
        'students': 'ការគ្រប់គ្រងសិស្ស',
        'teachers': 'ការគ្រប់គ្រងគ្រូបង្រៀន',
        'attendance': 'ការគ្រប់គ្រងវត្តមាន',
        'payment': 'ការតាមដានការបង់ប្រាក់',
        'report': 'ពិនិត្យមើលរបាយការណ៍',
        'fee':"ការគ្រប់គ្រងលើfee",
        'data':"ការគ្រប់គ្រងទិន្និន័យ"

    }
};
  return (
    <Layout style={{ minHeight: "100vh", background: darkMode ? "#141414" : "#f5f5f5", }}>
      {/* SIDEBAR */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={260}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          defaultOpenKeys={["user"]}
          onClick={({ key }) => navigate(key)}
          items={[
    {
      key: 'dashboard',
      icon: <HomeOutlined style={{fontSize:20}}/>,
      label: translations[currentLang].dashboard,
    },
    {
      key: "student",
      icon: <UsergroupAddOutlined style={{fontSize:20}}/>,
      label: translations[currentLang].students,
    },
    {
      key: "teacher",
      icon: <UserOutlined style={{fontSize:20}}/>,
      label: translations[currentLang].teachers,
    },
    {
      key: "fee",
      icon: <SettingOutlined style={{fontSize:20}}/>,
      label: translations[currentLang].fee,
    },
    {
      key: "attendance",
      icon: <CalendarOutlined style={{fontSize:20}}/>,
      label: translations[currentLang].attendance,
    },
    {
      key: "payment",
      icon: <CreditCardOutlined style={{fontSize:20}}/>,
      label: translations[currentLang].payment,
    },
    {
      key: "report",
      icon: <SettingOutlined style={{fontSize:20}}/>,
      label: translations[currentLang].report,
    },
  ]}
        />
      </Sider>
      <Layout>
        {/* HEADER */}
        <Header
  style={{
    background: darkMode ? "#141414c9" : "#fff",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: 90,
    borderBottom: darkMode
      ? "1px solid #303030"
      : "1px solid #f0f0f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  }}
>
  {/* LEFT */}
  <Space size={16}>
    <Button
      type="text"
      icon={
        collapsed
          ? <MenuUnfoldOutlined />
          : <MenuFoldOutlined />
      }
      onClick={() => setCollapsed(!collapsed)}
      style={{
        fontSize: 22,
        width: 45,
        height: 45,
        borderRadius: 10,
      }}
    />

    <img
      src={settings?.Logo}
      alt="logo"
      style={{
        width: 60,
        height: 60,
        objectFit: "contain",
        borderRadius: 12,
        marginTop:20
      }}
    />

    <div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#16c5ff",
          lineHeight: 1.2,
        }}
      >
        Welcome to Management Staff
      </div>

    </div>
  </Space>

  {/* RIGHT */}
  <Space size={12}>
    <Button
  type="text"
  icon={
    darkMode ? (
      <SunOutlined
        style={{
          fontSize: 24,
          color: "#faad14",
        }}
      />
    ) : (
      <MoonOutlined
        style={{
          fontSize: 24,
          color: iconColor,
        }}
      />
    )
  }
  onClick={toggleTheme}
  style={{
    width: 45,
    height: 45,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  }}
/>

    <Dropdown
      menu={{ items: items_lang }}
      trigger={["click"]}
    >
     <Button
  type="text"
  icon={
    <GlobalOutlined
      style={{
        fontSize: 24,
        color: iconColor,
      }}
    />
  }
  style={{
    width: 45,
    height: 45,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  }}
/>
    </Dropdown>

   <Button
  type="text"
  icon={
    <BellOutlined
      style={{
        fontSize: 24,
        color: iconColor,
      }}
    />
  }
  style={{
    width: 45,
    height: 45,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  }}
/>

    <Dropdown
      menu={{ items }}
      placement="bottomRight"
    >
      <Avatar
        size={45}
        style={{
          background:
            "linear-gradient(135deg,#1677ff,#36cfc9)",
          cursor: "pointer",
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        {user?.name
          ? user.name[0].toUpperCase()
          : user?.email
          ? user.email[0].toUpperCase()
          : <UserOutlined />}
      </Avatar>
    </Dropdown>

    <Button
      danger
      shape="round"
      icon={<LogoutOutlined />}
      onClick={confirmLogout}
    >
      Logout
    </Button>
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
               {/* FOOTER */}
 <Footer
  style={{
    background: "#001529",
    padding: "40px 20px",
    textAlign: "center",
  }}
>

  {/* LOGO */}

  <div
    style={{
      marginBottom: 5,
    }}
  >

    <img
      src={settings?.Logo}
      alt=""
      style={{
        width: 90,
        height: 90,
        borderRadius: 20,
        objectFit: "cover",
      }}
    />

  </div>

  {/* SCHOOL NAME */}

  <h2
    style={{
      color: "white",
      marginBottom: 5,
      

    }}
  >
<h1 style={{color:"white" ,fontSize:20,fontFamily:"ui-sans-serif"}}>សូមស្វាគមន៍មកកាន់សាលាប្រាយប្រ៊ែន {settings?.SchoolkhName}</h1>

  </h2>

  {/* KHMER NAME */}
 
  <p
    style={{
      color: "#d9d9d9",
      fontSize: 16,
      marginBottom: 10,
      fontFamily:"ui-sans-serif"
    }}
  >
    <h1 style={{color:"white" ,fontSize:20,fontFamily:"ui-sans-serif"}}>Welcome to  {settings?.SchoolName}</h1>

  </p>

  {/* EMAIL */}

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      color: "#ccc",
      marginBottom: 20,
      fontSize: 20,
      fontFamily:"sans-serif"
    }}
  >
   
    <MailOutlined />

    {settings?.Email}

  </div>

  {/* SOCIAL */}

  <div
    style={{
      marginBottom: 25,
      fontSize: 20,
    }}
  >

    <a
      href="https://www.facebook.com/share/17V7zUY36H/?mibextid=wwXIfr"
      target="_blank"
      rel="noreferrer"
      style={{
        color: "white",
        fontSize: 30,
        transition: "0.3s",
      }}
    >
     <h1 style={{fontFamily:"ui-sans-serif",color:"white",fontSize:18}}>  <FacebookFilled /> Facebook Page
      
     </h1>
     

    </a>

  </div>

  {/* COPYRIGHT */}

  <div
    style={{
      borderTop:
        "1px solid rgba(255,255,255,0.1)",
      paddingTop: 15,
      color: "#999",
      fontSize: 14,
    }}
  >

    <br />

    All Rights Reserved

  </div>

</Footer>
      </Layout>
    </Layout>
  );
}
export default StaffDashboard;