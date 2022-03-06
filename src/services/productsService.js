import Products from "../model/Products.js"
import GenericQueries from "./genericQueries.js"

export default class ProductsService extends GenericQueries{
    constructor(dao){
        super(dao,Products.model)
    }
}