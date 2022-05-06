import mongoose from 'mongoose'
const { Schema } = mongoose

export default class Carts{
    constructor(data){
        this.data=data
    }
    static get model(){
        return 'Carts'
    }
    static get schema(){
        return{
            products:[
                {
                    product:{
                        type:Schema.Types.ObjectId,
                        ref:'Products',
                    },
                    quantity:{
                        type:Number,
                        default:1
                    }
                
            }
        ]
        }
    }
}