const express = require("express");
const router = express.Router();
const Category = require("../model/category");
const categoryController = require("../controllers/categoryController");

router.get("/category", categoryController.getCategory);
router.post("/category", categoryController.createNewCategory);
router.get("/category/:id", categoryController.getCategoryById);
router.delete("/category/:id", categoryController.removeCategory);

module.exports = router;
