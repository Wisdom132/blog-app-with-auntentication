const express = require("express");
const router = express.Router();
const Blog = require("../model/blog");
const upload = require("../../../config/multer");
const blogController = require("../controllers/blogController");
const auth = require("../../../config/auth");

router.get("/", blogController.getBlogPosts);
router.get("/get-category-blog", blogController.getAllPostsAndCategory);
router.post(
  "/",
  auth,
  upload.upload.array("featured_image", 3),
  blogController.createNewPost
);
router.get("/:id", blogController.getBlogPostById);
router.get("/category/:id", blogController.getPostByCateggory);
router.delete("/:id", auth, blogController.removeBlogPost);

module.exports = router;
