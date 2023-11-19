var express = require('express');
var router = express.Router();
const {mongodb,dbName,dbUrl,mongoClient} = require('../config/dbConfig')
const {mongoose,usersModel,productModel,orderModel} = require('../config/dbSchema')
const {hashPassword,hashCompare,createToken,decodeToken,validateToken,adminGaurd} = require('../config/auth')
mongoose.connect(dbUrl)
// const MongoClient = require('mongodb').MongoClient;

router.get('/all-product',validateToken,async(req, res)=>{
  try {
    let product = await productModel.find()
    res.send({
      statusCode:200,
      product
    })
    
  } catch (error) {
    console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error
      })
  }
});

router.post('/add-product',validateToken,adminGaurd,async(req,res)=>{
  try {
    let product = await productModel.create(req.body)
    res.send({
      statusCode:200,
      message:"product Added Successfully",
      product
    })
    
  } catch (error) {
    console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error
      })
  }
})

router.post('/delete-product',validateToken,adminGaurd,async(req,res)=>{
  try {
    
    let product = await productModel.deleteOne({_id:new mongoose.Types.ObjectId(req.body.productId)})
   
  res.send({
      statusCode:200,
      message:"product Deleted Successfully"
    })
    
  } catch (error) {
    console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error
      })
  }
})

router.post('/order',validateToken, async(req,res)=>{
  try {
    let product = await orderModel.create(req.body)
    res.send({
      statusCode:200,
      message:"Order Placed Successfully",
      product
    })
    
  } catch (error) {
    console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error
      })
  }
})

//display in admin
router.get('/orders',validateToken,adminGaurd,async(req,res)=>{
  try {
    let orders = await orderModel.find()
    res.send({
      statusCode:200,
      orders
    })
    
  } catch (error) {
    console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error
      })
  }
})

//Indivudual Order
router.get('/orders/:id',validateToken,adminGaurd,async(req,res)=>{
  try {
    let order = await orderModel.findOne({_id:new mongoose.Types.ObjectId(req.params.id)})
    res.send({
      statusCode:200,
      order
    })
    
  } catch (error) {
    console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error
      })
  }
})

router.put('/order-status/:id',validateToken,adminGaurd,async(req,res)=>{
  try {
    let order = await orderModel.findOne({_id:new mongoose.Types.ObjectId(req.params.id)})
    if(order)
    {
      let newStatus = ""
      switch(order.status)
      {
        case "Ordered": newStatus="Placed"
                        break;
        case "Placed": newStatus="In-Transit"
                        break;
        case "In-Transit": newStatus="Delivered"
                        break;
        default: res.send({
          statusCode:401,
          message:"Invalid Status"
        })
      }
     if(newStatus){
      order.status=newStatus
      await order.save()
      res.send({
        statusCode:200,
        message:"Status Changed Successfully"
      })
     }
    }
    
  } catch (error) {
    console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error
      })
  }
})

module.exports = router;
