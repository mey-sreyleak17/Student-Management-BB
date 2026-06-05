import { useState ,useEffect} from "react";
import bb from '../../assets/school.jpg';
import kh from "../../assets/kh1.png";
import en from "../../assets/us1.png"
import api from "../../Api/indext";
import {
  FacebookFilled,
  MailOutlined,
} from "@ant-design/icons";
import {
  useSettings
} from "../../context/SettingsContext";

import { Outlet, useNavigate } from "react-router-dom";
import {HomeOutlined,MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, CreditCardOutlined,
   SettingOutlined,BellOutlined,GlobalOutlined,LogoutOutlined,SearchOutlined, TeamOutlined,
    BarChartOutlined, BookOutlined, DatabaseOutlined, ToolOutlined,
   MoonOutlined,
  SunOutlined,} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Input, Space, Avatar ,message,Dropdown,Typography, ConfigProvider,Badge} from "antd";
const {Text,Title}=Typography
const { Header, Sider, Content, Footer } = Layout;

const App = () => {
  const [searchText, setSearchText] = useState("");
  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem(
        "darkMode"
      ) === "true"
    );

  const [collapsed, setCollapsed] =
    useState(false);
      const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] =useState(0);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem("language") || "en");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const {
  settings
} = useSettings();

useEffect(() => {

    localStorage.setItem(
      "darkMode",
      darkMode
    );

  }, [darkMode]);
  
//create function
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
  },
  {
    key: "logout",
    label: "Logout",
    onClick: handleLogout,
  },
];
//change language
const handleChange = (lang) => {
    localStorage.setItem("language", lang);
    message.success(`Language changed to ${lang}`);
  };

const items_lang = [
    {
      key: "en",
            label: (
            <span>
              <img
                src={en}
                alt="en"
                style={{ marginRight: 8 }}
              />
            </span>),
            onClick: () => handleChange("en"),
    },
    {
     key: "kh",
           label: (
           <span>
             <img
               src={kh}
               alt="kh"
               style={{ marginRight: 8 }}
             />
           </span>),
           onClick: () => handleChange("kh"),
    }
  ];
 const filterMenu = (items, search) => {
    if (!search) return items;

    return items
      .map((item) => {
        if (item.children) {
          const filteredChildren = item.children.filter((child) =>
            child.label.toLowerCase().includes(search.toLowerCase())
          );

          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
        }

        if (item.label.toLowerCase().includes(search.toLowerCase())) {
          return item;
        }

        return null;
      })
      .filter(Boolean);
  };

  const filteredItems = filterMenu(items, searchText);
const loadPendingCount = async () => {
  try {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    const res = await api.get(
      "/admin/leave-requests/pending-count",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    setPendingCount(
      res.data.total
    );
  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
  loadPendingCount();
}, []);
  return (
    <Layout style={{
      minHeight: "100vh",
      marginLeft: collapsed ? 80 : 250,
      transition: "all 0.2s", }}>
      {/* SIDEBAR */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        height: "100vh",
        overflow: "auto",
      }}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          defaultOpenKeys={["user"]}
          onClick={({ key }) => navigate(key)}
          items={[
            {
              key: 'dashborad',
              icon: <HomeOutlined  style={{fontSize:20}}/> ,
              label: "Dashboard",
            },
            {
              // key: "academic",
              icon: <BookOutlined style={{fontSize:20}}/>,
              label: "Academic Management",
              children:
              [
                {key:"years" ,label:"Create Academic Years"},
                {key:"levels" ,label:"Create Levels"},
                {key:"classes" ,label:"Create Classes"},
                {key:"subject" ,label:"Create Subjects"},

              ]
            },
            {
              // key: "manageuser",
              icon: <TeamOutlined style={{fontSize:20}}/>,
              label: "Manage User",
              children: [
                { key: "user", label: "Create Users" },
                { key: "role", label: "Roles & Permissions" },
                {key:"leaverequest", label:"Approve Permission"}
              ],
            },
            {
              key: "report",
              icon: <BarChartOutlined style={{fontSize:20}}/>,
              label: "Report",
            },
            {
              // key: "manageuser",
              icon: <SettingOutlined style={{fontSize:20}}/>,
              label: "Manage System",
              children: [
                { key: "setting",label: "Settings" },
                { key: "backup", label: "Backup" },
                { key: "security",label: "Security" },
                { key: "activitylogs",label: "Activity Logs" },
              ],
            },
          ]}
        />
      </Sider>

      {/* MAIN */}
      <Layout>
        {/* HEADER */}
       <Header
  style={{
    position: "fixed",
    top: 0,
    right: 0,
    left: collapsed ? 80 : 250,
    zIndex: 1000,
    transition: "all 0.2s ease",
    background: colorBgContainer,
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "76px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    borderBottom: "1px solid #f0f0f0a6",
  }}
>
  {/* LEFT SIDE */}
  <Space size="middle" align="center">
    
    {/* MENU BUTTON */}
    <Button
      type="text"
      icon={
        collapsed ? (
          <MenuUnfoldOutlined />
        ) : (
          <MenuFoldOutlined />
        )
      }
      onClick={() => setCollapsed(!collapsed)}
      style={{
        fontSize: 20,
        width: 45,
        height: 45,
        borderRadius: 12,
      }}
    />

    {/* TITLE */}
    <div
  style={{
    overflow: "hidden",
    whiteSpace: "nowrap",
    width: "400px",
  }}
>
  <h2
    style={{
      fontFamily: "ui-sans-serif",
      fontSize: 30,
      fontWeight: 700,
      margin: 0,

      // animation
      display: "inline-block",
      animation: "moveText 8s linear infinite, colorChange 5s infinite",

    }}
  >
    School Administration System
  </h2>

  <style>
    {`
      @keyframes moveText {
        0% {
          transform: translateX(100%);
        }

        100% {
          transform: translateX(-100%);
        }
      }

      @keyframes colorChange {
        0% {
          color: #1890ff;
        }

        25% {
          color: #c41a64;
        }

        50% {
          color: #14d7fa;
        }

        75% {
          color: #cb0f0f;
        }

        100% {
          color: #13c2c2;
        }
      }
    `}
  </style>
</div>
  </Space>

  {/* RIGHT SIDE */}
  <Space size="middle" align="center">

    {/* LANGUAGE */}
    <Dropdown
      menu={{ items: items_lang }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Button
        shape="circle"
        icon={<GlobalOutlined />}
        style={{
          width: 42,
          height: 42,
          fontSize: 18,
        }}
      />
    </Dropdown>

    {/* DARK MODE */}
    <Button
      shape="circle"
      icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
      onClick={() => setDarkMode(!darkMode)}
      style={{
        width: 42,
        height: 42,
        fontSize: 18,
      }}
    />

    {/* NOTIFICATION */}
    <Badge
  count={pendingCount}
  size="small"
>
  <Button
    shape="circle"
    icon={<BellOutlined />}
    onClick={() =>
      navigate("/admin/leaverequest")
    }
    style={{
      width: 42,
      height: 42,
      fontSize: 18,
    }}
  />
</Badge>

    {/* USER PROFILE */}
    <Dropdown menu={{ items }} placement="bottomRight">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          padding: "6px 12px",
          borderRadius: 12,
          transition: "0.2s",
        }}
      >
        <Avatar
          size={42}
          style={{
            background:
              "linear-gradient(135deg,#16c5ff,#1890ff)",
            fontWeight: 700,
          }}
        >
          {user?.name
            ? user.name[0].toUpperCase()
            : user?.email
            ? user.email[0].toUpperCase()
            : <UserOutlined />}
        </Avatar>

        <div style={{ lineHeight: 1.2 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {user?.name || "Admin User"}
          </div>

          <div
            style={{
              color: "#999",
              fontSize: 12,
            }}
          >
            Administrator
          </div>
        </div>
      </div>
    </Dropdown>
  </Space>
</Header>
        {/* CONTENT */}
        <Content
          style={{
            margin: 16,
            marginTop: 86,
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,

            height: "calc(100vh - 100px)",
            overflowY: "auto",
                  }}
        >
          <Outlet />
        </Content>

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
export default App;