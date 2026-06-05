const student_con = require("../controller/student_con");
const { upload_student_excel } = require("../config/helper");
const auth = require("../middlewares/auth");
const role = require("../middlewares/roles");
const staffOnly = require("../middlewares/staffOnly");
const {
  createUpload
} = require(
  "../config/cloudinary"
);

const student_upload =
  createUpload(
    "student_images"
  );
const student = (app) => {

  // ==============================
// GET Profile
app.get(
  "/api/student/profile",
  auth,
  student_con.getStudentProfile
);

// GET: /api/enrollments
// ==============================
  app.get("/api/students/enroll",auth,role("staff","admin") ,student_con.get_enrollments);
  app.get(
    "/api/students",
    auth,
    staffOnly,
    student_con.get_all_student
  );
  app.get("/api/students/count",
    auth,role("staff","admin"),
    student_con.getStudentCount);
  app.get("/api/students/select",auth,role("admin","staff"),student_con.StudentSelect);
 // 🔹 TEACHER + STAFF
  app.get(
    "/api/students/class/:ClassId",
    auth,
    role("staff", "teacher"),
    student_con.getStudentsByClass
  );

  app.get(
    "/api/students/:Id/attendance",
    auth,
    role("staff", "teacher"),
    student_con.getStudentAttendanceHistory
  );

  app.get(
    "/api/students/:Id/payments",
    auth,
    role("admin", "staff"),
    student_con.getStudentPayments
  );
  // ==============================
// GET ONE
// GET: /api/enrollments/:id
// ==============================
  app.get("/api/students/enroll/:id", auth,staffOnly,staffOnly,student_con.get_one_enrollment);

  app.get(
    "/api/students/:Id",
    auth,
    staffOnly,
    student_con.get_one_student
  );
// 🔹 STAFF ONLY
  app.post(
    "/api/students",auth,staffOnly,
    student_upload.single("Image"),
    student_con.create_student
  );
  app.put(
    "/api/students/:Id",
    auth,
    role("staff","student"),
    student_upload.single("Image"),
    student_con.update
  );

  app.delete(
    "/api/students/:Id",
    auth,
    staffOnly,
    student_con.delete_student
  );

  app.post(
    "/api/students/import",
    auth,
    staffOnly,
    upload_student_excel.single("file"),
    student_con.ImportUploadStudents
  );

 

  // ==============================
// CREATE
// POST: /api/enrollments
// ==============================
  app.post("/api/students/enroll", auth,staffOnly,student_con.create_enrollment);

// ==============================
// UPDATE
// PUT: /api/enrollments/:id
// ==============================
  app.put("/api/students/enroll/:id",auth,staffOnly,student_con. update_enrollment);


// ==============================
// DELETE
// DELETE: /api/enrollments/:id
// ==============================
  app.delete("/api/students/enroll/:id",auth,staffOnly,student_con. delete_enrollment);
};

module.exports = student;