import express from 'express'
const router = express.Router()
import productsController from '../controllers/products.controller.js'
import upload from '../services/upload.js'
import { authMiddleware } from '../utils.js'

//GETS
router.get('/', productsController.getAllProducts)
router.get('/:pid', productsController.getProductsById)

//POSTS
router.post('/', authMiddleware, upload.single('thumbnail'), productsController.addNewProduct)

//PUTS
router.put('/:pid', authMiddleware, productsController.updateProduct)

//DELETES
router.delete('/:pid', authMiddleware, productsController.deleteProduct)


export default router