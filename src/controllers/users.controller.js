import { userService } from "../services/services.js";

const getUserById = async(req,res)=>{
    let id = req.params.pid
    let user = await userService.getBy({id:id})
    if(!user) res.status(404).send({status:"error", error:"Not found"})
    res.send({status:"success", payload: user})
}

export default {
    getUserById
}