const { User } = require('../models'); // Import your User model
const Order = require('../models/order');
const Product = require('../models/product');

const addToCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user.userId)

        if (!user) {
           
            return res.redirect("/")
        }

        const productInCart = user.cart.some(item => item.productID.equals(req.body.productId));

        if (productInCart) {
            res.redirect(`/products/${req.body.productId}`)
        }

        const newCartItem = {
            productID: req.body.productId
        }

        user.cart.push(newCartItem)

        await user.save()

        
        res.redirect(`/products/${req.body.productId}`)

    } catch (error) {
       
        res.redirect(`/products/${req.body.productId}`)
    }
}

const getCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
          
            return res.redirect("/")
        }

        req.locals.cart = user.cart.populate({
            path: 'productID'
        });
        
        next()
    } catch (error) {
        console.error('Error fetching user cart:', error.message)
        res.redirect("/")
    }
}

const deleteCartItem = async (req, res, next) => {
    try {
        const { productId } = req.body
        const user = await User.findById(req.locals.userId)

        const index = user.cart.findIndex(item => item.productID == productId)

        if (index !== -1) {
            user.cart.splice(index, 1)
            await user.save()
            

        } else {
           
        }

        res.redirect("/cart")

    } catch (error) {

        console.error('Error deleting cart item:', error.message)
        res.redirect("/cart")
    }
}

const postOrder = async (req, res, next) => {
    const { products, total, phone, email, address } = req.body;
    const userId = req.session.user.userId;

    const order = new Order({
        products: products,
        total: total,
        userId: userId,
        phone: phone,
        email: email,
        address: address
    })

    // console.log(order)

    try {
        order.products.forEach(async item => {
            const product = await Product.findById(item.productId)
            product.quantity -= item.quantity
            if (product.quantity < 0) {
                product.quantity = 0
            }
            await product.save()
        })

        let orderedProductIds = new Set();
        order.products.forEach(product => {
            orderedProductIds.add(product.productId.toString());
        });

        orderedProductIds = Array.from(orderedProductIds);

        // Remove these products from the user's cart
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { cart: { productID: { $in: orderedProductIds } } } },
            { new: true, runValidators: true }
        );

        

        if (user) {
            req.session.user.cartSize = user.cart.length;
            res.locals.cartSize = user.cart.length;
        } else {
            // Handle the case where the user document could not be found
            req.session.user.cartSize = 0;
            res.locals.cartSize = 0;
        }
        await order.save()
        // console.log("Save Order Complete")
        res.sendStatus(200);

    } catch (e) {
        console.log(e)
    }
}

module.exports = { addToCart, getCart, deleteCartItem, postOrder };
