const Image = require("../models/image.model");
const fs = require("fs");
const path = require("path");

const uploadImage = async (req, res) => {

    try {

        const image = new Image({
            userId: req.userId,
            filename: req.file.filename
        });

        await image.save();

        res.json({
            message: "Image uploaded successfully",
            image
        });

    } catch (error) {

        res.status(500).json({
            message: "Upload failed",
            error
        });

    }

};


const getUserImages = async (req, res) => {
    try {

        const images = await Image.find({ userId: req.userId });

        res.json(images);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch images"
        });

    }
};


const deleteImage = async (req, res) => {
    try {

        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({
                message: "Image not found"
            });
        }

        // ensure the logged in user owns the image
        if (image.userId.toString() !== req.userId) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        // delete file from uploads folder
        const filePath = path.join("uploads", image.filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // delete from database
        await image.deleteOne();

        res.json({
            message: "Image deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Delete failed",
            error
        });

    }
};


module.exports = { uploadImage, getUserImages, deleteImage };