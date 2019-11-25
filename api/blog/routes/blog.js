const express = require("express");
const router = express.Router();
const Blog = require("../model/blog");
const upload = require("../../../config/multer");
const blogController = require("../controllers/blogController");

router.get("/blog", blogController.getBlogPosts);
router.post(
  "/blog",
  upload.upload.single("featured_image"),
  blogController.createNewPost
);
router.get("/blog/:id", blogController.getBlogPostById);
router.get("/blog/category/:id", blogController.getPostByCateggory);
router.delete("/blog/:id", blogController.removeBlogPost);

module.exports = router;
