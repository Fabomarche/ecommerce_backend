import mongoose from "mongoose"
import User from "./User.js"
import Products from "./Products.js"
import Cart from "./Carts.js"
import Message from "./Message.js"

export default class Dao{
    constructor(config){
        this.mongoose = mongoose.connect(config.url,{useNewUrlParser:true}).catch(error =>{
            console.log(error)
            process.exit()
        })
        const timestamp = {timestamps:{createdAt:'created_at', updatedAt:'updated_at'}}
        const userSchema = mongoose.Schema(User.schema,timestamp)
        const productSchema = mongoose.Schema(Products.schema,timestamp)
        const cartSchema = mongoose.Schema(Cart.schema,timestamp)
        const messageSchema = mongoose.Schema(Message.schema,timestamp)
        
        this.models={
            [User.model]:mongoose.model(User.model, userSchema),
            [Products.model]:mongoose.model(Products.model, productSchema),
            [Cart.model]:mongoose.model(Cart.model, cartSchema),
            [Message.model]:mongoose.model(Message.model,messageSchema)
        }
    }
    
    findOne = async(options, entity)=>{
        if(!this.models[entity]) throw new error(`Entity ${entity} not in dao schemas`)
        let result = await this.models[entity].findOne(options)
        return result ? result.toObject():null
    }
    
    getAll = async(options, entity)=>{
        if(!this.models[entity]) throw new error(`Entity ${entity} not in dao schemas`)
        let results = await this.models[entity].find(options)
        return results.map(result => result.toObject())
    }

    insert = async(document, entity)=>{
        if(!this.models[entity]) throw new error(`Entity ${entity} not in dao schemas`)
        try{
            let instance = new this.models[entity](document)
            let result = await instance.save()
            return result ? result.toObject():null
        }catch(error){
            console.log(error)
            return null
        }
    }

    update = async(document, entity)=>{
        if(!this.models[entity]) throw new error(`Entity ${entity} not in dao schemas`)
        let id =  document._id
        delete document._id
        let result = await this.models[entity].findByIdAndUpdate(id,{$set:document},{new:true})
        return result.toObject()
    }

    delete = async(id,entity)=>{
        if(!this.models[entity]) throw new error(`Entity ${entity} not in dao schemas`)
        let result = await this.models[entity].findByIdAndDelete(id)
        return result ? result.toObject():null
    }

    exist = async(entity, options)=>{
        if(!this.models[entity]) throw new error(`Entity ${entity} not in dao schemas`)
        return this.models[entity].exists(options)
    }

    //CART
    addProduct = async(cartId, productId, entity)=>{
        if(!this.models[entity]) throw new error(`Entity ${entity} not in dao schemas`)
        let result = await this.models[entity].updateOne({_id:cartId},{$push:{products:productId}})
        return {status:"success", payload:result}
    }

    getProductsByCartId = async (cartId,entity)=>{
        if(!this.models[entity]) throw new error(`Entity ${entity} not in dao schemas`)
        let cart = await this.models[entity].findById(cartId) 
        let products = cart.products
        return {status:"success", payload:products}
    }

}
