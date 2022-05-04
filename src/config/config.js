import dotenv from 'dotenv'
dotenv.config()

export default {
    mongo:{
        url:process.env.MONGO_URL
    },
    session:{
        ADMIN:process.env.ADMIN,
        PASSWORD:process.env.PASSWORD,
        SUPERADMIN:process.env.SUPERADMIN,
        SUPERADMIN_PASSWORD:process.env.SUPERADMIN_PASSWORD
    },
    jwt:{
        SECRET:process.env.JWT_SECRET,
        COOKIE_NAME:process.env.JWT_COOKIE_NAME
    }
}