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
  DollarCircleOutlined
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
        'timetable':'TimeTable',
        'result':'Result',
        'profile':'Profile',
        'security':'Security',
        'academic':'Academic',
        'account':'Account',
        'search':'Search Menu....',
        'academic':'Academic'    ,
        'account':'Account',
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
        'academic': 'ការសិក្សា',
        'account':'គណនី',
        'payment':'ការបង់ប្រាក់របស់សិស្ស',
        'pay':'ការបង់ប្រាក់របស់សិស្ស'

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
         <div style={{ textAlign: "center", padding: "20px 10px" }}>
                  <Avatar
                    size={80}
                    src={bb}
                    alt="logo"
                    style={{ marginBottom: 10 }}
                  />
                  <div style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                  {translations[currentLang].welcome}
                  </div>
          </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          defaultOpenKeys={["user"]}
          onClick={({ key }) => navigate(key)}
          // items={[
          //   {
          //     key: 'profile',
          //     icon: <UserOutlined  style={{fontSize:20}}/> ,
          //     label: "Profile",
          //   },
          //   {
          //     key: "attendance",
          //     icon: <CheckOutlined style={{fontSize:20}}/>,
          //     label: "View Attendance",
          //   },
          //   {
          //     key: "timetable",
          //     icon: <ClockCircleOutlined style={{fontSize:20}}/>,
          //     label: "Timetable",
          //   },
          //   {
          //     key: "score",
          //     icon: <TeamOutlined style={{fontSize:20}}/>,
          //     label: "View Result",
          //   },
          //   {
          //     key: "",
          //     icon: <TeamOutlined style={{fontSize:20}}/>,
          //     label: "Account Control",
          //   },
            
          // ]}
          items={[
              {
                type: "group",
                label: (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "#fff",
                      letterSpacing: 1,
                    }}
                    
                  >
                    {translations[currentLang].academic}
                  </span>
                ),
                children: [
                  {
                    key: "timetable",
                    icon: <BookOutlined style={{ fontSize: 18 }} />,
                    label: translations[currentLang].timetable,
                  },
                  {
                    key: "score",
                    icon: <BarChartOutlined style={{ fontSize: 18 }} />,
                    label: translations[currentLang].result,
                  },
                ],
              },

              {
                type: "group",
                label: (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "#fff",
                      letterSpacing: 1,
                      marginTop: 20,
                    }}
                  >
                    {translations[currentLang].account}
                  </span>
                ),
                children: [
                  {
                    key: "profile",
                    icon: <UserOutlined style={{ fontSize: 18 }} />,
                    label: translations[currentLang].profile,
                  },
                  {
                    key: "security",
                    icon: <ToolOutlined style={{ fontSize: 18 }} />,
                    label: translations[currentLang].security,
                  },
                   {
                    key: "payment",
                    icon: <DollarCircleOutlined style={{ fontSize: 18 }} />,
                    label: translations[currentLang].payment,
                  },
                  {
                    key: "pay",
                    icon: <DollarCircleOutlined style={{ fontSize: 18 }} />,
                    label: translations[currentLang].pay,
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
            right: 15,
            left: collapsed ? 80 : 265,
            zIndex: 1000,
            transition: "all 0.2s",
            background: colorBgContainer,
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height:"60px",
            borderRadius:10
          }}
        >
            <Input
              placeholder={translations[currentLang].search}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "30%", margin: 10,borderRadius:10
              }}
            />
            <Space size="middle">
             <Dropdown menu={{ items: items_lang }} placement="bottom" trigger={["click"]}
              styles={{border:0}}
             >
             <Button
                  style={{fontSize:18}}
                  icon={<GlobalOutlined />}
              />
              </Dropdown>

           <Badge count={3} size="small" count={notifications.filter(n => !n.isRead).length}>
                <Button
                  type="text"
                  shape="circle"
                  icon={<BellOutlined />}
                  style={{
                    fontSize: 20,
                  }}
                />
              </Badge>

            <Dropdown menu={{ items }} placement="bottom">
              <Avatar style={{ backgroundColor: "#87d068" }}>
                     {user?.name
                      ? user.name[0].toUpperCase()
                      : user?.email
                      ? user.email[0].toUpperCase()
                      : <UserOutlined />}
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