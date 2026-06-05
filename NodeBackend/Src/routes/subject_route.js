const subject_con = require("../controller/subject_con");
const adminOnly = require("../middlewares/adminOnly");
const auth = require("../middlewares/auth");
const role=require("../middlewares/roles");

const subject = (app)=>{
     app.get("/api/subject",auth,adminOnly,subject_con.getAll);
     app.post("/api/subject/create", auth,adminOnly,subject_con.create);
     app.put("/api/subject/:Id",auth,adminOnly,subject_con.update);
     app.delete("/api/subject/:Id",auth,adminOnly,subject_con.remove);

};
module.exports=subject;