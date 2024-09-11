const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../../models/product')
const Review = require('../../models/review')
const User = require('../../models/user/user')
const Session = require('../../models/session')
const Contact = require('../../models/contact')
const field = require('../../models/productField')
const { Post, Reply } = require('../../models/forum')


const { updateUser, deleteUser } = require("../../controllers")

const env = require('dotenv');
const e = require('express');
const { authorize } = require('../../middlewares');
const { Order } = require('../../models');
const { getOrderAdmin } = require('../../controllers/order');
const { deletePost, archivePost, deleteReply, archiveReply } = require('../../controllers/forum');
env.config();

const app = express(); // Create an Express application

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.use(authorize)
const urlPattern = /^(https?:\/\/)?((([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63})|localhost|(\d{1,3}\.){3}\d{1,3}|(\[[0-9a-fA-F:]+\]))(:\d{1,5})?(\/[^\s]*)?$/i;

function isValidURL(url) {
  return urlPattern.test(url);
}

/* GET users listing. */
router.get('/', async (req, res) => {
  let products = await Product.find()

  await Promise.all(products.map(async item => {
    let sell = await Order.aggregate([
      { $match: { 'products.productId': item._id } }, // Filter orders with the specified product
      {
        $unwind: '$products' // Deconstruct the 'products' array into individual product documents
      },
      {
        $match: { 'products.productId': item._id } // Filter again to ensure only matching products
      },
      {
        $group: {
          _id: null, // Group all documents
          totalQuantity: { $sum: '$products.quantity' } // Sum the quantity for all matching products
        }
      }
    ])
    if (sell.length > 0) {
      // console.log(sell[0].totalQuantity)
      sell = sell[0].totalQuantity
    } else {
      sell = 0
    }

    item.sell = sell
  }))

  res.render('admin/pages/home', { title: 'Home', products: products })
})


router.get('/profile', (req, res) => {
  res.render('admin/pages/profile', { title: 'Profile' })
})


router.get('/products', async (req, res) => {
  const products = await Product.find({})

  res.render('admin/pages/products', { title: 'Products', products })
})
router.get('/products/search', async (req, res) => {

  try {
    const { q } = req.query;
    if (!q) {
      return res.redirect('/admin/products'); // Added return to stop further execution
    }

    const userSearch = q.replace(/\s/g, '').toLowerCase();
    const products = await Product.find({})

    let matchProduct = [];

    if (products) {
      matchProduct = products.filter(e => {
        const name = e.name.replace(/\s/g, '').toLowerCase();
        return name.includes(userSearch) || userSearch.includes(name);
      });
      res.render('admin/pages/products', { title: 'Products', products: matchProduct })
    } else {
      res.render('admin/pages/users', { title: 'Products', products: [] })
    }
  } catch (e) {
    console.error("Searching post failed:", e);
    return res.status(500).send("Internal Server Error");
  }
})

router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)

    // Retrieve the product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Retrieve comments for the product
    const commentsArr = product.reviewIds;
    const commentPromises = commentsArr.map(async (id) => {
      const comment = await Review.findById(id);
      // Retrieve author name for each comment
      if (comment) {
        const author = await User.findById(comment.authorId);
        if (author) {
          comment.authorName = author.name;
        }
      }
      return comment;
    });

    let comments = await Promise.all(commentPromises);
    comments = comments.sort((a, b) => b.createdAt - a.createdAt);

    res.render('admin/pages/view', { title: product.name, product, comments });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/products/:id/edit', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id)
  const category = product.category
  res.render(`admin/pages/${category}Edit`, { title: `${product.name} edit`, ...field[category], category: category, product })




})

router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const editProduct = req.body;

  console.log({ id, editProduct })
  if (!isValidURL(editProduct.mainImg)) {
    editProduct.mainImg = "https://example.com"
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, editProduct, { new: true, runValidators: true });

  if (!updatedProduct) {
    res.status(500).send('Product not found')
  } else {
    res.sendStatus(200);
  }
})


router.delete('/products/:id', async (req, res) => {
  const { id } = req.params
  try {
    deletedProduct = await Product.findById(id);
    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }
    for (const reviewId of deletedProduct.reviewIds) {
      try {
        const deletedReview = await Review.findByIdAndDelete(reviewId);
        if (deletedReview) {

          await User.findByIdAndUpdate(deletedReview.authorId, { $pull: { reviewIds: deletedReview._id } });
        }
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
    await Product.findByIdAndDelete(id)
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Internal Server Error");
  }
  res.redirect('/admin/products')

})

router.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Review.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).send("Comment not found");
    }

    const product = await Product.findByIdAndUpdate(comment.productId, { $pull: { reviewIds: id } });
    const user = await User.findByIdAndUpdate(comment.authorId, { $pull: { reviewIds: id } }, { new: true, runValidators: true }); // Added { new: true } option to return the updated document

    if (!user) {
      return res.status(404).send("User not found");
    }

    console.log("Updated User:", user); // Log the updated user document
    res.redirect(`/admin/products/${product._id}`);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/users', async (req, res) => {
  const users = await User.find({})

  res.render('admin/pages/users', { title: 'Users', users })
})
router.post('/users/role/:id', async (req, res) => {
  try {

    const newRole = req.body.role;

    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { $set: { role: newRole } }, { new: true, runValidators: true });

    if (user) {
      res.sendStatus(200)
    } else {
      throw new Error('Failed to update role');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/users/search', async (req, res) => {

  try {
    const { q } = req.query;
    if (!q) {
      return res.redirect('/admin/users'); // Added return to stop further execution
    }

    const userSearch = q.replace(/\s/g, '').toLowerCase();
    const users = await User.find({})

    let matchUsers = [];

    if (users) {
      matchUsers = users.filter(e => {
        const email = e.email.replace(/\s/g, '').toLowerCase();
        return email.includes(userSearch) || userSearch.includes(email);
      });
      res.render('admin/pages/users', { title: 'Users', users: matchUsers })
    } else {
      res.render('admin/pages/users', { title: 'Users', users: [] })
    }
  } catch (e) {
    console.error("Searching post failed:", e);
    return res.status(500).send("Internal Server Error");
  }
})


router.post('/users/lock/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (user) {
      user.lock = !user.lock;

      await user.save();
      

      if (user.lock === true) {
        let session = await Session.find({}).then((items) => {
          items.forEach(async item => {
            if (item.session.user.userId == id) {
              await Session.deleteOne({ 'session.user.userId': item.session.user.userId })
              
            }
           
          })
        }
        )
        

    

        console.log((await Session.find({})).length)
      }

      res.redirect('/admin/users');
    } else {
      res.status(500).send("User Not Found");
    }
  } catch (error) {
    console.error("Error toggling user lock:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Modyfy user roles
// router.put('/users', updateUser)

// // delete user
// router.delete("/user", deleteUser)


router.get('/new/:category', (req, res) => {

  const { category } = req.params

  res.render(`admin/pages/${category}`, { title: category, ...field[category], category: category })
})



router.post('/products', async (req, res) => {
  const product = req.body
  console.log(product)
  if (!isValidURL(product.mainImg)) {
    product.mainImg = "https://example.com"
  }
  const newProduct = new Product(product)
  await newProduct.save();
  res.sendStatus(200);
})

router.get('/forum', async (req, res) => {
  const posts = await Post.find().populate('authorId', 'username');
  res.render('admin/pages/forum', { title: "Forum", posts })
})
router.get('/forum/search', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  try {
    const { q } = req.query;
    if (!q) {
      return res.redirect('/admin/forum'); // Added return to stop further execution
    }

    const userSearch = q.replace(/\s/g, '').toLowerCase();
    const posts = await Post.find().populate('authorId', 'username');
    let matchPosts = [];

    if (posts) {
      matchPosts = posts.filter(e => {
        const postTitle = e.title.replace(/\s/g, '').toLowerCase();
        return postTitle.includes(userSearch) || userSearch.includes(postTitle);
      });
      res.render('admin/pages/forum', { title: "Forum", posts: matchPosts })
    } else {
      res.render('admin/pages/forum', { title: "Forum", posts: [] })
    }
  } catch (e) {
    console.error("Searching post failed:", e);
    return res.status(500).send("Internal Server Error");
  }
})

router.get('/forum/view/:id', async (req, res) => {
  const { id } = req.params
  try {
    const post = await Post.findById(id)
      .populate("authorId", 'username')
      .populate({
        path: "reply",
        populate: { path: "authorId", select: "username" }
      })


    console.log(post)

    if (post) {
      res.render("admin/pages/postView", { post: post, title: "Post", message: "" })
    }
  } catch (e) {
    res.status(500).send("Post not found")
  }


})
router.get('/feedback', async (req, res) => {
  const feedbacks = await Contact.find({})
  if (!feedbacks) {
    res.status(500).send('Feedback not found')

  }
  // console.log(feedbacks)
  res.render('admin/pages/feedback', { title: "Feedback", feedbacks })


})
router.get('/feedback/check/:id', async (req, res) => {
  const { id } = req.params
  const feedback = await Contact.findById(id)
  if (!feedback) {
    res.status(500).send('Feedback not found')

  }
  feedback.check = !feedback.check
  await feedback.save()
  res.redirect('/admin/feedback')

})


router.get('/order', async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: 'products.productId',
        select: 'name price mainImg'
      }).populate({
        path: 'userId',
        select: 'name'
      })
    res.render("admin/pages/order", { orders: orders, title: "Orders" })
  } catch (e) {
    res.render('admin/pages/home', { title: 'Home' })
  }
})

router.get("/order/:orderId", getOrderAdmin)

// Forum 
router.delete('/deleteReply', async (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login')
  }
  console.log("delete")
  console.log(req.body)
  try {
    const { authorId, postId, replyId } = req.body

    const reply = await Reply.findById(replyId)
    reply.delete = true

    await reply.save()

    console.log("delete reply successful")

    res.redirect(`/admin/forum/view/${postId}`)
  } catch (e) {
    console.log(e)
    res.redirect(`/forum/post/${req.body.postId}`)
  }
})
router.put('/archivePost', archivePost)

router.delete('/deletePost', async (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login')
  }
  try {
    const postId = req.body.postId

    const post = await Post.findById(postId)

    post.delete = true

    await post.save()

    console.log("delete Sucessfull")
    res.redirect("/admin/forum")
  } catch (e) {
    console.log("delete Fail")
    res.send(500)
  }
})
router.put('/archiveReply', archiveReply)






module.exports = router;
