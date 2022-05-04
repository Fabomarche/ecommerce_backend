import { userService } from "../services/services.js";

const getUserById = async(req,res)=>{
    let id = req.params.pid
    let user = await userService.getBy({id:id})
    res.send({status:"success", payload: user})
}

export default {
    getUserById
}