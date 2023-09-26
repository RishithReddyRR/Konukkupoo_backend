const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorhandler");
const { asyncErrorHandler } = require("../middleware/catchAsyncError");
const Product = require("../models/productModel");
//create order
exports.createOrder = asyncErrorHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
    paidAt: Date.now(),
  });
  res.status(201).json({
    success: true,
    order,
  });
});

//get logged in users order
exports.getSingleOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    return next(
      new ErrorHandler(`order with id ${req.params.id} is not found`, 404)
    );
  }
  res.status(200).json({
    success: true,
    order,
  });
});
//get logged in users orders
exports.myOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find({user:req.user.id})
  res.status(200).json({
    success: true,
    orders,
  });
});
//get all orders --admin
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find()
  let totalAmount=0
  orders.forEach(ele=>totalAmount+=ele.totalPrice)
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});
//update order status --admin
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if(order.orderStatus==="delivered"){
    return next(new ErrorHandler("this product is already delivered"),400)
  }
  order.orderItems.forEach(async(order)=>{
    await updateStock(order.product,order.quantity)
  })
  order.orderStatus=req.body.status;
  if(req.body.status==='delivered'){

    order.deliveredAt=Date.now()
  }
  await order.save({validateBeforeSave:false})
  res.status(200).json({
    success: true,
    
  });
});


async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}
//delete order --admin
exports.deletOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await Order.findByIdAndDelete(req.params.id)
  res.status(200).json({
    success: true
  });
});