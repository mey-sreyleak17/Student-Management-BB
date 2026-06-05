import React,{useEffect,useState} from "react";
import {Row,Col,Card,Input,Select,Button,Typography,message,Space,Modal} from "antd";
import {PlusOutlined,DeleteOutlined, EditOutlined,EyeOutlined,UserOutlined,SunOutlined,ClockCircleOutlined
  ,MoonOutlined
} from "@ant-design/icons";
import TeacherForm from "./teacherForm";
import api from "../../../Api/indext";
import {Table} from "antd";

const { Title, Text } = Typography;
const { Search } = Input;


const TeacherManagement = () => {
    const [mode, setMode] = useState( "add"); // "add" or "update"
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);  // array, not object
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    // Get all teachers
         const [teacherCount, setTeacherCount] = useState(0);
         const [searchTerm, setSearchTerm] = useState("");
         const [subjectFilter, setSubjectFilter] = useState("all");
         const [statusFilter, setStatusFilter] = useState("all");
        const [summary, setSummary] = useState({
  totalTeachers: 0,
  morningTeachers: 0,
  afternoonTeachers: 0,
  eveningTeachers: 0,

  morningAfternoonTeachers: 0,
  morningEveningTeachers: 0,
  afternoonEveningTeachers: 0,
  allShiftTeachers: 0,
});
      const { Option } = Select;

const handleAddTeacher = async (formData) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("No token found, please log in");
      return;
    }
    await api.post("/teacher", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    message.success("Teacher created successfully");
    setOpen(false);
    fetchTeacherCount();
    fetchTeachers();
  } catch (error) {
    console.error(error);
    message.error("Create failed");
  }
};
 useEffect(() => {
  fetchTeacherCount();
  fetchTeachers();
  fetchTeacherSummary();
  }, []);
const fetchTeacherSummary = async () => {

  try {

    const token =
      localStorage.getItem("accessToken");

    if (!token) {
      message.error(
        "No token found, please log in"
      );
      return;
    }

    const res = await api.get(
      "/dashboard/teacher/summary-staff",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );
    setSummary(res.data);

  } catch (error) {

    console.error(
      "Error fetching summary:",
      error
    );

    message.error(
      "Failed to load teacher summary"
    );

  }

};
const fetchTeachers = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("No token found, please log in");
      return;
    }

    const res = await api.get("/teacher", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Teachers response:", res.data);

    // Use the list array from the response
    setTeachers(Array.isArray(res.data.list) ? res.data.list : []);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    setTeachers([]); // fallback
  }
};
 const fetchTeacherCount=async()=>{
    setLoading(true);
  try {
       const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("No token found, please log in");
      setLoading(false);
      return;
    }

    const res = await api.get("/teacher/total", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTeacherCount(res.data.totalTeacher);
  } catch (error) {
     console.error("Error fetching Teacher Total:", error);
  } finally {
    setLoading(false);
  }
}
// Update teacher
const handleUpdate = async (formData) => {
  try {
    const token = localStorage.getItem("accessToken");
    await api.put(`/teacher/${selectedTeacher.Id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    message.success("Updated teacher successfully");
    setOpen(false);
    fetchTeacherCount();
  } catch (error) {
    console.error(error);
    message.error("Update failed");
  }
};
const confirmUpdate = (teachers) => {
  Modal.confirm({
    title: "Confirm Update",
    content: `Do you want to update ${teachers.Name}'s information?`,
    okText: "Yes",
    cancelText: "No",
    onOk: () => {
      setSelectedTeacher(teachers);
      setMode("update");
      setOpen(true);
    },
  });
};

// Delete teacher soure
const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("accessToken");
    await api.delete(`/teacher/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    message.success("Teacher deleted successfully");
    fetchTeacherCount();
  } catch (error) {
    console.error(error);
    message.error("Delete failed");
  }
};
const confirmDelete = (teachers) => {
  Modal.confirm({
    title: "Confirm Delete",
    content: `Do you want to delete student ${teachers.Name}?`,
    okText: "Yes",
    cancelText: "No",
    onOk: () => {
      setSelectedTeacher(teachers);
      handleDelete(teachers.Id);
    },
  });
};

 // search + shift filter
const filteredTeachers = teachers.filter((teacher) => {
  const term = searchTerm.toLowerCase();

  const matchesSearch =
    teacher.Id?.toString().toLowerCase().includes(term) ||
    teacher.KhmerName?.toLowerCase().includes(term);

  // filter by Shift ENUM from DB
  const matchesShift =
    statusFilter === "all Shift" ||
    teacher.Shift?.toLowerCase() === statusFilter.toLowerCase();

  return matchesSearch  && matchesShift;
});

const columns = [
  { title: "ID", dataIndex: "TeacherCode", key: "TeacherCode" },
  { title: "Name", dataIndex: "Name", key: "Name" },
  { title: "Shift", dataIndex: "Shift", key: "Shift" },
  { title: "Address", dataIndex: "Address", key: "Address" },
  { title: "Phone", dataIndex: "Phone", key: "Phone" },
   {
      title: "Actions",
      render: (teachers) => (
        <Space>
          <EyeOutlined
                style={{ color: "#1890ff" }}
            />
             <EditOutlined
               style={{ color: "#52c41a" }}
              onClick={() => confirmUpdate(teachers)}
               />
          <DeleteOutlined
                style={{ color: "red" }}
                 onClick={() => confirmDelete(teachers)}
          />
        </Space>
      ),
    }
];
  return (
    <div style={{ padding: 30 }}>

      {/* Header */}
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={1} style={{fontFamily:"ui-sans-serif"}}>Teacher Management</Title>
        </Col>

      </Row>
      {/*MODAL */}
            <TeacherForm
            open={open}
            onCancel={() => {
                setOpen(false);
                setSelectedTeacher(null);
                setMode(null);
               }}
              onSubmit={mode === "update" ? handleUpdate : handleAddTeacher}
              initialValues={selectedTeacher}
              mode={mode}
/>

    {/* Statistics */}
<Row gutter={[16, 16]}>
  {[
    {
      title: "Total Teachers",
      value: summary.totalTeachers,
      icon: <UserOutlined />,
      color: "#1677ff",
      bg: "#e6f4ff",
    },
    {
      title: "Morning",
      value: summary.morningTeachers,
      icon: <SunOutlined />,
      color: "#52c41a",
      bg: "#f6ffed",
    },
    {
      title: "Afternoon",
      value: summary.afternoonTeachers,
      icon: <ClockCircleOutlined />,
      color: "#faad14",
      bg: "#fffbe6",
    },
    {
      title: "Evening",
      value: summary.eveningTeachers,
      icon: <MoonOutlined />,
      color: "#722ed1",
      bg: "#f9f0ff",
    },
    {
      title: "M + A",
      value: summary.morningAfternoonTeachers,
      icon: <SunOutlined />,
      color: "#13c2c2",
      bg: "#e6fffb",
    },
    {
      title: "M + E",
      value: summary.morningEveningTeachers,
      icon: <ClockCircleOutlined />,
      color: "#eb2f96",
      bg: "#fff0f6",
    },
    {
      title: "A + E",
      value: summary.afternoonEveningTeachers,
      icon: <MoonOutlined />,
      color: "#fa541c",
      bg: "#fff2e8",
    },
    {
      title: "All Shift",
      value: summary.allShiftTeachers,
      icon: <UserOutlined />,
      color: "#2f54eb",
      bg: "#f0f5ff",
    },
  ].map((item, index) => (
    <Col key={index} xs={24} sm={12} md={12} lg={6}>
      <Card
        bordered={false}
        hoverable
        style={{
          borderRadius: 14,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
        bodyStyle={{
          padding: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: item.bg,
              color: item.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            {item.icon}
          </div>

          <div>
            <div
              style={{
                fontSize: 12,
                color: "#8c8c8c",
                fontWeight: 500,
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#262626",
                lineHeight: 1.2,
              }}
            >
              {item.value || 0}
            </div>
          </div>
        </div>
      </Card>
    </Col>
  ))}
</Row>
      {/* Filters */}
      <Card style={{ marginTop: 25 }}>
        <Row gutter={16}>
          <Col span={10}>
            <Search placeholder="Search teachers..." allowClear 
             onChange={(e) => setSearchTerm(e.target.value)}
             />
          </Col>

          <Col span={9}>
            <Select
  value={statusFilter}
  onChange={(value) => setStatusFilter(value)}
  style={{ width: 250 }}
>
  <Option value="all Shift">All Shift</Option>

  <Option value="Morning">Morning</Option>
  <Option value="Afternoon">Afternoon</Option>
  <Option value="Evening">Evening</Option>

  <Option value="Morning + Afternoon">
    Morning + Afternoon
  </Option>

  <Option value="Morning + Evening">
    Morning + Evening
  </Option>

  <Option value="Afternoon + Evening">
    Afternoon + Evening
  </Option>

  <Option value="Morning + Afternoon + Evening">
    Morning + Afternoon + Evening
  </Option>
</Select>
          </Col >
          <Col span={2}>
          <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                      setSelectedTeacher(null);
                        setMode("add");
                        setOpen(true);
                      }}
                        >
                     បញ្ចូលគ្រូថ្មី
          </Button>
        </Col>
        </Row>
      </Card>
         {/* Teacher Table */}
   <Table
      columns={columns}
    //  dataSource={teachers}   // always an array
      dataSource={filteredTeachers}
      rowKey="TeacherCode"
      pagination={{ pageSize: 5 }}
    />
    </div>
  );
};

export default TeacherManagement;