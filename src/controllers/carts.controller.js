import { cartsService, productsService } from "../services/services.js";
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

const getCartById = async(req,res) =>{
    let id = req.params.cid;
    let cart = await cartsService.getByWithPopulate({_id:id})
    console.log(cart);
    res.send({status:200,payload:cart})
}

const addProduct = async(req,res)=>{
    let quantityChanged = false
    let {cid,pid} = req.params
    let {quantity} = req.body
    
    let product = await productsService.getBy({_id:id})
    if(!product) return res.status(404).send({status:"error", error:"Product not found"})

    let cart = await cartsService.getBy({_id:cid})
    if(!cart) return res.status(404).send({status:"error", error:"Cart not found"})

    if(product.stock === 0) return res.status(400).send({status:"error", error:"No stock"})
    if(product.stock < quantity){
        quantity = product.stock
        quantityChanged = true
    }

    product.stock = product.stock - quantity
    if(product.stock === 0) product.status = "unavailable"

    cart.products.push({product:pid, quantity})
    await cartsService.update({cid, cart})
    res.send({status:"success", quantityChanged, newQunatity:quantity, message:"Product added"})


}

const deleteProductFromCart = async(req,res)=>{
    let {pid,cid} = req.params
    let cart = await cartsService.getByWithPopulate({_id:cid})
    if(!cart) return res.status(404).send({status:"error", error:"Cart not found"})
    if(cart.products.some(el => el.product._id.toString() === pid)){
        let product = await productsService.getBy({_id:pid})
        if(!product) return res.status(404).send({status:"error", error:"Product not found"})
       
        let productInCart = cart.products.find(el => el.product._id.toString() === pid)
        product.stock = product.stock + productInCart.quantity
        await productsService.update(pid, product)
    
        cart.products = cart.products.filter(el => el.product._id.toString() !== pid)
        await cartsService.update(cid, product)
        res.send({status:"success", message:"Product deleted"})
    }else{
        res.status(400).send({status:"error", error:"Product not found in cart"})
    }
}

const updateCart =  async(req,res)=>{
    let {cid} = req.params
    let {products} = req.body
    let stockLimitation = false

    let cart = await cartsService.getBy({_id:cid})
    if(!cart) return res.status(404).send({status:"error", error:"Cart not found"})

    for(const el of cart.products){
        let product = await productsService.getBy({_id:el.product})

        let associatedProdcutInCart = cart.products.find(el => el.product.toString() === product._id.toString())
        let associatedProductInInput = products.find(el => el.product.toString() === product._id.toString())
        if(associatedProdcutInCart.quantity !== associatedProductInInput.quantity){
            if(associatedProdcutInCart.quantity > associatedProductInInput.quantity){
                let diference = associatedProdcutInCart.quantity - associatedProductInInput.quantity
                associatedProdcutInCart.quantity = associatedProductInInput.quantuty
                product.stock+=diference

                await productsService.update(product._id, product)
            }else{
                let diference = associatedProductInInput.quantity - associatedProdcutInCart.quantity
                if(product.stock >= diference){
                    product.stock -= diference
                    await productsService.update(product._id, product)
                    associatedProdcutInCart.quantity = associatedProductInInput.quantity
                }else{
                    stockLimitation = true
                    associatedProdcutInCart.quantity += product.stock
                    product.stock = 0
                    await productsService.update(product._id, product)
                }
            }
        }else{
            console.log("The quantity not change")
        }
    }
    await cartsService.update(cid, cart)
    res.send({status:"success", stockLimitation})
}

const confirmPurchase = async(res,req)=>{
    let {cid} = req.params
    let cart = await cartsService.getBy({_id:cid})
    if(!cart) return res.status(404).send({status:"error", error:"Cart not found"})
   
    const mail = {
        from:"Online E-commerce <Online E-commerce>",
        to: process.env.ADMIN,
        subject:`nuevo pedido`,
        html:`
            <h1>Productos a comprar: </h1>
            <p>${JSON.stringify(cart.products)}</p>
        `
    }

    let emailResult = transport.sendMail(mail)
    console.log(emailResult)

    let wspResult = await client.messages.create({
        from: "whatsapp:+14155238886",
        to:"whatsapp:+5492215579193",
        body:`nuevo pedido, productos: ${JSON.stringify(cart.products)}`,
    })
    console.log(wspResult)

    const sms = await client.messages.create({
        //SE PEUDE SOLUCIONAR LOS DATOS DEL USER???
        body:`Hola ${user.firstName}, su pedido ha sido registrado y se encuentra en proceso. Productos:${JSON.stringify(user.cart)}`,
        from:'+19034947802',
        to:`+${user.phone}`
    })
    console.log(sms)
        
    cart.products = []
    await cartsService.update(cid, cart)
    res.send({status:"success", message:"Finished purchase!"})

}

export default {
    getCartById,
    addProduct,
    deleteProductFromCart,
    updateCart,
    confirmPurchase
}