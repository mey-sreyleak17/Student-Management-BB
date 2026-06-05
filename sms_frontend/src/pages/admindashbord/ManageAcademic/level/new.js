import React,{useState} from "react";
import { Row, Col, Card, Typography, Button, Space, Input,Dropdown,
  Popconfirm,message,Form
} from "antd";
import api from "../../../../Api/indext";
import { ApartmentOutlined, PlusOutlined, SearchOutlined,EditOutlined,DeleteOutlined,MoreOutlined
} from "@ant-design/icons";
import AddLevel from "./AddLevel";
const { Title, Text } = Typography;
const AcademicLevels = () => {
  const levels = [
  {
      id: 1,
      name: "Level 1",
      students: 120,
    },
    {
      id: 2,
      name: "Level 2",
      students: 100,
    },
    {
      id: 3,
      name: "Level 3",
      students: 140,
    },
    
  ];
   const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [form] = Form.useForm();

  const filteredLevels = data.filter(
  (item) =>
    item.Name?.toLowerCase().includes(
      search.toLowerCase()
    ) ||

    item.KhmerName?.toLowerCase().includes(
      search.toLowerCase()
    )
);
const handleAdd = () => {
    setEditingLevel(null);

    form.resetFields();

    setOpen(true);
  };
const handleEdit = (item) => {
  setEditingLevel(item);

  form.setFieldsValue({
    Name: item.LevelName,
    KhmerName: item.KhmerName,
  });

  setOpen(true);
};

const handleSave = async (
  values
) => {
  try {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (!token) {
      message.error(
        "No token found"
      );
      return;
    }

    const payload = {
      Name: values.Name,
      KhmerName:
        values.KhmerName,
    };

    // UPDATE
    if (editingLevel) {
      await api.put(
        `/level/${editingLevel.Id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success(
        "Updated successfully"
      );

    } else {
      // CREATE
      await api.post(
        "/level/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success(
        "Created successfully"
      );
    }

    form.resetFields();

    setOpen(false);

  } catch (err) {
    console.error(err);

    message.error(
      "Failed to save level"
    );
  }
};

const handleDelete = async (
  id
) => {
  try {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (!token) {
      message.error(
        "No token found"
      );
      return;
    }

    await api.delete(
      `/level/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    message.success(
      "Deleted successfully"
    );


  } catch (err) {
    console.error(err);

    message.error(
      "Failed to delete level"
    );
  }
};

const columns = [
  {
    title: "Level Name",
    dataIndex: "Name",
  },

  {
    title: "Khmer Name",
    dataIndex: "KhmerName",
  },

  {
    title: "Create At",
    dataIndex: "CreateAt",
  },

  {
    title: "Action",

    render: (_, record) => (
      <Space>
        <Button
          icon={<EditOutlined />}
          onClick={() =>
            handleEdit(record)
          }
        >
          Edit
        </Button>

        <Popconfirm
          title="Delete Level"
          description="Are you sure to delete this level?"
          onConfirm={() =>
            handleDelete(record.Id)
          }
          okText="Delete"
          cancelText="Cancel"
        >
          <Button
            danger
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];
 return (
    <Card
      bordered={false}
      style={{ borderRadius: 24 }}
      
      title={
            <Space direction="vertical" size={0}>
                <Title level={3} style={{ margin: 0 }}>
                  Academic Levels
                </Title>
    
                <Text type="secondary">
                  Manage all school academic levels
                </Text>
              </Space>}
      extra={
        <Space>

          <Button
  type="primary"
  icon={<PlusOutlined />}
  onClick={handleAdd}
>
  Add New Level
</Button>
        </Space>
         }
    >
      <Row gutter={[20, 20]}>
        {filteredLevels.map((item, index) => {
          const menuItems = [
              {
                key: "edit",
                label: "Edit",
                icon: <EditOutlined />,
                // onClick: () => handleEdit(item),
              },
              {
                key: "delete",
                label: "Delete",
                icon: <DeleteOutlined />,
                danger: true,
                // onClick: () => handleDelete(item.id),
              },
            ];
        return(
          <Col xs={26} sm={12} lg={8} key={index}>
            <Card
              hoverable
              bordered={false}
              style={{
                borderRadius: 24,
                textAlign: "center",
              }}
            >
               <div
                    style={{
                      position: "absolute",
                      top: 15,
                      right: 15,
                    }}
                  >
                    <Dropdown
                      menu={{
                        items: menuItems,
                      }}
                      trigger={["click"]}
                    >
                      <Button
                        type="text"
                        icon={<MoreOutlined />}
                      />
                    </Dropdown>
                  </div>
              <ApartmentOutlined
                style={{
                  fontSize: 50,
                  color: "#722ed1",
                  marginBottom: 15,
                }}
              />

               <Title level={4}>{item.name}</Title>
              <Text type="secondary">Total Student {item.students}</Text>
            </Card>
          </Col>
        );
        })}
      </Row>
      <AddLevel  
        open={open}
        setOpen={setOpen}
        editingLevel={editingLevel}
        onCancel={() => setOpen(false)} />
    </Card>
    
 )
}

export default AcademicLevels;
