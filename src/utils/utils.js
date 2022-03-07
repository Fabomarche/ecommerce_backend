import bcrypt from 'bcrypt'

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user,password) => bcrypt.compareSync(password,user.password)
export const cookieExtractor = req => {
    let token = null
    if(req && req.cookies){
        token = req.cookies["JWT_COOKIE"]
    }
    return token
}
