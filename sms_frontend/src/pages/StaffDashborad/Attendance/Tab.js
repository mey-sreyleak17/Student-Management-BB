import React from 'react';
import { Tabs } from 'antd';
import {TeamOutlined} from '@ant-design/icons'
import StudentAttendance from './StudentAttendace'
import TeacherAttendance from './TeacherAttendance'
import { icons } from 'antd/es/image/PreviewGroup';
const onChange = key => {
  console.log(key);
};
const items = [
  {
    key: '1',
    label: 'Teacher Attendane',
    children:<TeacherAttendance/>,
  },
  {
    key: '2',
    label: 'Student Attendance ',
    children:<StudentAttendance/>,
  },
];
const App = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
export default App;