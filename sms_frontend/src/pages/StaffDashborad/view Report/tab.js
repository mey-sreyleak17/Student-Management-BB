import React from 'react';
import { Tabs } from 'antd';
import {TeamOutlined} from '@ant-design/icons'
import PaymentReport from './payment_report';
import StudentReport from './student_report';
import EnrollmentReport from './teacher_report';
import { icons } from 'antd/es/image/PreviewGroup';
const onChange = key => {
  console.log(key);
};
const items = [
  {
    key: '1',
    label: 'Payment Report',

    children:< PaymentReport/>,
  },
  {
    key: '2',
    label: 'Student Report ',
    children:<  StudentReport/>,
  },
  {
    key: '3',
    label: 'Teacher Report ',
    children:< EnrollmentReport/>,
  },
];
const App = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
export default App;