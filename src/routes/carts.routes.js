import express from 'express'
const router = express.Router()
import { cartsService, userService } from '../services/services.js'
import dotenv from 'dotenv'
import { createTransport } from 'nodemailer'
import twilio from "twilio"

dotenv.config()

const client = twilio(process.env.TWILIO_CLIENT_SID,process.env.TWILIO_AUTH_TOKEN)

const transport = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.ADMIN,
        pass: process.env.APP_PWD
    }
})

//POSTS
router.post('/', (req, res) => {
    cartsService.save({products:[]})
    .then(result => res.send(result))
})

router.post('/:cid/products', (req, res) => {
    let cartId = req.params.cid
    let productId = req.body.id
    cartsService.addProductToCart(cartId, productId)
    .then(result => res.send(result))
})


//DELETES
router.delete('/:cid', (req, res) => {
    let id = req.params.cid
    cartsService.delete(id)
    .then(result => res.send(result))
})

router.delete('/:cid/products/:pid', (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    cartsService.delete(cartId, productId)
    .then(result => res.send(result))
})


//GETS
router.get('/:cid/products', (req, res) => {
    let id = req.params.cid
    cartsService.getProductsByCartId(id)
    .then(result => res.send(result))
})


router.get('/',async(req,res)=>{
    let result = await cartsService.getAll();
    res.send(result)
})

router.get('/:cid',async(req, res)=>{
    try {
        let cid = req.params.cid;
        let result = await cartsService.getBy({_id:cid})
        res.send(result) 
        
    } catch (error) {
        console.log(error)
    }
})


router.get('/:uid/confirm',async(req,res)=>{
        try{
            let userId = req.params.uid
            let user = await userService.getBy({_id:userId})
            const mail = {
                from:"Online E-commerce <Online E-commerce>",
                to: process.env.ADMIN,
                subject:`nuevo pedido de ${user.firstName} ${user.email}`,
                html:`
                    <h1>Productos a comprar de ${user.firstName} ${user.email}</h1>
                    <p>${JSON.stringify(user.cart)}</p>
                `
            }
            let emailResult = transport.sendMail(mail)
            console.log(emailResult)

            let wspResult = await client.messages.create({
                from: "whatsapp:+14155238886",
                to:"whatsapp:+5492215579193",
                body:`nuevo pedido de ${user.firstName} ${user.email}, productos: ${JSON.stringify(user.cart)}`,
            })
            console.log(wspResult)

            const sms = await client.messages.create({
                body:`Hola ${user.firstName}, su pedido ha sido registrado y se encuentra en proceso. Productos:${JSON.stringify(user.cart)}`,
                from:'+19034947802',
                to:`+${user.phone}`
            })
            console.log(sms)
            res.send(`Felicitaciones ${user.firstName} su compra fue realizada`)
        }catch(err){
            console.log(err)
        }

})

export default router