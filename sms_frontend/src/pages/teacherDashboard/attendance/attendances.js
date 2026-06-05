import React from 'react';
import { Tabs } from 'antd';
import {ContactsOutlined, TeamOutlined,UsergroupAddOutlined,UserOutlined} from '@ant-design/icons'
import StudentAttendance from './attendanceStudent'
import TeacherAttendance from './attendanceTeacher'
import { icons } from 'antd/es/image/PreviewGroup';
import { Typography } from "antd";
const {Text}=Typography;
const onChange = key => {
  console.log(key);
};
const items = [
  {
    key: '1',
    label: <span>
        <UserOutlined style={{fontSize:20}}/>
        <Text style={{fontSize:15,fontStyle:'italic'}}>Teacher Attendance</Text>
      </span>,
    children:<TeacherAttendance/>,
  },
  {
    key: '2',
    label: <span>
        <UsergroupAddOutlined style={{fontSize:20}}/>
        <Text style={{fontSize:15,fontStyle:'italic'}}>Student Attendance</Text>
      </span>,
    children:<StudentAttendance/>,
  },
];
const App = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
export default App;