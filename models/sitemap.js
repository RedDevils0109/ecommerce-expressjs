const { Post } = require('./forum');
const Product = require('./product');

const staticLinks = [
    { url: '/', changefreq: 'daily', priority: 0.3 },
    { url: '/cart', changefreq: 'daily', priority: 0.3 },
    { url: '/forum', changefreq: 'daily', priority: 0.3 },
    { url: '/account', changefreq: 'daily', priority: 0.3 },
    { url: '/about', changefreq: 'daily', priority: 0.3 },
    { url: '/contact', changefreq: 'daily', priority: 0.3 },
    { url: '/catalog/mobile', changefreq: 'daily', priority: 0.3 },
    { url: '/catalog/laptop', changefreq: 'daily', priority: 0.3 },
    { url: '/catalog/headphone', changefreq: 'daily', priority: 0.3 },
    { url: '/login', changefreq: 'daily', priority: 0.3 },
    { url: '/signUp', changefreq: 'daily', priority: 0.3 }
];

const getProductLink = async () => {
    const allProduct = await Product.find({});
    const links = allProduct.map(e => ({
        url: `/products/${e._id}`,
        changefreq: 'daily',
        priority: 0.3
    }));
    return links;
};

const getForumLink = async () => {
    const allPost = await Post.find({});
    const links = allPost.map(e => ({
        url: `/forum/post/${e._id}`,
        changefreq: 'daily',
        priority: 0.3
    }));
    return links;
};

const generateLinks = async () => {
    const forumLinks = await getForumLink();
    const productLinks = await getProductLink();
    return [...staticLinks, ...forumLinks, ...productLinks];
};

module.exports = generateLinks;
