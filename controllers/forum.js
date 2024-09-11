const { User, Post, Reply } = require("../models");
const { populate } = require("../models/user/user");
const fs = require('fs');

const { upload, parseImg } = require("./helper")

//Post
const getAllPosts = async (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login')
    }
    const posts = await Post.find({ archive: { $ne: true }, delete: { $ne: true } })
        .populate('authorId')
        .populate({
            path: "reply",
            match: { delete: { $ne: true }, archive: { $ne: true } },
            populate: { path: "authorId" }
        })
    if (posts) {
        // console.log(posts)
        res.render("forum/index", { posts: posts, title: "Post", path: req.path })
    } else {
        res.render("forum/index", { post: {}, title: "Post", path: req.path })
    }
}

exports.getAllPosts = getAllPosts

exports.getPost = async (req, res, next) => {
    // console.log('Handling GET request for /forum/:postId');
    if (!req.session.user) {
        res.redirect('/login')
    }
    // console.log('Request params:', req.params);
    try {
        const post = await Post.findById(req.params.postId)
            .populate("authorId")
            .populate({
                path: "reply",
                match: { delete: { $ne: true }, archive: { $ne: true } },
                populate: { path: "authorId" }
            })

        // console.log(post)

        if (post) {
            res.render("forum/post", { post: post, title: "Post", path: req.path, message: "" })
        } else {
            res.render("forum/post", { message: "Post not found", post: {}, title: "Post", path: req.path })
        }
    } catch (e) {
        res.render("forum/post", { message: "Post not found", post: {}, title: "Post", path: req.path })
    }
}

exports.postPost = async (req, res, next) => {
    // console.log(__dirname)
    const user = await User.findById(req.session.user.userId).then(user => user)
    const { title, body, category } = req.body
    const URL = parseImg(req.file, "post")

    const post = new Post({
        title: title,
        body: body,
        authorId: user._id,
        imgURL: URL,
        category: category,
        reply: []
    })


    // console.log(user)

    try {
        await post.save()

        // console.log("save post successfull")
        
        req.app.get('io').emit('newPost', { title: post.title, author: user.username });

        // console.log("Create Post successfull")
        res.redirect("/forum")
    } catch (e) {
        console.log(e)
        // console.log("create Post error")
        res.redirect("/forum")
    }
}

exports.likePost = async (req, res, next) => {
    try {
        const id = req.params.postId;
        const post = await Post.findById(id); // Await the promise

        if (post) {
            const userId = req.session.user.userId;
            const alreadyLiked = post.likes.includes(userId);

            if (alreadyLiked) {
                // Pull the element if it exists
                await Post.updateOne({ _id: id }, { $pull: { likes: userId } });
            } else {
                // Add the element if it does not exist
                await Post.updateOne({ _id: id }, { $addToSet: { likes: userId } });
            }

            res.redirect(`/forum#${id}`);


        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        next(error);
    }
};


exports.deletePost = async (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login')
    }
    try {
        const postId = req.body.postId

        const post = await Post.findById(postId)

        post.delete = true

        await post.save()

        // console.log("delete Sucessfull")
        res.redirect("/forum")
    } catch (e) {
        // console.log("delete Fail")
        res.send(500)
    }
}
exports.searchPost = async (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    try {
        const { q } = req.query;
        if (!q) {
            return res.redirect('/forum'); // Added return to stop further execution
        }

        const userSearch = q.replace(/\s/g, '').toLowerCase();
        const posts = await Post.find({ archive: { $ne: true }, delete: { $ne: true } })
            .populate('authorId');
        let matchPosts = [];

        if (posts) {
            matchPosts = posts.filter(e => {
                const postTitle = e.title.replace(/\s/g, '').toLowerCase();
                return postTitle.includes(userSearch) || userSearch.includes(postTitle);
            });
            return res.render("forum/index", { posts: matchPosts, title: `Search results for "${q}"`, path: req.path });
        } else {
            return res.render("forum/index", { posts: [], title: "Post", path: req.path });
        }
    } catch (e) {
        console.error("Searching post failed:", e);
        return res.status(500).send("Internal Server Error");
    }
};



exports.archivePost = async (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login')
    }
    try {
        const postId = req.body.postId

        const post = await Post.findById(postId)

        if (post.archive) {
            post.archive = false
        } else {
            post.archive = true
        }

        await post.save()

        // console.log("delete Sucessfull")
        res.redirect("/admin/forum")
    } catch (e) {
        // console.log("delete Fail")
        res.send(500)
    }
}

exports.updatePost = async (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login')
    }
    try {
        const post = await Post.findById(req.body.postId)
        const { title, body } = req.body
        post.title = title
        post.body = body
        post.save()
        // console.log("update Sucessfull")
        res.redirect(`/forum/post/${req.body.postId}`)

    } catch (e) {
        console.log(e)
        // console.log("update Fail")
        res.redirect(`/forum/post/${req.body.postId}`)

    }
}

exports.getArchievePost = async (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login')
    }
    const posts = await Post.find({ authorId: req.session.user.userId })
        .populate('authorId');
    if (posts) {
        // console.log(posts)
        res.render("forum/archievePost", { posts: posts, title: "Post", path: req.path })
    } else {
        res.render("forum/archievePost", { post: {}, title: "Post", path: req.path })
    }
}

// Reply
exports.postReply = async (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login')
    }
    // console.log(req.body.postId)
    try {
        const post = await Post.findById(req.body.postId)

        const URL = parseImg(req.file, "reply")

        const reply = new Reply({
            postId: req.body.postId,
            authorId: res.locals.userId,
            body: req.body.body,
            imgURL: URL
        })

        await reply.save()

        post.reply.push(reply._id)
        await post.save()
        // console.log("add reply successful")
        res.redirect(`/forum/post/${req.body.postId}`)
    } catch (e) {
        console.log(e)
    }
}


exports.deleteReply = async (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login')
    }
    // console.log("delete")
    // console.log(req.body)
    try {
        const { authorId, postId } = req.body
        const { replyId } = req.params
        // console.log("params-", { authorId, replyId, postId })

        const reply = await Reply.findById(replyId)
        reply.delete = true

        await reply.save()

        // console.log("delete reply successful")

        res.redirect(`/forum/post/${postId}`)
    } catch (e) {
        console.log(e)
        res.redirect(`/forum/post/${req.body.postId}`)
    }
}

exports.archiveReply = async (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login')
    }
    console.log("delete")
    console.log(req.body)
    try {
        const { authorId, postId } = req.body
        const { replyId } = req.params
        console.log("params-", { authorId, replyId, postId })

        const reply = await Reply.findById(replyId)
        if (reply.archive) {
            reply.archive = false
        } else {
            reply.archive = true
        }

        await reply.save()

        console.log("delete reply successful")

        res.redirect(`/admin/forum/view/${postId}`)
    } catch (e) {
        console.log(e)
        res.redirect(`/forum/post/${req.body.postId}`)
    }
}

