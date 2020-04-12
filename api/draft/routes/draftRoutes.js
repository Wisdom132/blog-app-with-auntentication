const express = require("express");
const router = express.Router();
const upload = require("../../../config/multer");
const draftController = require("../controller/draftController");
const auth = require("../../../config/auth");

router.get("/", auth, draftController.getAllDraft);
router.post(
    "/draft-post",
    // auth,
    upload.upload.array("featured_image", 3),
    draftController.draftNewPost
);
router.get("/:id", auth, draftController.getDraftById);
router.get("/drafter/:id", auth, draftController.getDraftByUser);
router.delete("/:id", auth, draftController.removeDraft);
router.put("/update/:id", auth, draftController.updateDraft);

module.exports = router;