import express from 'express'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import initializePassport from './config/passport-config.js'
import upload from './services/upload.js'
import __dirname from './utils.js'
import sessionRouter from './routes/session.routes.js'
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import { Server } from 'socket.io'
//import { productsService } from './services/services.js'
import { messageService } from './services/services.js'
import { createLogger } from './logger.js'

const app = express()
const PORT = process.env.PORT||8080
const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`))

const logger = createLogger()

const io = new Server(server,{
    cors: {
        origin: "https://backend-ecommerce-coderhouse.herokuapp.com",
        methods: ["GET", "POST"]
    }
})


app.use(cors({credentials: true, origin:"https://backend-ecommerce-coderhouse.herokuapp.com"}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())

//middelware admin
// const admin = true
// app.use((req,res,next)=>{
//     console.log(new Date().toTimeString().split(" ")[0], req.method, req.url)
//     req.auth = admin
//     next()
// })

app.use('/images', express.static(__dirname+'/public'))
app.use('/avatars', express.static(__dirname + '/public'))
app.use(express.static(__dirname+'/public'))

//ROUTES
app.use('/api/session',sessionRouter)
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)

app.use(upload.single('image'))




//-------------------- socket ----------------//

//**********++++++VIDEO FRONT MINUTO 8 LO ANTES LO MUESTRA++++*****************
//************* EN EL VIDEO 2 MINUTO 7 APROSX VUELVE A EXPLICAR

let connectedSockets = {};
io.on('connection', async socket=>{
    console.log("client connected");
    if(socket.handshake.query.name){
        //Check if there's an associated id with socketId
        if(Object.values(connectedSockets).some(user=>user.id===socket.handshake.query.id)){
            //replace socket id for current connected socket
            Object.keys(connectedSockets).forEach(idSocket =>{
                if(connectedSockets[idSocket].id===socket.handshake.query.id){
                    delete connectedSockets[idSocket];
                    connectedSockets[socket.id]={
                        name:socket.handshake.query.name,
                        id:socket.handshake.query.id,
                        thumbnail:socket.handshake.query.thumbnail
                    };
                }
            })
        }else{
            connectedSockets[socket.id]={
                name:socket.handshake.query.name,
                id:socket.handshake.query.id,
                thumbnail:socket.handshake.query.thumbnail
            };
        }
    }
    io.emit('users',connectedSockets)
    let logs = await messageService.getAllAndPopulate();
    io.emit('logs',logs);
    //Other listeners
    socket.on('disconnect',reason=>{
        delete connectedSockets[socket.id]
    })
    socket.on('message',async data=>{
        if(Object.keys(connectedSockets).includes(socket.id)){
            await messageService.save({
                author:connectedSockets[socket.id].id,
                content: data
            })
            let logs = await messageService.getAllAndPopulate();
            io.emit('logs',logs);
        }
    });
})
//------------------ end socket ----------------//

app.use('/*', (req,res)=> res.send({
    error:-2,
    description: `Path ${req.originalUrl} and method ${req.method} aren't implemented`
}))
