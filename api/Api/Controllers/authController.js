const jwt = require('jsonwebtoken');

const User = require('../Model/accountModel');
const Token = require('../Model/tokenModel');
const accountModel = require('../Model/accountModel');


const signup =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user,statusCode,res)=>{
    const token = signup(user._id);
    const cookieOption = {
        expires:new Date(
            Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000
        ),
        httpOnly:true
    }
    res.cookie('jwt',token,cookieOption);
    user.password = undefined;
    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    })
}

exports.signup = async (req,res,next)=>{
    try{
        const newUser = await User.create(req.body);
        createSendToken(newUser,201,res);
    }catch(err){
        res.status(400).json({
            status:'fail',
            message:err
        })
    }
}

exports.login = async (req,res,next)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            res.status(400).json({
                status:'fail',
                message:'Please provide email and password'
            })
        }
        const user = await User.findOne({email}).select('+password');
        if(!user || !(await user.correctPassword(password,user.password))){
            res.status(401).json({
                status:'fail',
                message:'Incorrect email or password'
            })
        }
        createSendToken(user,200,res);
    }catch(err){
        res.status(400).json({
            status:'fail',
            message:err
        })
    }
}


exports.protect = async (req,res,next)=>{
    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token){
            res.status(401).json({
                status:'fail',
                message:'You are not logged in! Please log in to get access.'
            })
        }
        const decoded = await jwt.verify(token,process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);
        if(!currentUser){
            res.status(401).json({
                status:'fail',
                message:'The user belonging to this token does no longer exist.'
            })
        }
        req.user = currentUser;
        next();
    }catch(err){
        res.status(400).json({
            status:'fail',
            message:err
        })
    }
}

exports.restrictTo = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            res.status(403).json({
                status:'fail',
                message:'You do not have permission to perform this action'
            })
        }
        next();
    }
}

exports.getAllToken = async (req,res,next)=>{
    try{
        const token = await Token.find();
        res.status(200).json({
            status:'success',
            data:{
                token
            }
        })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message:err
        })
    }
}