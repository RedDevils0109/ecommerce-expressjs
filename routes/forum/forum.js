"use strict"

const express = require("express")

const { getAllPosts, getPost, updatePost, deletePost, postPost,
    postReply, deleteReply, likePost, searchPost, getArchievePost } = require("../../controllers/forum")
const { upload } = require("../../controllers/helper")

const router = express.Router()

// CRUD for Post

router.get("/", getAllPosts)
router.get("/post/:postId", getPost)
router.get("/archievePost", getArchievePost)

router.post("/post", upload.single("img"), postPost);
router.put("/post", updatePost)
router.get("/search", searchPost)
router.post("/post/like/:postId", likePost)
router.delete("/post", deletePost)

// CRUD for Reply
router.post("/reply", upload.single("img"), postReply)
router.delete("/reply/:replyId", deleteReply)
// router.put("/reply/:replyId", upload.single("img"), deleteReply)


exports.forumRouter = router
