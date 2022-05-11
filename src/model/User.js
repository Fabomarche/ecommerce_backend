import mongoose from 'mongoose'
const { Schema } = mongoose


export default class User{
    constructor(data){
        this.data = data
    }
    static get model(){
        return 'Users'
    }
    static get schema(){
        return {
            first_name: { type: String, required: true },
            last_name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            address:{ type: String, required: false },
            age:{ type: Number, required: false },
            phone:{ type: String },
            role:{type:String},
            cart:{
                type:Schema.Types.ObjectId,
                ref:'Carts'
            },
            status:{
                type:Boolean,
                default:true
            },
            profile_picture:String
        }
    }
}

