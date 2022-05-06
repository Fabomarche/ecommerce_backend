import multer from 'multer'


export const uploader = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'src/public/avatars')
        },
        filename:(req,file,cb)=>{
            cb(null,Date.now()+file.originalname)
        }
    })
})