const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { uploadImage, getUserImages, deleteImage } = require("../controllers/imageController");
router.post(
    "/upload",
    authMiddleware,
    upload.single("image"),
    uploadImage
);

router.get("/", authMiddleware, getUserImages);

router.delete("/:id", authMiddleware, deleteImage);

module.exports = router;