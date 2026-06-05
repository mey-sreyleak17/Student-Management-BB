require("dotenv").config();
require(
  "./Src/services/backupCron"
);
const express=require("express");
const cors =require("cors");//for connect to frontend
const app =express();
app.use(express.json());
app.use(express.urlencoded({
     extended:true
}));

app.use(cors({
     "origin":"*",
     "methods":"GET,HEAD,PATCH,POST,DELETE,PUT"
}));

app.get("/",(req,res)=>{
     res.send("Welcome to Bright Brain School");
})

app.get("/api",(req,res)=>{
     res.send("Get Data by API");
})
//console.log("REFRESH_SECRET:", process.env.REFRESH_SECRET);
//important  my route
const user=require("./Src/routes/user_route");
const auth=require("./Src/routes/auth_route");
const log=require("./Src/routes/log_route");
const student=require("./Src/routes/student_route");
const teacher =require("./Src/routes/teacher_route");
const attendance=require("./Src/routes/attendance_route");
const classes =require("./Src/routes/class_route");
const report=require("./Src/routes/report_route");

const fees =require("./Src/routes/fee_route");
const payment=require("./Src/routes/payment_route");
const academic =require("./Src/routes/acsdemic_route");
const subject=require("./Src/routes/subject_route");
const level=require("./Src/routes/level_route");
const dashboard =require("./Src/routes/dashboard_route");
const setting =require("./Src/routes/setting_route");
const backup =require("./Src/routes/backup_route");
const timetable =require("./Src/routes/timeTable_route");
const score =require("./Src/routes/score_route");
const leave_request=require("./Src/routes/leave_request_route");
const notification =require("./Src/routes/notification_route");



     notification(app);
     leave_request(app);
     score(app);
     backup(app);
     timetable(app);
     setting(app);
     dashboard(app);
     subject(app);
     level(app);
     academic(app);
     payment(app);
     fees(app);
     report(app);
     attendance(app);
     student(app);
     log(app);
     user(app);
     auth(app);
     teacher(app);
     classes(app);
const port=8001;
app.listen(port,()=>{
     console.log("http://localhost:"+port);
});