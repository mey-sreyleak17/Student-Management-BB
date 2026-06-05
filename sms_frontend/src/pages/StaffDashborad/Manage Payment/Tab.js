import React from 'react';
import { Tabs } from 'antd';
import {TeamOutlined} from '@ant-design/icons'
import Payment from './payment';
import RecordPayment from './recordpayment';
import { icons } from 'antd/es/image/PreviewGroup';
const onChange = key => {
  console.log(key);
};
const items = [
  {
    key: '1',
    label: 'Payment',

    children:< Payment/>,
  },
  {
    key: '2',
    label: 'Record of Student Payment ',
    children:<  RecordPayment/>,
  },
];
const App = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
export default App;