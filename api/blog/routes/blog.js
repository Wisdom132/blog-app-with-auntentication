const express = require("express");
const router = express.Router();
const Blog = require("../model/blog");
const upload = require("../../../config/multer");
const blogController = require("../controllers/blogController");
const auth = require("../../../config/auth");

router.get("/", auth, blogController.getBlogPosts);
router.post(
  "/",
  auth,
  upload.upload.single("featured_image"),
  blogController.createNewPost
);
router.get("/:id", auth, blogController.getBlogPostById);
router.get("/category/:id", auth, blogController.getPostByCateggory);
router.delete("/:id", auth, blogController.removeBlogPost);

module.exports = router;
