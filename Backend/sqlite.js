const sql=require("sqlite3");

const db= new sql.Database(".mysql.sqlite",(err)=>{
    if(err){
        console.log("Database error")
    }else{
        console.log("Sqlite Connected");
    }
});

db.run(`create table if not exists employee
    (_id INTEGER  primary key AUTOINCREMENT,
    name TEXT,
    email TEXT unique,
    position TEXT,
    mobile_number TEXT unique,
    gender TEXT,
    DOB TEXT )`);

module.exports=db;