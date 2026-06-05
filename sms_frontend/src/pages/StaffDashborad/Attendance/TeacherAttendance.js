import React, { useState ,useEffect} from "react";
import api from "../../../Api/indext";
import {
  Card, Row, Col, Typography, Input, Select, Table, Tag, 
  Button, Space, DatePicker, Statistic,message
} from "antd";
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;


const translations = {
  en: {
    title: "Attendance Management",
    subtitle: "Track and manage attendance for students and teachers",
    totalTeachers: "Total Teachers",
    checkedIn: "Checked In",
    checkedOut: "Checked Out",
    absent: "Absent",
    rate: "Permession",
    searchPlaceholder: "Search teacher ID...",
    allDept: "All Subject",
    colTeacher: "Teacher",
    colDept: "Department",
    colIn: "Check-In",
    colOut: "Check-Out",
    colHours: "Total Hours",
    colLoc: "Location",
    colStatus: "Status",
    colAction: "Actions",
    btnCheckIn: "Check In",
    btnCheckOut: "Check Out",
    completed: "Completed"
  },
  kh: {
    title: "ការគ្រប់គ្រងវត្តមាន",
    subtitle: "តាមដាន និងគ្រប់គ្រងវត្តមានសម្រាប់សិស្ស និងគ្រូបង្រៀន",
    totalTeachers: "គ្រូបង្រៀនសរុប",
    checkedIn: "បានចូល",
    checkedOut: "បានចេញ",
    absent: "អវត្តមាន",
    rate: "សុំច្បាប់",
    searchPlaceholder: "ស្វែងរក​​តាមអាយឌីរបស់គ្រូ...",
    allDept: "គ្រប់ដេប៉ាតឺម៉ង់",
    colTeacher: "គ្រូបង្រៀន",
    colDept: "ដេប៉ាតឺម៉ង់",
    colIn: "ម៉ោងចូល",
    colOut: "ម៉ោងចេញ",
    colHours: "ម៉ោងសរុប",
    colLoc: "ទីតាំង",
    colStatus: "ស្ថានភាព",
    colAction: "សកម្មភាព",
    btnCheckIn: "កត់ត្រាចូល",
    btnCheckOut: "កត់ត្រាចេញ",
    completed: "រួចរាល់"
  }
};


const  AttendanceManagement = ()=> {
  // define varible
  const [lang] = useState(localStorage.getItem("language") || "en");
  const t = translations[lang];
  const [loading, setLoading] = useState(false);
  const [attendanceTeacher, setAttendanceTeacher] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [teacherCount,setTeacherCount]=useState(0);
  const [attendace_summary,setAttendanceSum]=useState(0);
  const [CheckInCount,setCheckedInCount]=useState(0);
  const [CheckOutCount,setCheckedOutCount]=useState(0);
  const [AbsentCount,setAbsentCount]=useState(0);
  const [LateCount,setLateCount]=useState(0);
  const [Permession,setPermission]=useState(0);
 //create function
    const fetchAttendanceTeacher = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        message.error("No token found, please log in");
        setLoading(false);
        return;
      }
      const res = await api.get("/attendance/teacher", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceTeacher(res.data.list);
    } catch (err) {
      console.error(err.response?.data || err.message);
      message.error("Failed to load attendance Teacher");
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
      fetchAttendanceTeacher();
      fetchTeacherCount();
      AttendanceSummary();
    }, []);

    const columns = [
    { title: "ID", dataIndex: "Id" },
     { title: "Teacher ID", dataIndex: "TeacherId" },
    { title: "Attendance Date", dataIndex: "AttendanceDate" },
    { title: "CheckIn Time", dataIndex: "CheckInTime" },
    { title: "CheckOut Time", dataIndex: "CheckOutTime" },
    {
      title: "Status",
      render: () => <Tag color="green">Active</Tag>,
    }
  ];

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
const AttendanceSummary = async () => {
  setLoading(true); // 1. Must pass true

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("No token found, please log in");
      setLoading(false);
      return;
    }

    const res = await api.get("/attendance/today-summary", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 2. Match these keys to your Backend res.json()
    const data = res.data;
    setCheckedInCount(data.checked_in_today);
    setCheckedOutCount(data.checked_out_today);
    setAbsentCount(data.absent_today);
    setLateCount(data.late_today);
    setPermission(data.permission_rate);

  } catch (error) {
    // 3. Always handle the error UI-wise
    console.error("Summary Fetch Error:", error);
    //message.error("Failed to load dashboard statistics");
  } finally {
    // 4. This runs whether the try succeeds OR fails
    setLoading(false);
  }
};
//  search + status filter done
    const filteredAttendance = attendanceTeacher.filter((attendance) => {
    const matchesSearch =
      (attendance.AttendanceDate && attendance.AttendanceDate.toString().includes(searchTerm)) ||
      (attendance.TeacherId && attendance.TeacherId.toString().includes(searchTerm));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && attendance.Status === "Active") ||
      (statusFilter === "inactive" && attendance.Status === "Inactive");

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: "10px 0" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>{t.title}</Title>
        <Text type="secondary">{t.subtitle}</Text>
      </div>

      {/* STATISTICS - Using AntD Statistic for a cleaner look */}
      <Row gutter={[16, 16]}>
  {[
    { label: t.totalTeachers, val: teacherCount, icon: <UserOutlined />, color: "#1890ff" },
    { label: t.checkedIn, val: CheckInCount, icon: <LoginOutlined />, color: "#52c41a" },
    { label: t.checkedOut, val: CheckOutCount, icon: <LogoutOutlined />, color: "#13c2c2" },
    { label: t.absent, val: AbsentCount, icon: <CloseCircleOutlined />, color: "#ff4d4f" },
    { label: t.rate, val: Permession, icon: null, color: "#722ed1" }
  ].map((item, idx) => (
    <Col xs={24} sm={12} lg={4} key={idx}>
      <Card
        bordered={false}
        style={{ borderRadius: 8, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}
      >
        <Statistic
          title={<Text type="secondary">{item.label}</Text>}
          value={item.val}
          prefix={item.icon}
          valueStyle={{ color: item.color, fontWeight: "bold" }}
        />
      </Card>
    </Col>
  ))}
</Row>


      {/* FILTER BOX */}
      <Card bordered={false} style={{ marginTop: 24, borderRadius: 8, background: "#f9f9f9" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <Input prefix={<SearchOutlined />} placeholder={t.searchPlaceholder} size="large" allowClear 
               style={{ width: 350 }}
              onSearch={(value) => setSearchTerm(value)}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={12} md={7}>
            <DatePicker
                  style={{ width: "100%" }}
                  size="large"
                  allowClear
                  onChange={(date, dateString) => setSearchTerm(dateString)}
              />

          </Col>
          <Col xs={12} md={7}>
            <Select defaultValue="all" style={{ width: "100%" }} size="large">
              <Option value="all">{t.allDept}</Option>
              <Option value="cs">Computer Science</Option>
              <Option value="math">Mathematics</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* TABLE */}
      <div style={{ marginTop: 24, background: "#fff", borderRadius: 8 }}>
        <Table
          columns={columns}
          dataSource={filteredAttendance}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 800 }} // Makes it look good on small screens
        />
      </div>
    </div>
  );
};
export default AttendanceManagement;