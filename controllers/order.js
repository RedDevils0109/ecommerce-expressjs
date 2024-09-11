const { Order, User } = require("../models")
const mongoose = require("../models/connection")

// Get
exports.getOrders = async (req, res, next) => {
    try {
        // Find user 
        const user = await User.findById(req.session.user.userId)
        if (!user) {
            return res.redirect("/")
        }

        const orders = await Order.find({ userId: req.session.user.userId })
        .populate({
            path: 'products.productId',
            select: 'name price'
        });

        res.render("order/index", { path: req.path, orders: orders, title: 'Orders' })  // Pass the title

    } catch (e) {
        console.log(e)
        res.redirect("/")
    }
}

exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate({
                path: 'products.productId',
                select: 'name price mainImg'
            });
        
          

        if (!order) {
            return res.redirect("/orders")
        }

        return res.render("order/order", { order: order, title: 'Order Details', path: req.path })  // Pass the title
    } catch (e) {
        return res.redirect("/order")
    }
}

exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate({
                path: 'products.productId',
                select: 'name price mainImg'
            });
        
          

        if (!order) {
            return res.redirect("/orders")
        }

        return res.render("order/order", { order: order, title: 'Order Details', path: req.path })  // Pass the title
    } catch (e) {
        return res.redirect("/order")
    }
}

exports.getOrderAdmin = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate({
                path: 'products.productId',
                select: 'name price mainImg'
            })
            .populate({
                path: 'userId',
                select: 'name'
            });
        

        if (!order) {
            return res.redirect("/admin/order")
        }

        return res.render("admin/pages/orderDetail", { order: order, title: 'Order Details', path: req.path })  // Pass the title
    } catch (e) {
        return res.redirect("/admin/order")
    }
}

// Update
exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.body.orderId)
        if (!order) {
            res.redirect("/order")
        }

        order.status = req.body.status
        await order.save()

        res.redirect("/order")
    } catch (e) {
        return res.redirect("/order")
    }
}

exports.updateOrderAdmin = async (req, res, next) => {
    try {
        const order = await Order.findById(req.body.orderId)
        if (!order) {
            res.redirect("/admin/order")
        }

        order.status = req.body.status
        await order.save()

        res.redirect("/admin/order")

    } catch (e) {
        res.redirect("/admin/order")
    }
}
