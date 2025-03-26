import Product from '../models/productmodel.js';
import mongoose from 'mongoose'
import { io } from '../server.js';

export const addProduct=async(req,res)=>{
    const product=req.body;
    if(!product.name||!product.price||!product.image){
      return res.status(400).json({success:false,message:'Please fill all the fields'});
    }
    const newProduct=new Product(product);
    try {
      await newProduct.save();
      io.emit('productAdded', newProduct);
      res.status(201).json({success:true,product:newProduct});
    } catch (error) {
      console.log(error.message);
      res.status(500).json({message:error.message});
    }
  };
  
  export const deleteProduct=async(req,res)=>{
    const{id}=req.params;
    try {
      await Product.findByIdAndDelete(id);
      io.emit('productDeleted', id);
      res.status(200).json({success:true,message:'Product deleted successfully'});
    } catch (error) {
      console.log(error.message);
    }
  };
  export const updateProduct=async(req,res)=>{
    const{id}=req.params;
    const product=req.body;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({success:false,message:'Product not found'});
    }
    try {
      await Product.findByIdAndUpdate(id,product);
      io.emit('productUpdated', { id, product });
      res.status(200).json({success:true,message:'Product updated successfully'});
    } catch (error) {
      console.log(error.message);
    }
  };
  export const getProducts=async(req,res)=>{
  try{
    const products=await Product.find();
    res.status(200).json({success:true,products});
  }catch(error){
    console.log(error.message);
    res.status(500).json({message:error.message});
  }
  };
  