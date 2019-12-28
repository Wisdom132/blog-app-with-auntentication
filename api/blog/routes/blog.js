const express = require("express");
const router = express.Router();
const Blog = require("../model/blog");
const upload = require("../../../config/multer");
const blogController = require("../controllers/blogController");
const auth = require("../../../config/auth");

router.get("/", blogController.getBlogPosts);
router.post(
  "/",
  auth,
  upload.upload.array("featured_image", 3),
  // upload.single("featured_image"),
  blogController.createNewPost
);
router.get("/:id", blogController.getBlogPostById);
router.get("/category/:id", blogController.getPostByCateggory);
router.delete("/:id", auth, blogController.removeBlogPost);

module.exports = router;
