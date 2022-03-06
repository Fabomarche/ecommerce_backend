export default class GenericQueries{
    constructor(dao,model){
        this.dao = dao;
        this.model = model
    }
    
    getBy = async(options)=>{
        return this.dao.findOne(options,this.model)
    }
    
    getAll = async(options)=>{
        return this.dao.getAll(options, this.model)
    }

    save = async(document)=>{
        return this.dao.insert(document,this.model)
    }
    
    update = async(id, document)=>{
        document._id = id
        return this.dao.update(document,this.model)
    }

    delete = async(id)=> {
        return this.dao.delete(id,this.model)
    }

    addProductToCart = async (cartId, productId)=>{
        return this.dao.addProduct(cartId, productId, this.model)
    }

    getProductsByCartId = async (id)=>{
        return this.dao.getProductsByCartId(id, this.model)
    }
} 