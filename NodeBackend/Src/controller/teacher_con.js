const { logerror } = require("../config/helper");
const db=require("../config/db");
const {generateYearCode}=require("../utils/codeGenerator");

const get_all_teacher=async(req,res)=>{
     try {
          //declear varible
          const [total]=await db.query("select count(Id) AS TotalRecord from teachers");
          const [list]=await db.query(`select * from teachers`);
               res.json({
                    list,
                    total
               });
     } catch (error) {
          logerror("getlist teacher",error,res);
     }
};

const  teacherSelect =async (req, res) => {

  const [rows] = await db.query(
    `
    SELECT Id,KhmerName,Name
    FROM teachers
    `
  );

  res.json(rows);
};
const  teacherSelectShift =async (req, res) => {

  const [rows] = await db.query(
    `
    SELECT Id,Shift
    FROM teachers
    `
  );

  res.json(rows);
};

const Teacher_Total = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT COUNT(*) AS totalTeacher FROM teachers`
    );

    // SQL
    res.json({ totalTeacher: results[0].totalTeacher });
  } catch (err) {
    logerror("Total Teacher", err, res);
  }
};
const get_one_teacher=async(req,res)=>{
     try {
          const Id = req.params.Id;
          var sql=` select * from teachers where Id=?`;
          const [list]=await db.query(sql,[Id]);
               res.json({
                    list:list
               })
     } catch (error) {
          logerror("get one teacher",error,res);
     }
}
//done
const create_teacher=async(req,res)=>{
     try {
          const {Name,KhmerName,Gender,DOB,Phone,Shift,Address}=req.body;
          const Image = req.file
   ? req.file.path
   : null;
          const TeacherCode=await generateYearCode(
               "teachers",
               "TeacherCode",
               "T"
          );
          await db.query(`
                         Insert Into teachers (TeacherCode,Name,KhmerName,Gender,DOB,Phone,Shift,Address,Image)
                         Values(?,?,?,?,?,?,?,?,?)`,
                         [TeacherCode,Name,KhmerName,Gender,DOB,Phone,Shift,Address,Image]
                    );
                         res.json({
                              message:"Teacher created",
                              TeacherCode
                         })

     } catch (error) {
         logerror("Create Teacher",error,res);
         console.log(req.body);
          console.log(req.file);
          if (err) {
      console.log(err);
}
     }
}
//done
const update_teacher = async (
   req,
   res
) => {

   try {

      const Id = req.params.Id;

      const {
         Name,
         KhmerName,
         Gender,
         DOB,
         Phone,
         Shift,
         Address
      } = req.body;

      const image =
         req.file
         ? req.file.path
         : req.body?.Image;

      const sql = `
         UPDATE teachers
         SET
            Name=?,
            KhmerName=?,
            Gender=?,
            DOB=?,
            Phone=?,
            Shift=?,
            Image=?,
            Address=?
         WHERE Id=?
      `;

      const [data] =
         await db.query(
            sql,
            [
               Name,
               KhmerName,
               Gender,
               DOB,
               Phone,
               Shift,
               image,
               Address,
               Id
            ]
         );

      res.json({

         message:
            data.affectedRows != 0
            ? "Teacher updated successfully"
            : "Teacher not found",

         data

      });

   } catch (error) {

      logerror(
         "Update Teacher",
         error,
         res
      );

   }

};
//done
const TeacherCount = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT LevelId, COUNT(*) AS count
      FROM teachers
      GROUP BY LevelId
    `);

    const total = rows.reduce((sum, r) => sum + r.count, 0);
    const levels = {};
    rows.forEach(r => {
      levels[r.LevelId] = r.count;
    });

    res.json({
      total,
      levels
    });
  } catch (err) {
    logerror("Teacher Count", err, res);
  }
};
//done
const remove_teacher=async(req,res)=>{
     try {
           const Id = req.params.Id;
          var sql=`Delete from teachers where Id=? `;
          const [data]=await db.query (sql,[Id]);
               res.json({
                    message:data.affectedRows !=0?
                     "Teacher Deleted"
                     :"Teacher Not Found",
                    data:data
               });
     } catch (error) {
          logerror("Delete Teacher",error,res);
     }
}



const assignClassSubject=async(req,res)=>{
     try {
          // Controller
          const { ClassId, SubjectId } = req.body;
          const { Id: TeacherId } = req.params;
        if (!ClassId || !SubjectId) {
            return res.status(400).json({
                message: "Class TeacherId and Subject  are required"
            });
        }
        var sql=`Insert Into teacher_class_subjects (ClassId,SubjectId,TeacherId)
                 Values (?,?,?)`;
          const params=[
               ClassId,
               SubjectId,
               TeacherId
          ];
          const [data]=await  db.query(sql,params);
               res.json({
                    error:false,
                    message:"Calss and Subject Assign  successed",
                    data:data
               });
     } catch (error) {
          logerror("Assign teacher to class",error,res);
     }
}
const teacher_update=async(req,res)=>{
     try {
          const TeacherId=req.user.Id;
          const {Name,KhmerName,TelegramPhone,Address}=req.body;
          //Images
          await db.query(`Update set teachers Name=?,KhmerName=?,TelegramPhone=? Address =?
               Where Id =?`,
          [Name,KhmerName,TelegramPhone,TeacherId]);
               res.json({
                    message:"Profile UpdatedSuccessfully"
               });
     } catch (error) {
          logerror("Teacher Update Profile",error,res);
     }
}
const getMyClasses = async (req, res) => {
    try {
        const TeacherId = req.user.Id;

        const [rows] = await db.query(`
            SELECT
                c.id AS ClassId,
                c.ClassName,
                s.Id AS SubjectId,
                s.SubjectName
            FROM teacher_class_subjects tcs
            JOIN classes c ON tcs.ClassId = c.Id
            JOIN subjects s ON tcs.SubjectId = s.Id
            WHERE tcs.TeacherId = ?
        `, [TeacherId]);

        res.json(rows);

    } catch (error) {
       logerror("Get my classes",error,res);
    }
};
// Get logged-in teacher’s classes not tested
const MyOwnClasses = async (req, res) => {
  try {
    const teacherId = req.user.Id; // from auth middleware

    const sql = `
      SELECT c.ClassName, s.SubjectName
      FROM teacher_class_subjects tcs
      JOIN classes c ON tcs.ClassId = c.Id
      JOIN subjects s ON tcs.SubjectId = s.Id
      WHERE tcs.TeacherId = ?
    `;
    const [rows] = await db.query(sql, [teacherId]);

    res.json({
      error: false,
      message: "Fetched assigned classes successfully",
      data: rows
    });
  } catch (error) {
    logerror("Get teacher classes", error, res);
  }
};


module.exports={
     get_all_teacher,
     get_one_teacher,
     Teacher_Total,
     create_teacher,
     update_teacher,
     remove_teacher,
     assignClassSubject,
     teacher_update,
     getMyClasses,
     MyOwnClasses,
     TeacherCount,
     teacherSelect,
     teacherSelectShift
}