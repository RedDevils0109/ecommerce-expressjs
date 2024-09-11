const express = require("express")
const route = express.Router()

const { updateOrder, getOrder, getOrders, updateOrderAdmin, getOrderAdmin } = require("../../controllers/order");


route.get('/', getOrders)

route.get("/:orderId", getOrder)

route.put("/update", updateOrder)

route.put("/admin-update", updateOrderAdmin)

module.exports = route