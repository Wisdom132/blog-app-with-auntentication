const express = require("express");
const router = express.Router();
const Category = require("../model/category");
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getCategory);
router.post("/", categoryController.createNewCategory);
router.get("/category/:id", categoryController.getCategoryById);
router.delete("/category/:id", categoryController.removeCategory);

module.exports = router;
