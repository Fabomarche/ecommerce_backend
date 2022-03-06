import multer from 'multer'
import config from '../config/config.js'

export const uploader = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'src/public')
        },
        filenmae:(req,file,cb)=>{
            cb(null,Date.now()+file.originalname)
        }
    })
})