import React from 'react';
import { Tabs } from 'antd';
import {TeamOutlined} from '@ant-design/icons'
import StudentInfo from './student'
import StudentEnrollment from './studentEnrollment'
import { icons } from 'antd/es/image/PreviewGroup';
const onChange = key => {
  console.log(key);
};
const items = [
  {
    key: '1',
    label: 'Student Information',
    children:<StudentInfo/>,
  },
];
const App = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
export default App;