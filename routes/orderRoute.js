const express=require('express')
const { createOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deletOrder } = require('../controller/orderController')
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router=express.Router()
//create oder
router.route('/order/new').post(isAuthenticatedUser,createOrder)
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder)
router.route('/orders/me').get(isAuthenticatedUser,myOrders)
router.route('/admin/orders').get(isAuthenticatedUser,authorizedRoles("admin"),getAllOrders)
router.route('/admin/order/:id').put(isAuthenticatedUser,authorizedRoles("admin"),updateOrder)
                                .delete(isAuthenticatedUser,authorizedRoles("admin"),deletOrder)

module.exports=router