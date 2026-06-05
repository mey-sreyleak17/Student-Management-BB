import React, { useState } from "react";
import { Tabs, Card, Typography } from "antd";
import {UserOutlined,CheckCircleOutlined,TrophyOutlined,
} from "@ant-design/icons";
import "../../../styles/change.css";
import StudentAttendance from "./attendanceStudent"
import TeacherAttendance from "./attendanceTeacher"
const { Text } = Typography;

const App = () => {
  const [activeTab, setActiveTab] = useState("students");

  const items = [
    {
      key: "students",
      label: (
        <span>
          <UserOutlined /> Take Attendance
        </span>
      ),
      children:<StudentAttendance/>,
    },
    {
      key: "attendance",
      label: (
        <span>
          <CheckCircleOutlined />Teacher Attendance
        </span>
      ),
      children:<TeacherAttendance/>,
    },
    // {
    //   key: "grades",
    //   label: (
    //     <span>
    //       <TrophyOutlined /> Grades & Scores
    //     </span>
    //   ),
    //   children: <div>Grades & Scores Content</div>,
    // },
  ];

  return (
    <div style={{ padding: 5 }}>
      <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarStyle={{
          background: "#fff",
          padding: 6,
          borderRadius: 12,
          width: "fit-content",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
          items={items}
        />
      {/* <Card style={{ borderRadius: 12 }}>
        
      </Card> */}
    </div>
  );
};

export default App;