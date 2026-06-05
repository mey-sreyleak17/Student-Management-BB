import { useState ,useEffect} from "react";
import bb from '../../assets/bb.jpg';
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
  SunOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Input, Space, Avatar ,message,Dropdown,Badge
  ,Typography, ConfigProvider,} from "antd";
const {Text,Title}=Typography
const { Header, Sider, Content, Footer } = Layout;
const  StudentPage = () => {
  const [searchText, setSearchText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed,setLoading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem("language") || "en");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
   const {
  settings
} = useSettings();
//create function
   const handleLogout =
async () => {

  try {

    const accessToken =
    localStorage.getItem(
      "accessToken"
    );

    const refreshToken =
    localStorage.getItem(
      "refreshToken"
    );

    // CHECK TOKEN
    if (
      !accessToken ||
      !refreshToken
    ) {

      message.error(
        "No token found"
      );

      return;

    }

    // LOGOUT API
    await api.post(

      "/auth/logout",

      {
        refreshToken
      },

      {
        headers: {

          Authorization:
          `Bearer ${accessToken}`

        }
      }

    );

    // CLEAR STORAGE
    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "refreshToken"
    );

    localStorage.removeItem(
      "user"
    );

    message.success(
      "Logout Successfully"
    );

    // REDIRECT
    navigate("/");

  } catch (error) {

    console.log(error);

    message.error(
      "Logout Failed"
    );

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
    setCurrentLang(lang);
    message.success(`Language changed to ${lang === 'en' ? 'English' : 'Khmer'}`);
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
        {/* English */}
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
        {/* Khmer */}
      </span>),
      onClick: () => handleChange("kh"),
    },
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
const translations = {
    'en': {
        'welcome': 'Welcome to Bright Brain School',
        'timetable':'Class TimeTable',
        'result':'Class Result',
        'profile':'My Profile',
        'payments':'Payment Information',
        'academic':'Academic Information',
        'feepay':'Pay School Fee',
        'account':'Account',
        'search':'Search Menu....',
        'account':'Account',
        'attendance':'Class Attendance',
        'payment':"Student Payment",
        'pay':"Test Student Payment"
    },
    'kh': {
        'welcome': 'ស្វាគមន៍មកកាន់សាលារៀនប្រាយប្រ៊ែន',
        'timetable':'តារាងពេលវេលា',
        'result':'លទ្ធផលសិក្សា',
        'profile':'ព័ត៌មានផ្ទាល់ខ្លួន',
        'security':'សុវត្ថិភាព',
        'search':'ស្វែងរកម៉ីនុយ',
        'academic': 'ពត៌មាននៃការសិក្សា',
        'feepay':'បង់ថ្លៃសាលារៀន',
        'account':'គណនី',
        'payment':'ការបង់ប្រាក់របស់សិស្ស',
        'payments':'ការបង់ប្រាក់របស់សិស្ស',
        'pay':'ការបង់ប្រាក់របស់សិស្ស',
         'attendance':'ការតាមដានវត្តមាន'

    }
};
const [notifications, setNotifications] = useState([
    { id: 1, title: "New Student Enrollment", isRead: false },
    { id: 2, title: "Payment Received", isRead: false },
  ]);
const unreadCount = notifications.filter((n) => !n.isRead).length;

  const notificationMenu = (
    <div style={{ width: 260, maxHeight: 300, overflowY: "auto" }}>
      {notifications.length === 0 ? (
        <div style={{ padding: 10 }}>No notifications</div>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            style={{
              padding: 10,
              cursor: "pointer",
              background: n.isRead ? "#fff" : "#e6f7ff",
            }}
            onClick={() => {
              setNotifications((prev) =>
                prev.map((item) =>
                  item.id === n.id ? { ...item, isRead: true } : item
                )
              );
            }}
          >
            {n.title}
          </div>
        ))
      )}
    </div>
  );
  
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
        width={270}
        style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        height: "100vh",
        overflow: "auto",
      }}
      >
         <div style={{ textAlign: "center", padding: "20px 10px" }}>
                  <Avatar
                    size={80}
                    src={bb}
                    alt="logo"
                    style={{ marginBottom: 10 }}
                  />
          </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          defaultOpenKeys={["user"]}
          onClick={({ key }) => navigate(key)}
         items={[
  {
    key: "academic",
    icon: <BookOutlined />,
    label: translations[currentLang].academic,
    children: [
      {
        key: "timetable",
        icon: <ClockCircleOutlined />,
        label: translations[currentLang].timetable,
      },
      {
        key: "result",
        icon: <BarChartOutlined />,
        label: translations[currentLang].result,
      },
      {
        key: "attendance",
        icon: <CheckOutlined />,
        label: translations[currentLang].attendance,
      },
    ],
  },

  {
        key: "payment",
        icon: <DatabaseOutlined />,
        label: translations[currentLang].payment,
      },

  {
    key: "account-menu",
    icon: <UserOutlined />,
    label: translations[currentLang].account,
    children: [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: translations[currentLang].profile,
      },
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
    top: 10,
    left: collapsed ? 90 : 270,
    right: 20,
    zIndex: 1000,
    background: darkMode ? "#141414c9" : "#fff",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft:20,
    height: 80,
    borderRadius: 16,
    transition: "all 0.2s ease",
    border: darkMode
      ? "1px solid #303030"
      : "1px solid #f0f0f0",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    backdropFilter: "blur(12px)",
  }}
>
  {/* LEFT SIDE */}
  <Space size={16}>
    <Button
      type="text"
      icon={
        collapsed
          ? <MenuUnfoldOutlined />
          : <MenuFoldOutlined />
      }
      onClick={() =>
        setCollapsed(!collapsed)
      }
      style={{
        fontSize: 22,
        width: 45,
        height: 45,
        borderRadius: 12,
      }}
    />



    <div>

      <Text
        type="secondary"
        style={{
          fontSize: 20,
          fontFamily:'ui-sans-serif'
        }}
      >
        {translations[currentLang].welcome}
      </Text>
    </div>
  </Space>

  {/* RIGHT SIDE */}
  <Space size={10}>
    {/* SEARCH */}
    <Input
      placeholder={
        translations[currentLang].search
      }
      prefix={<SearchOutlined />}
      value={searchText}
      onChange={(e) =>
        setSearchText(
          e.target.value
        )
      }
      style={{
        width: 250,
        borderRadius: 10,
      }}
    />

    {/* DARK MODE */}
    <Button
      type="text"
      icon={
        darkMode ? (
          <SunOutlined
            style={{
              fontSize: 30,
              color: "#faad14",
            }}
          />
        ) : (
          <MoonOutlined
            style={{
              fontSize: 30,
            }}
          />
        )
      }
      //onClick={toggleTheme}
      style={{
        width: 42,
        height: 42,
        borderRadius: 10,
      }}
    />

    {/* LANGUAGE */}
    <Dropdown
      menu={{
        items: items_lang,
      }}
      trigger={["click"]}
    >
      <Button
        type="text"
        icon={
          <GlobalOutlined
            style={{
              fontSize: 30,
            }}
          />
        }
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
        }}
      />
    </Dropdown>

    {/* NOTIFICATION */}
    <Dropdown
      dropdownRender={() =>
        notificationMenu
      }
      trigger={["click"]}
    >
      <Badge count={unreadCount}>
        <Button
          type="text"
          icon={
            <BellOutlined
              style={{
                fontSize: 30,
              }}
            />
          }
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
          }}
        />
      </Badge>
    </Dropdown>

    {/* PROFILE */}
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
    >
      <Avatar
        size={45}
        style={{
          cursor: "pointer",
          background:
            "linear-gradient(135deg,#1677ff,#36cfc9)",
          fontWeight: "bold",
          marginRight:20
        }}
      >
        {user?.name
          ? user.name[0].toUpperCase()
          : user?.email
          ? user.email[0].toUpperCase()
          : "Me"}
      </Avatar>
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
export default StudentPage;