import React,{useEffect,useState} from "react";
import {Row,Col,Card,Input,Select,Button,Tag,Typography,message,Space,Modal} from "antd";
import {PlusOutlined,DeleteOutlined, EditOutlined,EyeOutlined} from "@ant-design/icons";
import ClassForm from "./addclass";
import api from "../../../../Api/indext";
import {Table} from "antd";

const { Title, Text } = Typography;
const { Search } = Input;


const ClassManagement = () => {
    const [mode, setMode] = useState( "add"); // "add" or "update"
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [Class, setClass] = useState([]);  // array, not object
    const [selectedClass, setSelectedClass] = useState(null);
    // Get all teachers
    const [ClassCount, setClassCount] = useState(0); // start as number
    const [studentCount,setStudentCount]=useState(0);
    const [teacherCount,setTeacherCount]=useState(0);
    //search filters
     const [searchTerm, setSearchTerm] = useState("");
     const [subjectFilter, setSubjectFilter] = useState("all");
     const [statusFilter, setStatusFilter] = useState("all");
     //for select
    
     const handleAddClass = async (formData) => {
  try {
    const token = localStorage.getItem("accessToken");
    await api.post("/classes", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    message.success("Class added successfully");
    setOpen(false);
    fetchClassCount();
    fetchClasses();
  } catch (error) {
    console.error(error);
    message.error("Create failed");
  }
};

 useEffect(() => {
  fetchClassCount();
  fetchStudentCount();
  fetchClasses();
  fetchTeacherCount();
    
  }, []);

const fetchClasses = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("No token found, please log in");
      return;
    }

    const res = await api.get("/classes", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Classes response:", res.data);

    // Backend returns array directly
    setClass(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error("Error fetching Classes:", err);
    setClass([]); // fallback
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
const fetchClassCount = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("No token found, please log in");
      setLoading(false);
      return;
    }

    const res = await api.get("/classes/count", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setClassCount(res.data.totalClasses); // store the number
  } catch (err) {
    console.error("Error fetching Class count:", err);
  } finally {
    setLoading(false);
  }
};
const fetchStudentCount = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("No token found, please log in");
      setLoading(false);
      return;
    }

    const res = await api.get("/students/count", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setStudentCount(res.data.totalStudent); // store the number
  } catch (err) {
    console.error("Error fetching student count:", err);
  } finally {
    setLoading(false);
  }
};

// Update teacher
const handleUpdate = async (formData) => {
  try {
    const token = localStorage.getItem("accessToken");
    await api.put(`/classes/${selectedClass.Id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    message.success("Updated class successfully");
    setOpen(false);
    fetchClassCount();
    fetchClasses();
  } catch (error) {
    console.error(error);
    message.error("Update failed");
  }
};
const confirmUpdate = (Class) => {
  Modal.confirm({
    title: "Confirm Update",
    content: `Do you want to update class ${Class.ClassName}'s information?`,
    okText: "Yes",
    cancelText: "No",
    onOk: () => {
      setSelectedClass(Class);
      setMode("update");
      setOpen(true);
    },
  });
};

// Delete teacher soure
const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("accessToken");
    await api.delete(`/classes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    message.success("Class Remove successfully");
    fetchClassCount();
  } catch (error) {
    console.error(error);
    message.error("Delete failed");
  }
};
const confirmDelete = (Class) => {
  Modal.confirm({
    title: "Confirm Delete",
    content: `Do you want to delete  ${Class.ClassName}?`,
    okText: "Yes",
    cancelText: "No",
    onOk: () => {
      setSelectedClass(Class);
      handleDelete(Class.Id);
    },
  });
};

//  search + status filter done
  const filteredClasses = Class.filter((cls) => {
  const term = searchTerm.trim().toLowerCase();

  const matchesSearch =
    !term ||
    cls.Id?.toString().toLowerCase().includes(term) ||
    cls.ClassName?.toLowerCase().includes(term);

  const matchesSubject =
    subjectFilter.toLowerCase() === "all" ||
    cls.Subject?.toLowerCase() === subjectFilter.toLowerCase();

  const matchesStatus =
    statusFilter.toLowerCase() === "all" ||
    (statusFilter.toLowerCase() === "active" &&
      cls.Status?.toLowerCase() === "active") ||
    (statusFilter.toLowerCase() === "inactive" &&
      cls.Status?.toLowerCase() === "inactive");

  return matchesSearch && matchesSubject && matchesStatus;
});
 
const columns = [
  { title: "Class Code", dataIndex: "ClassCode", key: "Id" },
  { title: "Class Name", dataIndex: "ClassName", key: "ClassName" },
  { title: "Teacher Name", dataIndex: "TeacherName", key: "TeacherId" },
  { title: "Program Name", dataIndex: "ProgramName", key: "ProgramId" },
  { title: "Academic Year", dataIndex: "AcademicName", key: "AcademicYearId " },
  {
    title: "Actions",
    key: "actions",
    align: "center",
    render: (record) => (
      <Space>
        <EyeOutlined style={{ color: "#1890ff" }} />
        <EditOutlined
          style={{ color: "#52c41a" }}
          onClick={() => confirmUpdate(record)}
        />
        <DeleteOutlined
          style={{ color: "red" }}
          onClick={() => confirmDelete(record)}
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
          <Title level={2}>Class Management</Title>
          <Text type="secondary">
            Manage classes profiles and assignments
          </Text>
        </Col>

        <Col>
          <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                      setSelectedClass(null);
                        setMode("add");
                        setOpen(true);
                      }}
                        >
                     បង្កើតថ្នាក់ថ្មី
          </Button>
        </Col>
      </Row>
      {/*MODAL */}
            <ClassForm
            open={open}
            onCancel={() => {
                setOpen(false);
                setSelectedClass(null);
                setMode(null);
               }}
              onSubmit={mode === "update" ? handleUpdate : handleAddClass}
              initialValues={selectedClass}
              mode={mode}
/>

    {/* Statistics */}
<Row gutter={[16, 16]} style={{ marginTop: 25 }}>
  <Col span={6}>
    <Card style={{ padding: "12px", borderRadius: "8px", backgroundColor:"blanchedalmond" }}>
      <Text style={{ fontSize: "14px" }}>Total Classes</Text>
      <Title level={4} style={{ color: "#1677ff", margin: 0, fontSize:"25px" }}>
        {ClassCount}
      </Title>
    </Card>
  </Col>

    <Col span={6}>
    <Card style={{ padding: "12px", borderRadius: "8px", backgroundColor:"pink" }}>
      <Text style={{ fontSize: "14px" }}>Total Student</Text>
      <Title level={4} style={{ color: "#1677ff", margin: 0, fontSize:"25px" }}>
        {studentCount}
      </Title>
    </Card>
  </Col>

    <Col span={6}>
    <Card style={{ padding: "12px", borderRadius: "8px", backgroundColor:"blanchedalmond" }}>
      <Text style={{ fontSize: "14px" }}>Total Teacher</Text>
      <Title level={4} style={{ color: "#1677ff", margin: 0, fontSize:"25px" }}>
        {teacherCount}
      </Title>
    </Card>
  </Col>
</Row>

      {/* Filters */}
      <Card style={{ marginTop: 25 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Search placeholder="Search Calss..." allowClear 
                     onSearch={(value) => setSearchTerm(value)}
                     onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>

          <Col span={8}>
            <Select
              defaultValue="all"
              style={{ width: "100%" }}
              options={[
                { value: "all", label: "All Subjects" },
                { value: "math", label: "Mathematics" },
                { value: "cs", label: "Computer Science" },
                { value: "physics", label: "Physics" }
              ]}
            />
          </Col>

          <Col span={8}>
            <Select
              defaultValue="all"
              style={{ width: "100%" }}
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" }
              ]}
            />
          </Col>
        </Row>
      </Card>
         {/* class Table */}
   <Table
      columns={columns}
      dataSource={filteredClasses}   // always an array
      rowKey="Id"
      pagination={{ pageSize: 5 }}
    />
    </div>
  );
};

export default ClassManagement;