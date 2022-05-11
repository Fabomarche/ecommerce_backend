import { cartsService, productsService, userService  } from "../services/services.js";
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
    res.send({status:"success",payload:cart})
}

const addProduct = async(req,res)=>{
    let quantityChanged = false;
    let {cid,pid} = req.params;
    let {quantity} = req.body;
    
    let product = await productsService.getBy({_id:pid});
    if(!product) return res.status(404).send({status:"error",error:"Product not found"});
    
    let cart = await cartsService.getBy({_id:cid});
    if(!cart) return res.status(404).send({status:"error",error:"Cart not found"});
    
    if(product.stock===0) return res.status(400).send({status:"error",error:"No stock"});
    
    if(product.stock<quantity){
        quantity=product.stock
        quantityChanged=true;
    }
    
    product.stock = product.stock - quantity;
    if(product.stock===0)
        product.status="unavailable"
    await productsService.update(pid,product);
    
    cart.products.push({product:pid,quantity});
    await cartsService.update(cid,cart);
    res.send({status:"success",quantityChanged,newQuantity:quantity,message:"Product added"})
}

const deleteProductFromCart = async(req,res)=>{
    let {pid,cid} = req.params;
    console.log(pid);
    
    let cart = await cartsService.getByWithPopulate({_id:cid});
    if(!cart)  return res.status(404).send({status:"error",error:"Can't find cart"});
    
    if(cart.products.some(element=>element.product._id.toString()===pid)){
        
        let product = await productsService.getBy({_id:pid});
        if(!product) return res.status(404).send({status:"error",error:"Product not found"});
        
        let productInCart = cart.products.find(element=>element.product._id.toString()===pid);
        
        product.stock = product.stock + productInCart.quantity;
        await productsService.update(pid,product);
        
        cart.products = cart.products.filter(element=>element.product._id.toString()!==pid);
        await cartsService.update(cid,cart);
        res.send({status:"success",message:"Product deleted"})
    }else{
        res.status(400).send({error:"Product not found in the cart"})
    }
}

const updateCart = async(req,res)=>{
    let {cid} = req.params;
    let {products} = req.body;
    let stockLimitation = false;
    console.log(products);
    
    let cart = await cartsService.getBy({_id:cid});
    if(!cart)  return res.status(404).send({status:"error",error:"Can't find cart"});
    
    for(const element of cart.products){
        let product = await productsService.getBy({_id:element.product});
        
        let associatedProductInCart = cart.products.find(element=>element.product.toString()===product._id.toString());
        
        let associatedProductInInput = products.find(element=>element.product.toString()===product._id.toString());
        if(associatedProductInCart.quantity!==associatedProductInInput.quantity){
            
            if(associatedProductInCart.quantity>associatedProductInInput.quantity){
                let difference = associatedProductInCart.quantity - associatedProductInInput.quantity;
                associatedProductInCart.quantity = associatedProductInInput.quantity;
                product.stock+=difference;
                
                await productsService.update(product._id,product);
            }else{
                let difference = associatedProductInInput.quantity - associatedProductInCart.quantity;
                if(product.stock>=difference){
                    product.stock -=difference;
                    await productsService.update(product._id,product);
                    associatedProductInCart.quantity = associatedProductInInput.quantity;
                }
                else{
                    stockLimitation=true;
                    associatedProductInCart.quantity +=product.stock;
                    product.stock=0;
                    await productsService.update(product._id,product);
                }
            }
        }
        else{
            console.log("Quantitys product not change")
        }
    }
    await cartsService.update(cid,cart);
    res.send({status:"success",stockLimitation})
}

const confirmPurchase = async(req,res) =>{
    let {cid} = req.params;
    let cart = await cartsService.getBy({_id:cid});
    if(!cart)  return res.status(404).send({status:"error",error:"Can't find cart"});
    let user = await userService.getBy({cart:cid})
    if(!user) res.status(404).send({status:"error", error:"Not found"})
    
    let cartPopulate = await cartsService.getByWithPopulate({_id:cid})
    let productsInCart = await cartPopulate.products.map(prod => prod.product)
    
    const mail = {
                from:"Online E-commerce <Online E-commerce>",
                to: process.env.ADMIN,
                subject:`nuevo pedido de ${user.email}`,
                html:`

                    <h1>Productos comprados de ${user.first_name} ${user.last_name}: </h1>
                    ${productsInCart.map(prod => `
                                    <h2>${prod.title}</h2>
                                    <h3>$${prod.price} por unidad</h3>
                                    <p>${prod.description}</p>
                                   
                    `)}
                    <p>${JSON.stringify(cart.products)}</p>
                `
            }
        
            let emailResult = transport.sendMail(mail)
            console.log(emailResult) 

            //COMENTADO POR QUE AL SI EL TELEFONO NO ESTA VERIFICADO TWILIO TIRA ERROR
            /* let wspResult = await client.messages.create({
                from: "whatsapp:+14155238886",
                to:"whatsapp:+5492215579193",
                body:`nuevo pedido de ${user.first_name} ${user.last_name}:, 
                productos: <h1>Productos a comprar de ${user.first_name} ${user.last_name}: </h1>
                            ${productsInCart.map(prod => `
                                                <h2>${prod.title}</h2>
                                                <h3>${prod.price}</h3>
                                                <p>${prod.description}</p>
                                            
                                `)}
                            <p>${JSON.stringify(cart.products)}</p>
                 `,
            })
            console.log(wspResult)
        
             const sms = await client.messages.create({
                 body:`Hola ${user.first_name}, su pedido ha sido registrado y se encuentra en proceso. 
                        Productos:<h1>Productos a comprar de ${user.first_name} ${user.last_name}: </h1>
                                    ${productsInCart.map(prod => `
                                    <h2>${prod.title}</h2>
                                    <h3>${prod.price}</h3>
                                    <p>${prod.description}</p>
                                   
                                     `)}
                                    <p>${JSON.stringify(cart.products)}</p>`,
                 from:'+19034947802',
                 to:`+${user.phone}`
             })
             console.log(sms) */

    cart.products=[];
    await cartsService.update(cid,cart);
    res.send({status:"success",message:"Finished purchase!"})
}

export default {
    getCartById,
    addProduct,
    deleteProductFromCart,
    updateCart,
    confirmPurchase
}