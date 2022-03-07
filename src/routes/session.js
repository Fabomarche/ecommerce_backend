import express from 'express'
import { passportCall, checkAuthorization } from '../utils/middlewares.js'
import { uploader } from '../utils/uploader.js'
import jwt from "jsonwebtoken"
import config from '../config/config.js'

const router =  express.Router()

router.get('/current',passportCall('jwt'), checkAuthorization(["ADMIN", "USER"]),(req,res)=>{//el check es solo de prueba ver donde va...
    let user = req.user
    res.send(user)
})

router.post('/register', uploader.single('avatar'), passportCall('register'),(req,res)=>{
    res.send({status:"success",message:"Signed up"})
})

router.post('/login', passportCall('login'), (req,res)=>{
    let user = req.user
    let token = jwt.sign(user, config.jwt.SECRET)
    res.cookie("JWT_COOKIE",token,{
        httpOnly:true,
        maxAge:1000*60*60
    })
    res.send({status:"success",mesage:"Logged in"})
})

router.get('/logout',(req,res)=>{
    res.clearCookie('JWT_COOKIE')
    res.send({message:'Logged Out'})
})

export default router