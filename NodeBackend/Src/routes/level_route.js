const level_con = require("../controller/level_con");
const adminOnly = require("../middlewares/adminOnly");
const auth = require("../middlewares/auth");
const role=require("../middlewares/roles");

const level = (app)=>{
     app.get("/api/levels/select",auth,role("staff","admin"),level_con.LevelSelect);
     app.get("/api/programs/select",auth,role("staff","admin"),level_con.ProgramSelect);
     app.get("/api/level",auth,adminOnly,level_con.getAll);
     app.post("/api/level/create", auth,adminOnly,level_con.create);
     app.put("/api/level/:id",auth,adminOnly,level_con.update);
     app.delete("/api/level/:id",auth,adminOnly,level_con.remove);

};
module.exports=level;