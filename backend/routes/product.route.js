import express from 'express';
const router=express.Router();
import {getProducts,addProduct,deleteProduct,updateProduct} from '../controller/product.controller.js';

router.post('/', addProduct);
router.delete('/:id',deleteProduct);
router.put('/:id',updateProduct);
router.get('/',getProducts);


export default router;
