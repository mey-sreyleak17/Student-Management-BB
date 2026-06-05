const class_con = require("../controller/class_con");
const adminOnly = require("../middlewares/adminOnly");
const staffOnly=require("../middlewares/staffOnly");
const auth = require("../middlewares/auth");
const role=require("../middlewares/roles");

const classes = (app)=>{
     app.get("/api/classes",auth,role("staff","admin"),class_con.getAllClasses);
     app.get("/api/classes/select", auth,role("staff","admin"),class_con.ClassSelect);
     app.get("/api/classes/count",auth,role("staff","admin"),class_con.getClassCount);
     app.get("/api/classes/:Id",auth,staffOnly,class_con.getClassById);
     app.post("/api/classes",auth,adminOnly,class_con.addClass);
     app.put("/api/classes/:Id",auth,adminOnly,class_con.updateClass);
     app.delete("/api/classes/:Id",auth,adminOnly,class_con.deleteClass);
     //select data
     app.get("/api/academic/select",auth,role("staff","admin"),class_con.AcademicSelect);
    // app.get("/api/teachers/select", auth,role("staff","admin"),class_con.teacherSelect);
    // app.get("/api/students/select",auth,adminOnly,class_con.StudentSelect);
     app.get("/api/staff/select",auth,adminOnly,class_con.StaffSelect);
};
module.exports=classes;