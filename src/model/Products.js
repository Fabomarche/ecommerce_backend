export default class Products{
    constructor(data){
        this.data = data
    }
    static get model(){
        return 'Products'
    }
    static get schema(){
        return{
            title: {
                type:String,
                required:true
            },
            description: {
                type:String,
                default:"No description"
            },
            stock: {
                type:Number,
                required:true
            },
            price: {
                type:Number,
                required:true
            },
            code: {
                type:String,
                required:true,
                unique: true
            },
            thumbnail: {
                type:String,
                required:true
            },
            status:{
                type:String,
                default:"available"
            }
        }
    }
}