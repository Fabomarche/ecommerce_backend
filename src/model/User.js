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
            //username: { type: String, required: true, unique: true, default: 'anon' },//es necesario?
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            address:{ type: String },
            age: { type: Number, required: false },
            phone: { type: Number },
            role:{type:String},
            profile_picture: { type: String, required: false },
            cart:{
                type:Schema.Types.ObjectId,
                ref:'Carts'
            },
            status:{
                type:Boolean,
                default:true
            }
        }
    }
}

