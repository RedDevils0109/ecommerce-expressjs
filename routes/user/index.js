const path = require('path');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../../models/product')
const Review = require('../../models/review')
const User = require('../../models/user/user')
const Contact = require('../../models/contact')
const field = require('../../models/productField');
const { feedback } = require('../../models/utils')
const { route } = require('../admin/admin');
const multer = require("multer");
const { title } = require('process');
const { Order } = require('../../models');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/* Get pages */
router.get('/', async function (req, res, next) {
  const mobile = await Product.find({ category: 'mobile' })
  const laptop = await Product.find({ category: 'laptop' })
  const headphone = await Product.find({ category: 'headphone' })
  const user = req.session.user
  res.render('pages/home', { title: 'Home', mobile, laptop, headphone, user });
});

router.get('/about', function (req, res, next) {
  const user = req.session.user
  res.render('pages/about', { title: 'About', path: req.path, user });
});

// router.get('/cart', function (req, res, next) {
//   res.render('pages/cart', { title: 'Cart', path: req.path });
// });

// router.get('/product', function (req, res, next) {
//   res.render('pages/product', { title: 'Product', path: req.path });
// });

router.get('/catalog/:category/:brand', async function (req, res) {
  const { category, brand } = req.params
 
  const brands = field[category].brands
  const user = req.session.user
  const products = await Product.find({ category: category, brand: brand })
  res.render('pages/catalog', { title: category.charAt(0).toUpperCase() + category.slice(1), path: req.path, products, brands, category, user: user });
})

router.get('/catalog/:category', async function (req, res, next) {
  const { category } = req.params
  
  const products = await Product.find({ category: category })
  // console.log(products)
  

  const brands = field[category].brands

  // console.log(brands)
  // console.log(products)
  const user = req.session.user
  res.render('pages/catalog', { title: category.charAt(0).toUpperCase() + category.slice(1), path: req.path, products, brands, category, user: user });
});

router.get('/products', (req, res) => {
  res.redirect('/')
})
router.get('/products/search', async (req, res) => {
  try {
    const { q } = req.query;

    // Redirect to home page if no search query is provided
    if (!q) {
      return res.redirect('/');
    }

    // Convert search query to lowercase and remove spaces
    const editSearch = q.toLowerCase().replace(/\s/g, '');

    // Find all products
    const allProducts = await Product.find({});

    // Filter products based on search query
    const alikeProducts = allProducts.filter(product => {
      const name = product.name.toLowerCase().replace(/\s/g, '');
      return name.includes(editSearch);
    });

    // Calculate the number of matching products
    const size = alikeProducts.length;

    // Render the search results page
    res.render('pages/search', { title: q, path: req.path, products: alikeProducts, size });
  } catch (error) {
    console.error('Error searching for products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/products/:id', async function (req, res) {
  // Get the product ID from the request parameters
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      // Handle the case where no product was found
      return res.status(404).send('Product not found');
    }

    // Resolve all comment promises
    const commentPromises = product.reviewIds.map(async (id) => {
      const comment = await Review.findById(id);
      // Retrieve author name for each comment
      if (comment) {
        const author = await User.findById(comment.authorId);
        if (author) {
          comment.profileImg = author.profileImg
          comment.authorName = author.name;
        }
      }
      return comment;
    });

    // Wait for all comment promises to resolve
    const comments = await Promise.all(commentPromises);

    // Sort comments by time
    comments.sort((a, b) => b.createdAt - a.createdAt);

    // Construct the path as 'category/brand/name'
    const path = `catalog/${product.category}/${product.brand}/${product.name}`;
    const user = req.session.user

    // Render the product page with the product data and comments
    res.render('pages/product', { title: product.name, path: path, product, comments, id, user: user });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Internal Server Error');
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/userImage");
  },
  filename: (req, file, cb) => {
    // Check if a file was uploaded
    if (file) {

      cb(null, req.session.user.userId + path.extname(file.originalname));
    } else {

      cb(null, '');
    }
  }
});
const upload = multer({ storage: storage });

router.get('/account', async function (req, res, next) {
  if (req.session.user) {
    const user = await User.findById(req.session.user.userId)
    const order = await Order.find({ userId: req.session.user.userId })
    console.log(user)
    res.render('pages/account', { title: 'Account', path: req.path, user, order: order });
  } else {
    res.redirect('/')
  }
});

router.get('/account/edit/:id', async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)
  const path = `/account/edit/${user.id}`;
  if (user) {
    res.render('pages/editAccount', { user, title: "Edit Account", path: path, message: "" })
  }
})

router.post('/account/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (req.file) {
      console.log(req.file)
      // If file was uploaded, update profileImg field
      body.profileImg = `/images/userImage/${req.file.filename}`;
    }

    console.log(body);

    // Update user information in the database
    const user = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!user) {
      throw new Error('User not found');
    }

    res.redirect(`/account`);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post("/account/active/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      user.active = !user.active;
      await user.save();
      res.redirect('/account');
    } else {
      res.status(500).send("Deactivation not working");
    }
  } catch (error) {
    console.error("Error deactivating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/products/:id/reviews', async function (req, res) {
  const { id } = req.params
  const body = req.body
  console.log(body)

  const userId = req.session.user.userId

  console.log(userId)

  const product = await Product.findById(id)
  // const user = await User.findById(userId)
  // console.log(user)
  // console.log(product._id)
  const newReview = new Review({ ...body, authorId: userId, productId: product._id })
  console.log(newReview)

  await newReview.save()
    .then(review => {
      return User.findByIdAndUpdate(userId, { $push: { reviewIds: newReview._id } })
    })
    .then(() => {
      console.log('Comment added and associated with user successfully.');
    })
    .catch(err => {
      console.error('Error:', err);
    });

  // console.log(newReview)
  // console.log(product)

  product.reviewIds.push(newReview._id);
  await product.save();

  // console.log(user)

  res.redirect(`/products/${id}`)
})





router.get('/catalog', async (req, res) => {
  const products = await Product.find({})
  const categories = await Product.distinct('category')
  res.render('pages/catalog', { title: 'Products', path: req.path, product: products, categories: categories })
})

router.get('/contact', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/login')
  }
  res.render('pages/contact', { title: 'Contact', path: req.path, feedback })
})

router.post('/contact', async (req, res) => {
  try {
    if (!req.session.user) {
      res.redirect('/login')
    }
    const body = req.body
    body.userId = req.session.user.userId
    console.log(body)
    const contact = new Contact(body)

    if (contact) {
      contact.save()
      res.redirect('/contact')
      console.log("Save contact successful")
    } else {
      res.status(500).send("Error saving contact")
    }
  } catch (e) {
    next()
  }
})

router.get('/policies', async (req, res) => {
  res.render('pages/policy',{title: 'Policy', path: req.path})
}
   )

module.exports = router;