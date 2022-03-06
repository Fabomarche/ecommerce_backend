import express from 'express'
const router = express.Router()
import { cartsService } from '../services/services.js'


//POSTS
router.post('/', (req, res) => {
    cartsService.save({products:[]})
    .then(result => res.send(result))
    console.log()
})

router.post('/:cid/products', (req, res) => {
    let cartId = req.params.cid
    let productId = req.body.id
    cartsService.addProductToCart(cartId, productId)
    .then(result => res.send(result))
})

//DELETES
router.delete('/:cid', (req, res) => {
    let id = req.params.cid
    cartsService.delete(id)
    .then(result => res.send(result))
})

router.delete('/:cid/products/:pid', (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    cartsService.delete(cartId, productId)
    .then(result => res.send(result))
})


//GETS
router.get('/:cid/products', (req, res) => {
    let id = req.params.cid
    cartsService.getProductsByCartId(id)
    .then(result => res.send(result))
})

//NO SE IMPLEMENTA EN ESTA VERSION
// router.get('/', (req,res)=>{
//     cartsContainer.getAll().then(result=>{
//         res.send(result)
//     })
// })


export default router