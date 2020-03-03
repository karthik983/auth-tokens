const express=require("express")

const router=express.Router();

const bcrypt=require("bcrypt");

const Users=require("../model/newmod")

const { check, validationResult } = require('express-validator');
const config=require("config");
const fs=require("fs");

const saltRounds=10

var jwt = require('jsonwebtoken');

router.use(express.json());

const privateKey=fs.readFileSync("./private.key","utf-8");
const publicKey=fs.readFileSync("./public.key","utf-8")

router.post("/signup",[
    check("name").notEmpty().withMessage("Name is Required"),
    check("email").isEmail().withMessage("Invalid Email"),
    check("password").isLength({min:6}).withMessage("Password must be min 6 length")
],async (req,res)=>{
    try{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const user=req.body;
  const salt=await bcrypt.genSaltSync(saltRounds);
  user.password = await bcrypt.hashSync(user.password, salt);

  const {name,email,password} = user
  const userData=new Users({name,email,password})
  const find=await Users.findOne({email})
  if(find){
     return res.json(`User already exists`);
  }
  var data=await userData.save()
 var token=jwt.sign({user_id:data._id},privateKey,{expiresIn:3600})
 res.send(token);
}
catch(err){
    res.send("Server error")
}   
})


module.exports=router;