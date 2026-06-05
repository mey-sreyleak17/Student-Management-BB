const academic_con = require("../controller/academic_con");
const adminOnly = require("../middlewares/adminOnly");
const auth = require("../middlewares/auth");
const role=require("../middlewares/roles");

const academic = (app)=>{
     app.get("/api/academic",auth,adminOnly,academic_con.getAll);
     app.post("/api/academic/create", auth,adminOnly,academic_con.create);
     app.put("/api/academic/:Id",auth,adminOnly,academic_con.update);
     app.delete("/api/academic/:Id",auth,adminOnly,academic_con.remove);

};
module.exports=academic;