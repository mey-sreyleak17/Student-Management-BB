import React, { useState,useEffect } from "react";
import {Card,Typography,Button,Space,Divider,message,Table,Tag,Avatar,open,setOpen} from "antd";
import {LoginOutlined,LogoutOutlined,CalendarOutlined,UserOutlined } from "@ant-design/icons";
import api from "../../../Api/indext";
import RequestPermissionForm from "./permissionform";
const { Title, Text } = Typography;

const AttendanceCard = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state
  const [permission,setPermission]=useState(false);
  const [form, setForm] = useState({
  startDate: "",
  endDate: "",
  reason: ""
});
 const [open, setOpen] = useState(false);
const buttonStyle = {
  width: 160,
  height: 90,
  borderRadius: 12,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 16,
  fontWeight: 500
};
  //  Get Location
 // Helper to get GPS coords
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Geolocation not supported"));
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

 const handleCheckIn = async () => {
    console.log("កំពុងចាប់យកទីតាំង...");

    if (!navigator.geolocation) {
        alert("Browser របស់អ្នកមិនគាំទ្រការចាប់ទីតាំងទេ។");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            console.log(`ទីតាំងដែលចាប់បាន: ${lat}, ${lng}`);
            
            // ១. ទាញយក Token មកទុកក្នុង variable តែមួយដើម្បីកុំឱ្យច្រឡំឈ្មោះ
            const token = localStorage.getItem("accessToken"); 

            if (!token) {
                alert("រកមិនឃើញ Token ទេ សូមចូលប្រើប្រាស់ (Login) ម្តងទៀត!");
                return;
            }

            try {
                // ២. ផ្ញើទៅកាន់ Backend Port 8001
                const response = await fetch('http://localhost:8001/api/attendance/teacher/check-in', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // ប្រើ variable 'token' ដែលយើងទាញបានពីខាងលើ
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ lat, lng })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("✅ " + data.message);
                    loadAttendanceHistory();
                } else {
                    // ប្រសិនបើលោត Invalid token ទៀត មកពី Token ហួសកំណត់ (Expired)
                    alert("⚠️ " + (data.message || "មានបញ្ហាអ្វីមួយ!"));
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                alert("មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ Server!");
            }
        },
        (error) => {
            let msg = "សូមអនុញ្ញាត (Allow) ទីតាំងលើ Browser ដើម្បី Check-in";
            if (error.code === 1) msg = "អ្នកបានបដិសេធការផ្តល់ទីតាំង (Permission Denied)";
            alert(msg);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
};
  const handleCheckOut = async () => {
    console.log("កំពុងចាប់យកទីតាំងសម្រាប់ Check-out...");

    if (!navigator.geolocation) {
        alert("Browser របស់អ្នកមិនគាំទ្រការចាប់ទីតាំងទេ។");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            const token = localStorage.getItem("accessToken"); 

            if (!token) {
                alert("សូម Login ម្ដងទៀត!");
                return;
            }

            try {
                const response = await fetch('http://localhost:8001/api/attendance/teacher/check-out', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ lat, lng })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("✅ " + data.message);
                } else {
                    alert("⚠️ " + data.message);
                }
            } catch (err) {
                alert("មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ Server!");
            }
        },
        (error) => {
            alert("សូមអនុញ្ញាត (Allow) ទីតាំងលើ Browser ដើម្បី Check-out!");
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
};
 const handlePermission = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("accessToken"); 
    const res = await api.post(
      "/attendance/teacher/permission",
      {
        startDate: form.startDate,
        EndDate: form.endDate, // Backend uses capital 'E'
        Reason: form.reason     // Backend uses capital 'R'
      },
      {
        headers: {
         'Authorization': `Bearer ${token}` 
        },
      }
    );

    message.success(res.data.message);
    setOpen(false); // Close the modal on success
    setPermission(true); // Disable the button if needed

  } catch (error) {
    message.error(error.response?.data?.message || "Request failed");
  } finally {
    setLoading(false);
  }
};

const loadAttendanceHistory =
  async () => {
    try {

      const token =
        localStorage.getItem(
          "accessToken"
        );

      const res =
        await api.get(
          "/attendance/teacher/history",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setRecords(
        res.data.map(
          (
            item,
            index
          ) => ({
            key: index,

            date:
              item.AttendanceDate,

            checkIn:
              item.CheckInTime,

            checkOut:
              item.CheckOutTime,

            location:
              `${item.Latitude}, ${item.Longitude}`,

            status:
              item.Status,
          })
        )
      );

    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
  loadAttendanceHistory();
}, []);
  //  Table Columns
  const columns = [
    { title: "Date", dataIndex: "date" },
    { title: "Check In", dataIndex: "checkIn" },
    { title: "Check Out", dataIndex: "checkOut" },
    { title: "Location", dataIndex: "location" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {

  let color = "green";

  if (
    status ===
    "Late"
  )
    color =
      "orange";

  if (
    status ===
    "Absent"
  )
    color =
      "red";

  return (
    <Tag color={color}>
      {status}
    </Tag>
  );
}
    }
  ];

  return (
    <Card
      style={{
        width:"600px",
        margin:"auto",
        marginTop:"10px",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 5px 12px rgba(0,0,0,0.08)"
      }}
    >
     
      <Title level={2} style={{textAlign: "center"}}>Take Attendance</Title>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
        <Space size="large" wrap>
          <Button
      type="primary"
      icon={<LoginOutlined />}
      disabled={checkedIn}
      loading={loading} // Added loading feedback
      onClick={handleCheckIn}
      style={buttonStyle}
    >
      Check In
    </Button>

         <Button
      danger
      icon={<LogoutOutlined />}
      disabled={checkedOut}
      loading={loading} // Added loading feedback
      onClick={handleCheckOut}
      style={buttonStyle}
    >
      Check Out
    </Button>

<RequestPermissionForm
  open={open}
  setOpen={setOpen}
/>
        </Space>
      </div>

      <Divider />

      {/* Table */}
      <Title level={4}>Attendance History</Title>
      <Table
        columns={columns}
        dataSource={records}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default AttendanceCard;