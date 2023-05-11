const express=require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const JWT_SECRET='Parmarzz@11';
const fetchuser=require('../middleware/fetchuser');
//ROUTE1: Create a user using : POST  "/api/auth/createuser" no login required 
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password').isLength({min: 5})
], async(req, res)=>{
  //if there are errors, return errors and bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  try{
  //Check whether user with this email exists already
  let user=await User.findOne({email: req.body.email});
  if(user){
    return res.status(400).json({error: 'User already exists'});
  }
  const salt=await bcrypt.genSalt(10);
  const secPass= await bcrypt.hash(req.body.password, salt);
  //create user
  user= await User.create({
    name: req.body.name,
    email: req.body.email,
    password:secPass
  })
  const data={
    user:{
      id:user.id
    }
  } 
  const authToken=jwt.sign(data, JWT_SECRET);
  res.send({authToken});
  }catch(error){
    console.log(error.message);
    res.status(500).send("Some error occured");
  }
})


//ROUTE2: Authenticate a user using : POST  "/api/auth/login" . no login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists()
], async(req, res)=>{
   //if there are errors, return errors and bad request
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
   return res.status(400).json({errors: errors.array()});
 }
 const {email, password}=req.body;
 try{
  let user=await User.findOne({email});
  if(!user){
    return res.status(400).json({error : "Invalid credentials"});
  }
  const passwordCompare= await bcrypt.compare(password, user.password);
  if(!passwordCompare){
    return res.status(400).json({error : "Invalid credentials"});
  }
  const data={
    user:{
      id:user.id
    }
  } 
  const authToken=jwt.sign(data, JWT_SECRET);
  res.send({authToken});
 }catch(error){
  console.log(error.message);
  res.status(500).send("Internal server error...");
 }

})

//ROUTE2: Get logged in user details : POST  "/api/auth/getuser" . login required
router.post('/getuser',fetchuser, async(req, res)=>{
try {
  userId=req.user.id;
  const user= await User.findById(userId).select("-password");
  res.send(user);
} catch(error){
  console.log(error.message);
  res.status(500).send("Internal server error...");
 } 
}) 
module.exports=router;