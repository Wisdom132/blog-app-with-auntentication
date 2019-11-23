const express = require("express");
const router = express.Router();
const Blog = require("../model/blog");
const blogController = require("../controllers/blogController");

router.get("/blog", blogController.getBlogPosts);
router.post("/blog", blogController.createNewPost);
router.get("/blog/:id", blogController.getBlogPostById);
router.get("/blog/category/:id", blogController.getPostByCateggory);
router.delete("/blog/:id", blogController.removeBlogPost);

module.exports = router;
