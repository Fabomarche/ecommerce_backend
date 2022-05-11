import express from 'express'
const router = express.Router()
import productsController from '../controllers/products.controller.js'
import upload from '../services/upload.js'

//GETS
router.get('/', productsController.getAllProducts)
router.get('/:pid', productsController.getProductsById)

//POSTS
router.post('/', upload.single('thumbnail'), productsController.addNewProduct)

//PUTS
router.put('/:pid', productsController.updateProduct)

//DELETES
router.delete('/:pid', productsController.deleteProduct)


export default router