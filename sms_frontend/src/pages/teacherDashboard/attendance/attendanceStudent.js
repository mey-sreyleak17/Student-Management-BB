import React, { useState, useEffect } from "react";
import { Table, DatePicker, Card, Modal, Radio, Space, Button, Select, Typography, Spin,message } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../../Api/indext"; 

const { Title } = Typography;

const AttendancePage = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [daysInMonth, setDaysInMonth] = useState(selectedMonth.daysInMonth());
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [status, setStatus] = useState("present");
 const [selectedClassId, setSelectedClassId] = useState(null);
  // ============================
  // FETCH CLASSES (ហៅតែម្តងពេល Component Mount)
  // ============================
  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/attendance/classes/by-Teacher", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data || []);
    } catch (err) {
      console.error("FETCH CLASS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // ============================
  // FETCH STUDENTS BY CLASS ID
  // ============================
 const fetchStudents = async (classId) => {
    if (!classId) return;
    setLoading(true);
    try {
        const token = localStorage.getItem("accessToken");
        const monthStr = selectedMonth.format("YYYY-MM"); // ត្រូវបញ្ជូនខែទៅជាមួយ

        const res = await api.get(`/students/attendance/getlist-stu/${classId}?month=${monthStr}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setStudents(res.data);
    } catch (err) {
        console.error("Fetch Error:", err);
    } finally {
        setLoading(false);
    }
};
  const handleClassSelectStu = (value) => {
  setSelectedClassId(value); // ត្រូវមានជួរនេះ ដើម្បីយក ID ទៅប្រើពេល Save
  if (!value) {
    setStudents([]);
    return;
  }
  fetchStudents(value);
};

  const handleMonthChange = (date) => {
    if (!date) return;
    setSelectedMonth(date);
    setDaysInMonth(date.daysInMonth());
  };

  const openModal = (record, day) => {
    setSelectedStudent(record);
    setSelectedDay(day);
    setStatus(record[`day_${day}`] || "present");
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const newData = students.map((student) => {
      if (student.key === selectedStudent.key) {
        return { ...student, [`day_${selectedDay}`]: status };
      }
      return student;
    });
    setStudents(newData);
    setIsModalOpen(false);
  };
 const handleSaveAttendance = async () => {
    // ឆែកមើលថាបានរើសថ្នាក់ហើយឬនៅ
    if (!selectedClassId) {
        return message.warning("សូមជ្រើសរើសថ្នាក់រៀនសិន!");
    }

    try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        const payload = {
            classId: selectedClassId,
            month: selectedMonth.format("YYYY-MM"),
            attendanceData: students 
        };

        const res = await api.post("/attendance/student/save", payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        message.success("រក្សាទុកបានជោគជ័យ!");
    } catch (err) {
        console.error("Save Error:", err.response?.data);
        message.error("រក្សាទុកមិនបានសម្រេច (Error 400/500)");
    } finally {
        setLoading(false);
    }
};

  // ============================
  // TABLE COLUMNS CONFIG
  // ============================
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayColumns = days.map((day) => ({
    title: day,
    dataIndex: `day_${day}`,
    width: 50,
    align: "center",
    render: (value, record) => (
      <span onClick={() => openModal(record, day)} style={{ cursor: "pointer", display: "block", width: "100%" }}>
        {value === "present" && <CheckOutlined style={{ color: "green" }} />}
        {value === "permission" && <b style={{ color: "orange" }}>P</b>}
        {value === "absent" && <b style={{ color: "red" }}>A</b>}
        {!value && "-"}
      </span>
    ),
  }));

  const columns = [
    { title: "ID", dataIndex: "id", width: 100, fixed: "left" },
    { title: "Name", dataIndex: "name", width: 200, fixed: "left" },
    { title: "Gender", dataIndex: "gender", width: 100 },
    ...dayColumns,
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Title level={2} style={{ margin: 0 }}>Attendance Students</Title>
        <Space>
          <Select
            placeholder="Select a class"
            style={{ width: 250 }}
            onChange={handleClassSelectStu}
            allowClear
            showSearch
            optionFilterProp="label"
            loading={classes.length === 0}
            options={classes.map((cls) => ({
              value: cls.Id,
              label: cls.ClassName ? `${cls.ClassName} (ID: ${cls.Id})` : `Class ID: ${cls.Id}`, // បង្ហាញឈ្មោះថ្នាក់
            }))}
          />
          <DatePicker picker="month" value={selectedMonth} onChange={handleMonthChange} />
          <Button 
                  type="primary" 
                  onClick={handleSaveAttendance} // ហៅ Function ខាងលើ
                  loading={loading}             // បង្ហាញវិលៗពេលកំពុង Save
                  disabled={students.length === 0} // បើអត់ទាន់មានសិស្ស មិនឱ្យចុចទេ
                >
                  Save attendance
                </Button>
        </Space>
      </div>

      <Card style={{ borderRadius: 16 }}>
        <div style={{ textAlign: "right", marginBottom: 10, fontWeight: "bold" }}>
          <span style={{ color: "green" }}><CheckOutlined /> Present</span> | 
          <span style={{ color: "orange" }}> P: Permission</span> | 
          <span style={{ color: "red" }}> A: Absent</span>
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={students}
            pagination={false}
            scroll={{ x: 2000, y: 500 }}
            bordered
          />
        </Spin>
      </Card>

      <Modal
        title="Take Attendance"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Confirm"
      >
        {selectedStudent && (
          <Space direction="vertical">
            <p><b>Student:</b> {selectedStudent.name}</p>
            <p><b>Date:</b> {selectedDay} {selectedMonth.format("MMMM YYYY")}</p>
            <Radio.Group value={status} onChange={(e) => setStatus(e.target.value)} buttonStyle="solid">
              <Radio.Button value="present">Present</Radio.Button>
              <Radio.Button value="permission">Permission</Radio.Button>
              <Radio.Button value="absent">Absent</Radio.Button>
            </Radio.Group>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default AttendancePage;