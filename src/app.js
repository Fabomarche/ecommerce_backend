import express from 'express'
import cors from 'cors'
import passport from 'passport'
import initializePassport from './config/passport-config.js'
import sessionRouter from './routes/session.js'
import productsRouter from './routes/products.js'
import cartRouter from './routes/carts.js'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'

const app = express()
const PORT = process.env.PORT||8080
const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`))

export const io = new Server(server)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())

//middelware admin
const admin = true
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url)
    req.auth = admin
    next()
})

//ROUTES
app.use('/session',sessionRouter)
app.use('/products',productsRouter)
app.use('/cart',cartRouter)