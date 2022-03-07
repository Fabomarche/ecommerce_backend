import express from 'express'
import upload from './services/upload.js'
import cors from 'cors'
import __dirname from './utils.js'
import passport from 'passport'
import initializePassport from './config/passport-config.js'
import sessionRouter from './routes/session.js'
import productsRouter from './routes/products.js'
import cartRouter from './routes/carts.js'
import cookieParser from 'cookie-parser'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { productsService } from './services/services.js'

const app = express()
const PORT = process.env.PORT||8080
const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`))

export const io = new Server(server)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname+'/views')

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

app.use('/images', express.static(__dirname+'/public'))
app.use(express.static(__dirname+'/public'))

//ROUTES
app.use('/session',sessionRouter)
app.use('/products',productsRouter)
app.use('/cart',cartRouter)

app.use(upload.single('image'))



// app.get('/views/products', (req,res)=>{
//     products.getAll()
//     .then(result => {
//         let preparedObj ={
//             products : result
//         }
//         // console.log(preparedObj.products.payload)
//         res.render('products', preparedObj)
//     })
// })

//-------------------- socket ----------------//
io.on('connection', async socket => {
    console.log(`the socket ${socket.id} is connected`)
    let allProducts = await productsService.getAll()
    socket.emit('deliverProducts', allProducts)

        
    //socket.emit('messagelog', await chats.getAll())

    // socket.on('message', async data => {
    //     await chats.saveChat(data)
    //     io.emit('messagelog', await chats.getAll())
    // })
})


//------------------ end socket ----------------//


//Render Views
app.get('/', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/logout', (req, res) => {
    res.render('logout')
})

app.get('/home', (req, res) => {
    res.render('home')
})

app.use('/*', (req,res)=> res.send({
    error:-2,
    description: `Path ${req.originalUrl} and method ${req.method} aren't implemented`
}))
