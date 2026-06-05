import React, { useState } from "react";
// import "./layout.css";
import { Outlet, useNavigate } from "react-router-dom";
import {HomeOutlined,MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, UsergroupAddOutlined, CreditCardOutlined, SettingOutlined, BookOutlined,
        BankOutlined,CalendarOutlined,BellOutlined,GlobalOutlined,LogoutOutlined,SearchOutlined,} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Input, Space, Avatar } from "antd";
const { Header, Sider, Content, Footer } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
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
              key: "user",
              icon: <UserOutlined style={{fontSize:20}}/>,
              label: "Manage User",
              children: [
                { key: "usermanage", label: "Users" },
                { key: "usermanage/role", label: "Roles & Permissions" },
              ],
            },
            {
              key: 'courese',
              icon: <BookOutlined style={{fontSize:20}}/>,
              label: "Subject",
            },
            {
              key:'grade',
              label:'Grade',
              icon:<MenuUnfoldOutlined style={{fontSize:20}}/>
            },
            {
              key: "class",
              icon: <BankOutlined style={{fontSize:20}}/>,
              label: "Class",
            },
            {
              key: "studentinfo",
              icon: <UsergroupAddOutlined style={{fontSize:20}}/>,
              label: "Students",
            },
            {
              key: "teacherinfo",
              icon: <UserOutlined style={{fontSize:20}}/>,
              label: "Teachers",
            },
            {
              key: "attendance",
              icon: <CalendarOutlined style={{fontSize:20}}/>,
              label: "Attendance",
            },
            {
              key: "payment",
              icon: <CreditCardOutlined style={{fontSize:20}}/>,
              label: "Payment",
            },
            {
              key: "report",
              icon: <SettingOutlined style={{fontSize:20}}/>,
              label: "Report",
            },
          ]}
        />
      </Sider>

      {/* MAIN */}
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
              src="../upload/bb.jpg"
              alt="logo"
              style={{ height: 70,marginTop:25 }}/>
            <h2 style={{ margin: 0, color: "#16c5ff" }}>
              Bright Brain School
            </h2>
          </Space>

          {/* RIGHT */}
          <Space size="middle">
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />

            <Button type="text" icon={<GlobalOutlined />}style={{fontSize:20}} />
            <Button type="text" icon={<BellOutlined />} style={{fontSize:20}}/>

            <Avatar icon={<UserOutlined />} />

            <Button danger icon={<LogoutOutlined />} />
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
export default App;