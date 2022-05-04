import { productsService } from "../services/services.js";

//**************** VIDEO 2 MIN 2 APROX MUESTRA CONTROLLERS ***************

const getAllProducts = async(req,res)=>{
    let products = await productsService.getAll()
    res.send({status:"success", payload: products})
}

const getProductsById = async(req,res)=>{
    let id = req.params.pid
    let product = await productsService.getBy({id:id})
    res.send({status:"success", payload: product})
}

const addNewProduct = async(req,res) =>{
    let file = req.file
    let product = req.body
    product.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename
    productsService.save(product).then(result => {
        res.send({status:"success", payload: result, message:'Product added'})
    })

}

const updateProduct = async(req,res)=>{
    let body = req.body
    let id = req.params.pid
    productsService.update(id,body).then(result=>{
        res.send({status:"success", payload: result});
    })
}

const deleteProduct = async(req,res)=>{
    let id = req.params.pid
    productsService.delete(id).then(result => {
        res.send({status:"success", payload: result})//nombre payload?
    })
}



export default {
    getAllProducts,
    getProductsById,
    deleteProduct,
    updateProduct,
    addNewProduct
}