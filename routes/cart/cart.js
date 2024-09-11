const express = require('express');
const router = express.Router();
const Product = require('../../models/product')
const User = require('../../models/user/user')
const Order = require('../../models/order');
const { postOrder } = require('../../controllers');


router.use(express.urlencoded({ extended: false }));
router.use(express.json());



router.get('/', async (req, res) => {
    const user = req.session.user
    try {
        if (!req.session.user || !req.session.user.userId) {
            return res.redirect('/login');
        }

        const user = await User.findById(req.session.user.userId);

        if (user) {
            const productIdList = user.cart.map(e => e.productID);

            const products = await Product.find({ _id: { $in: productIdList } });

            const path = `/cart`;

            res.render('pages/cart', { products, title: 'Cart', path: path, user: user });
        }
    } catch (error) {
        console.error('Error fetching cart products:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/buyNow/:id', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.userId) {
            return res.redirect('/login');
        }

        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        const user = await User.findById(req.session.user.userId);


        const existingProductIndex = user.cart.findIndex(item => item.productID.equals(product._id));

        if (existingProductIndex !== -1) {
            console.log('Duplicate product');
            return res.redirect('/products/' + product.id + '?duplicate=true');
        }


        const updatedUser = await User.findByIdAndUpdate(
            req.session.user.userId,
            { $push: { cart: { productID: product._id } } },
            { new: true }
        );

        req.session.user.cartSize = updatedUser.cart.length;

        res.locals.cartSize = updatedUser.cart.length;


        res.redirect('/products/' + product.id);
    } catch (error) {
        console.error('Error while adding to cart:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/addToCart/:id', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.userId) {
            return res.redirect('/login');
        }

        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        const user = await User.findById(req.session.user.userId);


        const existingProductIndex = user.cart.findIndex(item => item.productID.equals(product._id));

        if (existingProductIndex !== -1) {
            console.log('Duplicate product');
            return res.redirect(`/cart/#${id}`);
        }


        const updatedUser = await User.findByIdAndUpdate(
            req.session.user.userId,
            { $push: { cart: { productID: product._id } } },
            { new: true }
        );

        req.session.user.cartSize = updatedUser.cart.length;

        res.locals.cartSize = updatedUser.cart.length;


        res.redirect(`/cart/#${id}`);
    } catch (error) {
        console.error('Error while adding to cart:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/remove/:id', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.userId) {
            return res.redirect('/login');
        }

        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        const user = await User.findByIdAndUpdate(
            req.session.user.userId,
            { $pull: { cart: { productID: product._id } } },
            { new: true }
        );

        if (!user) {
            return res.status(404).send('User not found or update failed');
        }
        req.session.user.cartSize = user.cart.length;


        res.locals.cartSize = user.cart.length

        res.redirect('/cart')

    } catch (error) {

        console.error('Error while removing from cart:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post("/order", postOrder)



module.exports = router;