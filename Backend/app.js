const express = require("express");
const cors = require("cors");
const employee=require("./router/employee");
const { json } = require("body-parser");


const app=express();

app.use(cors());
app.use(json());
app.use("/api/employee",employee)

const port=3000;

app.listen(port,()=>{
    console.log(`Server is start on http://localhost:${port}`);
});