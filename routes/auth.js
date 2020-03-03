const express = require("express")

const router = express.Router();

const bcrypt = require("bcrypt");

const { check, validationResult } = require("express-validator");

const config = require("config");

// importing models
const Users = require("../model/newmod")
const jwt = require("jsonwebtoken");
const fs=require("fs")

router.use(express.urlencoded({ extended: false }))
 
router.use(express.json())

const privateKey=fs.readFileSync("./private.key","utf-8");

router.post("/login", [
    check("email").isEmail().withMessage("Invalid Email"),
    check("password").exists().withMessage("Enter a password")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
    
        const {email,password}=req.body;
        // Verify user email exists
        let user=await Users.findOne({email:email});
        if (!user) {
            return res.status(422).json({ "Error": "Invalid Credentials" });
        }
        const isMatch=await bcrypt.compare(password,user.password)
        // console.log(isMatch)
        if(!isMatch){
            return res.status(422).json({ "Error": "Invalid Credentials" });
        }
        const payload={
            user:{
                id:user._id
            }
        }
        var token=jwt.sign(payload,privateKey,{expiresIn:120})
        res.send(token)

    } catch (err) {
        throw err;
    }
})

module.exports = router;

