const user_con=require("../controller/user_con");
const adminOnly=require("../middlewares/adminOnly");
const auth=require("../middlewares/auth");
const user=(app)=>{
     //Only admin use
     app.get("/api/user/profile",auth,user_con.get_profile);
     app.get("/api/user",auth,adminOnly,user_con.getAll);//get all user
     app.post("/api/user/create",auth,adminOnly,user_con.create);//get a user
     app.put("/api/user/profile", auth  , user_con.update_profile);
     app.put("/api/user/:id",auth,adminOnly,user_con.update);//:Id update
     app.delete("/api/user/:id",auth,adminOnly,user_con.remove);//delete user by ID
}
module.exports=user;