import express from 'express'
import passport from 'passport'
import initializePassport from './config/passport-config.js'
import sessionRouter from './routes/session.js'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = process.env.PORT||8080
const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())

app.use('/session',sessionRouter)