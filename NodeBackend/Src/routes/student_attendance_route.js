const user_con=require("../controller/user_con");
const teacherOnly=require("../middlewares/adminOnly");
const role =require("../middlewares/roles");
const auth=require("../middlewares/auth");
const student_attendance=(app)=>{
     //Only admin use
     app.get("/api/",auth,adminOnly,user_con.getAll);//get all user
     app.get("/api/user/create",auth,adminOnly,user_con.create);//get a user
     app.put("/api/user/:Id",auth,adminOnly,user_con.update);//:Id update
     app.delete("/api/user/:Id",auth,adminOnly,user_con.remove);//delete user by ID
}
module.exports=student_attendance;