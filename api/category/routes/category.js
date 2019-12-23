const express = require("express");
const router = express.Router();
const Category = require("../model/category");
const categoryController = require("../controllers/categoryController");
const auth = require("../../../config/auth");

router.get("/", auth, categoryController.getCategory);
router.post("/", auth, categoryController.createNewCategory);
router.get("/category/:id", auth, categoryController.getCategoryById);
router.delete("/category/:id", auth, categoryController.removeCategory);

module.exports = router;
