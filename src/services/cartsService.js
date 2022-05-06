import Carts from "../model/Carts.js"
import { userService } from "./services.js" 
import GenericQueries from "./genericQueries.js"


export default class CartService extends GenericQueries{
    constructor(dao){
        super(dao,Carts.model)
    }

    getByWithPopulate = async(cartId) =>{
        let cart = await this.dao.models[Carts.model].findOne(cartId).populate('products.product')
        return cart;
    }
}

