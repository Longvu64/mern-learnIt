const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const verifyToken = require("../middleware/auth");

//sẽ dùng axios để gọi tới route này
//Get api/auth
//Checked if user logged in
//access public

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if(!user){
            return res.status(400).json({success: false, message:'User not found'})
        }else {
            return res.json({success: true, user})
        }
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})
//Register
//route api/auth/register
//access public
router.post('/register', async (req, res) => {
    const {username, password} = req.body
    //Simple validation
    if(!username || !password){
        return res 
        .status(400)
        .json({success: false, message:'Missing username or password'})
    }
    try{
        //Check if the user exists
        const user = await User.findOne({username})
        if(user){
            return res.status(400).json({success: false, message:'User already exists'})
        }
        //All good
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({username, password: hashedPassword})
        await newUser.save()

        //return token
        const accessToken = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET)

        res.json({
            success: true,
            message: 'User created successfully',
            accessToken
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({success: false, message: 'Invalid server eror'})
    }
}
)

//Login
//route api/auth/login
//access public
router.post('/login', async (req, res) => {
    const {username, password} = req.body

     //Simple validation
     if(!username || !password){
        return res 
        .status(400)
        .json({success: false, message:'Missing username or password'})
    }

    try {
        //Check if user already
        const user = await User.findOne({username})
        if(!user){
            res.status(400).json({success: false, message:'Invalid username or password'})
        }
        //User found
        const passwordValid = await argon2.verify(user.password, password)
        if(!passwordValid){
            res.status(400).json({success: false, message:'Invalid username or password'})
        }
        //All good
        //return token
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET)

        res.json({
            success: true,
            message: 'User logged in successfully',
            accessToken
        })
    } catch (error) {
        console.log(err);
        res.status(500).json({success: false, message: 'Invalid server eror'})
    }
})
module.exports = router