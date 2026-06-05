const fs =require('fs').promises;
const moment=require('moment');
const multer=require("multer");
const path = require("path");
const { config } = require('process');
//create function logerror
const logerror = async (controller = "user.list", message = "error message", res) => {
  try {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const folder = `./logs/${controller}.txt`;
    const logMessage = `[${timestamp}]  ${message}\n\n`;

    await fs.appendFile(folder, logMessage);
  } catch (error) {
    console.error('error writing to log file', error);
  }
  // Only send a response if it hasn't already been sent
  if (res && !res.headersSent) {
    res.status(500).send("Internal server error");
  }
};
const isEmptyorNull=(value)=>{
     if(value==null || value==""|| value==undefined){
          return true;
     }
     return false;
}
const upload = multer({
  storage:multer.diskStorage({
      destination:function(req,file,callback){ // image path
          callback(null,"C:/xampp/htdocs/schoolSystem/image/")
      },
      filename : function(req,file,callback){
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          callback(null, file.fieldname + '-' + uniqueSuffix)
      }
  }),
  limits:{
      fileSize : (1024*1024) * 3 // max 3MB
  },
  fileFilter: function(req,file,callback){
      if(file.mimetype != "image/png" && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg'){
          // not allow
          callback(null,false)
      }else{
          callback(null,true)
      }
  }
})

const upload_student_excel = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "C:/xampp/htdocs/schoolSystem/excel/");
    },
    filename: function (req, file, callback) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);

      // keep original extension (.xlsx or .xls)
      const ext = path.extname(file.originalname);

      callback(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
  }),

  limits: {
    fileSize: (1024 * 1024) * 5 // 5MB (Excel usually bigger)
  },

  fileFilter: function (req, file, callback) {
    const allowedTypes = [
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error("Only Excel files are allowed!"), false);
    }

    callback(null, true);
  }
});
const removeFile = async (fileName) => {
  var filePath = "C:/xampp/htdocs/schoolSystem/image/"
  try {
      await fs.unlink(filePath+fileName);
      return 'File deleted successfully';
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err;
  }
}
const teacher_upload = multer({
  storage:multer.diskStorage({
      destination:function(req,file,callback){ // image path
          callback(null,"C:/xampp/htdocs/schoolSystem/teacher_image/")
      },
      filename : function(req,file,callback){
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          callback(null, file.fieldname + '-' + uniqueSuffix)
      }
  }),
  limits:{
   fileSize : (1024*1024) * 5
},
  fileFilter: function(req,file,callback){
      if(file.mimetype != "image/png" && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg'){
          // not allow
          callback(null,false)
      }else{
          callback(null,true)
      }
  }
})
module.exports={
    logerror,
    isEmptyorNull,
    upload,
    removeFile,
    teacher_upload,
    upload_student_excel
}