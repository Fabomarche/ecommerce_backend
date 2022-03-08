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
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            username: { type: String, required: true, unique: true, default: 'anon' },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            address:{ type: String },
            age: { type: Number, required: false },
            phone: { type: Number },
            role:{type:String},
            avatar: { type: String, required: false },
            cart:{
                type:Array
            }
        }
    }
}

