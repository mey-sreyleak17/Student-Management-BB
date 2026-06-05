import React from 'react';
import { Tabs } from 'antd';
import {TeamOutlined} from '@ant-design/icons';
import Addsubject from './addsubject';
import ViewDetail from './ViewDetail';
import Subject from "./course";
//import { icons } from 'antd/es/image/PreviewGroup';
const onChange = key => {
  console.log(key);
};
const items = [
  {
    key: '1',
    label: 'Courses Veiw',

    children:< Subject/>,
  },
  {
    key: '2',
    label: 'Veiw Course Detail',
    children:< ViewDetail/>,
  },
  {
    key: '3',
    label: 'Add Course',
    children:< Addsubject />,
  }
];
const App = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
export default App;