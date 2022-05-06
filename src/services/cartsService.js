import Carts from "../model/Carts.js"
import GenericQueries from "./genericQueries.js"


export default class CartService extends GenericQueries{
    constructor(dao){
        super(dao,Carts.model)
    }

    getByWithPopulate = async(params) =>{
        let result = await this.dao.models[Carts.model].findOne(params).populate('products.product')
        return result;
    }

    //estos metodos estaban en generic querys
    addProductToCart = async (cartId, productId)=>{
        return this.dao.addProduct(cartId, productId, this.model)
    }

    getProductsByCartId = async (id)=>{
        return this.dao.getProductsByCartId(id, this.model)
    }
}

