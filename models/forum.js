const mongoose = require("./connection")

const replySchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    body: {
        type: String
    },

    imgURL: [{
        type: String,
    }],
    delete: {
        type: Boolean
    },
    archive: {
        type: Boolean
    }

}, { timestamps: true })


const Reply = new mongoose.model("Reply", replySchema)

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    body: {
        type: String
    },

    imgURL: {
        type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    }],
    reply: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply"
    }],
    delete: {
        type: Boolean
    },
    archive: {
        type: Boolean
    },
    category: {
        type: String,
        enum: ['mobile', 'laptop', 'headphone'],
        required: true
    }
}, { timestamps: true })

const Post = new mongoose.model("Post", postSchema)

module.exports = { Post, Reply }
