import passport from "passport";
import local from 'passport-local'
import { userService } from "../services/services.js"
import { createHash, isValidPassword, cookieExtractor } from "../utils/utils.js";
import config from "./config.js";
import jwt from "passport-jwt";

const LocalStrategy =  local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

const initializePassport = ()=>{
    passport.use('register', new LocalStrategy({passReqToCallback:true,usernameField:"email",session:false},async(req,username,password,done)=>{
        let {firstName,lastName,email,phone,addres,age,cart} = req.body
        try{
            if(!req.file) return done(null, false,{messages:"Couldn't upload avatar"})
            console.log(req.file)
            let user = await userService.getBy({email:email})
            if(user) return done(null,false,{messages:"User Already exists"})
            const newUser = {
                firstName,
                lastName,
                email,
                phone,
                username,
                addres,
                age,
                cart,
                role:"user",
                password:createHash(password),
                avatar:req.file.filename
            }
            let result = await userService.save(newUser)
            return done(null,result)
        }catch(err){
            console.log(err)
            return done(err)
        }
    }))

    passport.use('login',new LocalStrategy({usernameField:"email"},async(username,password,done)=>{
        try{
            console.log(username)
            console.log(password)
            if(username === config.session.ADMIN && config.session.PASSWORD){
                return done (null,{id:0,role:"admin"})
            }
            const user = await userService.getBy({email:username})
            console.log(user)
            if(!user) return done(null,false,{messages:"No user found"})
            if(!isValidPassword(user,password)) return done(null,false,{messages:"Incorrect password"})
            return done(null, user)
        }catch(error){
            return done(error)
        }
    }))

    passport.use('jwt',new JWTStrategy({jwtFromRequest:ExtractJwt.fromExtractors([cookieExtractor]), secretOrKey:config.jwt.SECRET}, async(jwt_payload,done)=>{
        try{
            if(jwt_payload.role === "admin") return done(null, jwt_payload)
            console.log(jwt_payload)
            let user = await userService.getBy({_id:jwt_payload._id})
            if(!user) return done(null,false,{messages:"User not found"})
            return done(null,user)
        }catch(err){
            return done(err)
        }
    }))
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser(async(id,done)=>{
        let result = await userService.getBy({_id:id})
        done(null,result)
    })
}


export default initializePassport