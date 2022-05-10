import express from 'express'
import {serialize} from '../utils/utils.js'
import { passportCall, checkAuthorization } from '../utils/middlewares.js'
import { uploader } from '../utils/uploader.js'
import jwt from "jsonwebtoken"
import config from '../config/config.js'

//----***********++++ VIDEO 21' O ANTES HABA DE ESTO Y EN EL APOYO ESTA EL CÓDIGO
const router =  express.Router()

router.get('/current',passportCall('jwt'), (req,res)=>{
    let user = serialize(req.user,["first_name","last_name","role","profile_picture","cart"])
    console.log(user);
    res.send({status:"success",payload:user});
})

router.post('/register', uploader.single('profilePic'), passportCall('register'),(req,res)=>{
    let user = req.user
    console.log(user)
    res.send({status:"success",message:"Signed up"})
})

router.post('/login', passportCall('login'), (req,res)=>{
    let user;
    if(req.user.role!=="superadmin"){
        user = serialize(req.user,['first_name','last_name']);
    }else{
        user=req.user
    }
    console.log(user)
    let token = jwt.sign(user, config.jwt.SECRET)
    res.cookie('sessionCookie', 'boom', {
        maxAge:1000*60*60
    })
    res.cookie(config.jwt.COOKIE_NAME, token,{
        httpOnly:true,
        maxAge:1000*60*60
    })
    res.send({status:"success",payload:{user}})
})

router.get('/logout',(req,res)=>{
    res.clearCookie('JWT_COOKIE')
    res.send({message:'Logged Out'})
})

export default router