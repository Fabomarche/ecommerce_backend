import bcrypt from 'bcrypt'
import config from '../config/config.js'
import passport from 'passport'
import local from 'passport-local';
import jwt  from 'passport-jwt';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user,password) => bcrypt.compareSync(password,user.password)
export const serialize = (object,keys) =>{
    let serializedObject = Object.fromEntries(Object.entries(object).filter(pair=>keys.includes(pair[0])))
    serializedObject._id = object._id;//_id o id en serialized??
    return serializedObject;
}
export const cookieExtractor = req =>{
    let token = null;
    if (req && req.cookies)
    {
        token = req.cookies[config.jwt.COOKIE_NAME];
    }
    return token;
}




// export const cookieExtractor = req => {
//     let token = null
//     if(req && req.cookies){
//         token = req.cookies["JWT_COOKIE"]
//     }
//     return token
// }
