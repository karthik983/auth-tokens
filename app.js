const express=require("express");
const app=express();
const config=require("config");

const port=process.env.PORT|| config.get("PORT");

const dbcon=require("./dbconnect")
dbcon()

app.use(express.urlencoded({ extended: false }))
 
app.use(express.json())

const user=require("./routes/user")

const auth=require("./routes/auth")

app.use("/user",user);
app.use("/user",auth);

app.get("/",(req,res)=>{
    res.send("Hello")
})


app.listen(port,()=>{
    console.log(`Server started at ${port}`);
})