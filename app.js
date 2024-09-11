const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const ejs = require('ejs');
const env = require('dotenv')
const methodOverride = require('method-override');
const { SitemapStream, streamToPromise } = require('sitemap')
const { Readable } = require('stream')

const cookieParser = require('cookie-parser');
const session = require("express-session");
const mongoSession = require("connect-mongodb-session")(session);
const category = require('./models/productField')


// Check for Log in
const { isAuth } = require("./middlewares")

env.config();

const indexRouter = require('./routes/user/index');
const adminRouter = require('./routes/admin/admin');
const cartRouter = require('./routes/cart/cart');
const { authRouter } = require("./routes");
const { forumRouter } = require('./routes/forum/forum');
const orderRoute = require("./routes/order/order");
const { time } = require('console');
const { title } = require('process');

const app = express();
const mgSession = new mongoSession({
  uri: process.env.URI,
  collection: "sessions"
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));


// Use Cookie and Session middlewares
app.use(cookieParser(process.env.SECRET_KEY));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  store: mgSession
}));

// Check for user is authenticated or not
app.use(isAuth)

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/cart', cartRouter)
app.use("/forum", forumRouter)
app.use('/order', orderRoute)

app.use(authRouter);


const sitemap = require('express-sitemap')();
const generateSitemapPaths = (router, basePath) => {
  const generatedSitemap = sitemap.generate(router);
  return Object.keys(generatedSitemap).map(route => {
    return `${basePath}${route}`;
  });
};
const xmlCart = generateSitemapPaths(cartRouter, '/cart');
const xmlForum = generateSitemapPaths(forumRouter, '/forum');
const xmlOrder = generateSitemapPaths(orderRoute, '/order');

const xmlIndex = generateSitemapPaths(indexRouter, '');
const allPaths = [...xmlIndex, ...xmlCart, ...xmlForum, ...xmlOrder];



app.get('/sitemap', (req, res) => {
  res.render('pages/sitemap', { title: 'Sitemap', path: req.path, xml: allPaths, category })
})



function generateSitemapXML(map) {
  // Replace with your actualmain
  const urls = allPaths.map(path => {
    return {
      url: path,
      changefreq: "daily",
      priority: 0.4

    }
  })

  return urls
}
app.get('/sitemap.xml', function (req, res) {

  const xmlList = generateSitemapXML(allPaths);
  res.header('Content-Type', 'application/xml');
  const baseUrl = 'https://group-project-cosc3060-2024a-b1nance.onrender.com/'
  const stream = new SitemapStream({ hostname: baseUrl });

  streamToPromise(Readable.from(xmlList).pipe(stream)).then(data => {
    res.send(data.toString());
  }).catch(err => {
    console.error(err);
    res.status(500).end();
  })
});








app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.render('pages/not-found', { title: 'Not Found', path: '' })
});

// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
  const { statusCode = 500, message = 'Internal Server Error' } = err;
  res.status(statusCode).render('pages/error', { title: 'Error', path: '', err: err });
});

// error handler
module.exports = app;