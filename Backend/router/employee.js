const express=require("express");
const db=require("../sqlite")
const router=express();

router.get("/",(req,res)=>{
    db.all(`select * from employee`,(err,row)=>{
        if(err){
            console.log("Data base error");
            return res.status(500).json({error:"Database get error"});
        }else{
            return res.json(row);
        }
    });
});

router.get("/:id",(req,res)=>{
    let id=req.params.id;
    db.all(`select * from employee where _id=?`,[id],(err,row)=>{
        if(err){
            console.log("Data base error");
            return res.status(500).json({error:"Database get error"});
        }else{
            return res.json(row);
        }
    });
});

router.post("/",(req,res)=>{
    let values=req.body;
    db.run(`insert into employee (name,email,mobile_number,position,gender,DOB)
         values(?,?,?,?,?,?)`,[values.name,values.email,values.mobile_number,values.position,values.gender,values.DOB],
         (err)=>{
        if(err){
            console.log("Data base error",err);
            return res.status(500).json({error:"Database error"});
        }else{
            return res.json({success:"insert success"});
        }
    });
});

router.put("/:id",(req,res)=>{
    let id=req.params.id;
    let values=req.body;
    db.run(`update employee set name=?,email=?,mobile_number=?,position=?,gender=?,DOB=? where _id=?`,
        [values.name,values.email,values.mobile_number,values.position,values.gender,values.DOB,id],
         (err)=>{
        if(err){
            console.log("Data base error",err);
            return res.status(500).json({error:"Database error"});
        }else{
            return res.json({success:"update success"});
        }
    });
});

router.delete("/:id",(req,res)=>{
    let id=req.params.id;
    db.run(`delete from employee where _id=?`,[id],
         (err)=>{
        if(err){
            console.log("Data base error",err);
            return res.status(500).json({error:"Database error"});
        }else{
            return res.json({success:"delete success"});
        }
    });
});

module.exports=router;