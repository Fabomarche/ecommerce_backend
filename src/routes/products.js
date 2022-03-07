import express from 'express'
const router = express.Router()
import { productsService } from '../services/services.js'
import upload from '../services/upload.js'
import { io } from '../app.js'
import { authMiddleware } from '../utils.js'

//GETS
router.get('/', async (req, res) => {
    productsService.getAll()
    .then(result => {
        res.send(result)
    })
})

router.get('/:pid', (req, res) => {
    let id = req.params.pid
    productsService.getBy({id:id})
    .then(result=>{
        res.send(result)
    })
})


//POSTS
router.post('/', authMiddleware, upload.single('image'), (req, res) => {//Error: ENOENT: no such file or directory, open 'F:\CODERHOUSE\PB 17045\PB-tercera-entrega\src\utils\public\images\1646582394527image.jpeg'
    let file = req.file
    let product = req.body
    product.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename
    productsService.save(product)
    .then(result => {
        res.send(result)
        productsService.getAll().then(result => {
            io.emit('deliverProducts', result)
        })
    })
})

//PUTS
router.put('/:pid', authMiddleware, (req,res) => {
    let body = req.body;
    let id = req.params.pid
    productsService.update(id,body).then(result=>{
        res.send(result);
    })
})

//DELETES
router.delete('/:pid', authMiddleware, (req,res) => {
    let id = req.params.pid
    productsService.delete(id).then(result => {
        res.send(result)
    })
})

//NO IMPLEMENTADO EN ESTA VERSION
// router.delete('/', authMiddleware, (req,res) => {
//     productsContainer.deleteAll().then(result => {
//         res.send(result)
//     })
// })


export default router