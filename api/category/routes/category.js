const express = require("express");
const router = express.Router();
const Category = require("../model/category");
const categoryController = require("../controllers/categoryController");
const auth = require("../../../config/auth");

router.get("/", categoryController.getCategory);
router.post("/", auth, categoryController.createNewCategory);
router.get("/:id", auth, categoryController.getCategoryById);
router.delete("/:id", auth, categoryController.removeCategory);

module.exports = router;
