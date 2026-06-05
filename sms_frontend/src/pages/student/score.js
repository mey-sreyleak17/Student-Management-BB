import React from "react";
import { Table, Tag, Card, Row, Col, Statistic, Input, Progress, Typography
} from "antd";
const {Text,Title}=Typography
const dataSource = [
   {
      key: 1,
      id:"1",
      name:"Thavy",
      date:"18-May-2026",
      subject:"English",
      total:100,
      grade:"A"
    },
];

const Score = () => {

  const columns = [
    {title:"ID",dataIndex:"id"},
    {title:"Name",dataIndex:"name"},
    {title:"Date",dataIndex:"date"},
    {
      title: "Subject",
      dataIndex: "subject",
    },
    {
      title: "Total",
      dataIndex: "total",
    },
    {
      title: "Grade",
      dataIndex: "grade",
      render: (grade) => {
        let color = "blue";

        if (grade === "A") color = "green";
        if (grade === "B+") color = "orange";

        return (
          <Tag color={color}>
            {grade}
          </Tag>
        );
      },
    },
   
  ];

  return (
    <div style={{ padding: 0 }}>

    <div style={{ marginBottom: 20 }}>
        <Title level={2} style={{ margin: 0 }}>
          Result Study
        </Title>

        <Text type="secondary">
          View your personal result
        </Text>
    </div>

      {/* Search */}
      {/* <Input.Search
        placeholder="Search Subject..."
        style={{
          width:300,
          marginBottom:20
        }}
      /> */}

      <Card>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize:5
        }}
      />
      </Card>
    </div>
  );
};

export default Score;