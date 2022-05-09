import { cartsService } from "../services/services.js";


const getCartById = async(req,res) =>{
    let id = req.params.cid;
    let cart = await cartsService.getByWithPopulate({_id:id})
    if(!cart) res.status(404).send({status:"error", error:"Not found"})
    console.log(cart);
    res.send({status:200,payload:cart})
}

export default {
    getCartById
}