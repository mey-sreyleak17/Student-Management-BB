/* can connect for one connection
const mysql=require("mysql");
const db=mysql.createConnection({
     host:"localhost",
     user:"root",
     password:"",
     database:"databaseg7",
     port:"3306",
     connectionLimit:100,
     namePlacecholders:true
})
module.exports=db;*/
//for many connection limit

const mysql=require("mysql2/promise");
     const db=mysql.createPool({
          host:process.env.DB_HOST,
          user:process.env.DB_USER,
          password:process.env.DB_PASSWORD,
          database:process.env.DB_NAME,
          charset:"utf8mb4",
          port:"3306",
          connectionLimit:10,
          namedPlaceholders:true
     })
     module.exports=db;
