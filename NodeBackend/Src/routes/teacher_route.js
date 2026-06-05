//const { teacher_upload } = require("../config/helper");
const auth = require("../middlewares/auth");
const adminOnly = require("../middlewares/adminOnly");
const teacherOnly = require("../middlewares/teacherOnly");
const teacher_con = require("../controller/teacher_con");
const staffOnly =require("../middlewares/staffOnly");
const role=require("../middlewares/roles");
const {
  createUpload
} = require(
  "../config/cloudinary"
);

const teacher_upload =
  createUpload(
    "teacher_images"
  );
const teacher = (app) => {
    // admin + staffonly
    app.get("/api/teachers/select", auth,role("staff","admin"),teacher_con.teacherSelect);
     app.get("/api/teachers/select-shift", auth,role("staff","admin"),teacher_con.teacherSelectShift);
    app.get("/api/teacher", auth, role("staff","admin"), teacher_con.get_all_teacher);
    app.get("/api/teacher/count", auth, role("staff","admin"), teacher_con.TeacherCount);
    app.get("/api/teacher/total",auth,role("staff","admin"),teacher_con.Teacher_Total);
    //keep dynamic routes LAST
    app.get("/api/teacher/:Id", auth, role("staff","admin"), teacher_con.get_one_teacher);
    app.post("/api/teacher", auth, role("staff","admin"), teacher_upload.single("Image"), teacher_con.create_teacher);
    
    app.put("/api/teacher/:Id", auth, staffOnly, teacher_upload.single("Image"), teacher_con.update_teacher);

    app.delete("/api/teacher/:Id", auth, adminOnly, teacher_con.remove_teacher);

    //not completed
    app.put("/api/teacher/:Id/assign-class-sub", auth,staffOnly, teacher_con.assignClassSubject);
    app.get("/api/teacher/classes/me", auth, teacherOnly, teacher_con.MyOwnClasses); // get assigned classes

};

module.exports = teacher;