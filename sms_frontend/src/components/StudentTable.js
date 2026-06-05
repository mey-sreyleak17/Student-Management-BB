import { Table, Button } from "antd";

export default function StudentTable({ data, onEdit, onDelete }) {
  const columns = [
    { title: "Code", dataIndex: "StudentCode" },
    { title: "Name", dataIndex: "Name" },
    { title: "KhmerName", dataIndex: "KhmerName" },
    { title: "Gender", dataIndex: "Gender" },
    { title: "DOB", dataIndex: "DOB" },
    { title: "ClassId", dataIndex: "ClassId" },
    { title: "TeacherId", dataIndex: "TeacherId" },
    { title: "DadName", dataIndex: "DadName" },
    { title: "MomName", dataIndex: "MomName" },
    { title: "ParentPhone", dataIndex: "ParentPhone" },

    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button onClick={() => onEdit(record)}>Edit</Button>
          <Button danger onClick={() => onDelete(record.Id)}>Delete</Button>
        </>
      ),
    },
  ];

  return <Table dataSource={data} columns={columns} rowKey="Id" />;
}