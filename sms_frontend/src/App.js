import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/homepage.css";
import {
  SettingsProvider
} from "./context/SettingsContext";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/homePage";
import ForgetPage from "./pages/forgetPage";
import Verify from "./pages/verifyOtpPage";
import ResetNew from "./pages/resetNewPassPage";
//import StudentPage from "./pages/studentDashboard/studentPage";
import AdminPage from "./pages/admindashbord/adminPage";

import ProtectRoute from "./components/protectRoute";

//staff Page
import StaffPage from "./pages/StaffDashborad/StaffDashboard";
import Student from "./pages/StaffDashborad/Student/stuTab";
import Teacher from "./pages/StaffDashborad/Teacher/teacher";
import Attendance from "./pages/StaffDashborad/Attendance/Tab";
import Class from "./pages/admindashbord/ManageAcademic/Class/Tab";
import Dashboard from "./pages/StaffDashborad/dashboard";
import PaymentRecord from "./pages/StaffDashborad/Manage Payment/Tab";
import Report from "./pages/StaffDashborad/view Report/tab";
import ManageData from "./pages/StaffDashborad/ManageData/managementData";
import ManageFee from "./pages/StaffDashborad/Manage Fee/manageFee";



//admin Page
import DashboardAdmin from "./pages/admindashbord/homepage";
import User from "./pages/admindashbord/Manage User/user";
import AcademicYears from "./pages/admindashbord/ManageAcademic/years/years";
import Role from  "./pages/admindashbord/Manage User/role";
import Backup from "./pages/admindashbord/Manage System/backup";
import AcademicLevels  from "./pages/admindashbord/ManageAcademic/level/levels";
import AcademicClasses from "./pages/admindashbord/ManageAcademic/Class/class";
import AcademicSubject from "./pages/admindashbord/ManageAcademic/subject/subject";
import AdminapproveLeaveRequest from "./pages/admindashbord/Manage User/approve_leave_request_teacher";
import SettingAdmin from "./pages/admindashbord/Manage System/setting";
import SecurityAdmin from "./pages/admindashbord/Manage System/security";
import ActivityAdmin from "./pages/admindashbord/Manage System/activity_log";
import AdminReport from "./pages/admindashbord/Admin Report/tab";
//Teacher Page
import TeacherPage from "./pages/teacherDashboard/teacherPage";
import DashboardTeacher  from "./pages/teacherDashboard/dashboard";
//class
import AttendanceTab from "./pages/teacherDashboard/attendance/attendance";
import StudentList from "./pages/teacherDashboard/classe/studentList";
import ClassTab from "./pages/teacherDashboard/classe/tab";
//import InputScore from "./pages/teacherDashboard/classe/inputScore";
import ScoreList from './pages/teacherDashboard/classe/scoreList';
import GradeClass from "./pages/teacherDashboard/classe/grade";
//attendance
import AttendanceTeacher from "./pages/teacherDashboard/attendance/attendanceTeacher";
import AttendanceStudent from "./pages/teacherDashboard/attendance/attendanceStudent";
//import Setting from "./pages/teacherDashboard/setting/settingPage";

//setting page
import Profile from "./pages/teacherDashboard/setting/profile";

//student dashboard
import StudentDashboard from "./pages/student/studashboard";
import StudentPage from "./pages/studentDashboard/studentPage";
import ProfileStudent from "./pages/studentDashboard/viewprofile";
import StudentAttendace from "./pages/studentDashboard/viewattendace";
import TimeTable from "./pages/studentDashboard/timetable";
import StudentScore from "./pages/studentDashboard/result";
//import StudentSecurity from "./pages/studentDashboard/security";
import StudentPayment from "./pages/studentDashboard/payment";
import Pay from "./pages/studentDashboard/paymentTest";
//Dark mode
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgetpassword" element={<ForgetPage />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/resetnew" element={<ResetNew />} />

       {/* Protected routes */}
       <Route element={<ProtectRoute allowedRoles={["teacher"]} />}>
        <Route path="/teacher" element={<TeacherPage />}>
             <Route path="dashboard" element={<DashboardTeacher/> } />
             <Route path="attendance" element={<AttendanceTab />}>
                    <Route path="teacher" element={<AttendanceTeacher/>} />
                    <Route path="student" element={<AttendanceStudent/>} />
             </Route>
             <Route path="class" element={<ClassTab />}>
                    <Route index element={<StudentList />} />
                    <Route path="stulist" element={<StudentList />} />
                    <Route path="grade" element={<GradeClass />} />
                    <Route path="scorelist" element={<ScoreList />} />
        
                  </Route>

              <Route path="setting" >
               <Route path="profile" element ={<Profile/>} />
              </Route>

        </Route>
      </Route>
        
       <Route element={<ProtectRoute allowedRoles={["staff"]} />}>
            <Route path="/staff" element={<StaffPage />} >
                  <Route path="dashboard" element={< Dashboard/> } />
                  <Route path="student" element={< Student/>} />
                  <Route path="teacher" element ={< Teacher/>} />
                  <Route path="fee" element={< ManageFee/>}/>
                  <Route path="data" element={< ManageData/>}/>
                  <Route path="attendance" element={< Attendance/>} />
                  <Route path="payment" element ={< PaymentRecord/>} />
                  <Route path="class" element ={< Class/>} />
                  <Route path="report" element={< Report/>} /> 

          </Route>
        </Route>

        {
        /*<Route element={<ProtectRoute allowedRoles={["Student"]} />}>
            <Route path="/student" element={<StudentDashboard/>} >
                  <Route path="viewProfile" element={< Dashboard/> } />
                  <Route path="viewTimetable" element={< Student/>} />
                  <Route path="viewAttendance" element ={< Teacher/>} />
                  <Route path="paymentCoruse" element={< Attendance/>} />
                  <Route path="viewResults" element ={< PaymentRecord/>} />
                  <Route path="viewNotification" element ={< Class/>} />

          </Route>
        </Route>*/}

           < Route element={ <ProtectRoute allowedRoles={["student"]} />}>
          <Route path="/student" element={<StudentPage/>}>
            <Route path="profile" element={<ProfileStudent/>}/>
            <Route path="attendance" element={<StudentAttendace/>}/>
            <Route path="timetable" element={<TimeTable/>}/>
            <Route path="result" element={<StudentScore/>}/>
            <Route path="payment" element={< StudentPayment/>} />
            <Route path="pay" element={< Pay/>} />
             <Route path="payfee" element={< Pay/>} />
          </Route>
        </Route>

        <Route element={<ProtectRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={< AdminPage/>} >
                  <Route path="dashborad" element={<DashboardAdmin/>}/>
                  <Route path="user" element ={<User/>} />
                   <Route path="leaverequest" element ={<AdminapproveLeaveRequest/>} />
                  <Route path="role" element ={<Role/>} />
                  <Route path="years" element={<AcademicYears/>} />
                  <Route path="levels" element={<AcademicLevels/>} />
                  <Route path="classes" element={<AcademicClasses/>} />
                  <Route path="subject" element={<AcademicSubject/>} />
                  <Route path="backup" element={<Backup/>} />
                  <Route path="setting" element={<SettingAdmin/>} />
                  <Route path="security" element={<SecurityAdmin/>} />
                  <Route path="activitylogs" element={<ActivityAdmin/>}/>
                  <Route path="report" element={< AdminReport/> } />
        </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;