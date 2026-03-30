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
        res.json({ message: "Image uploaded successfully", image });
    } catch (error) {
        res.status(500).json({ message: "Upload failed", error });
    }
};

const getUserImages = async (req, res) => {
    try {
        // Only return non-deleted images
        const images = await Image.find({ 
            userId: req.userId,
            isDeleted: false 
        }).sort({ createdAt: -1 });

        res.json(images);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch images" });
    }
};

const getDeletedImages = async (req, res) => {
    try {
        const images = await Image.find({ 
            userId: req.userId,
            isDeleted: true 
        }).sort({ deletedAt: -1 });

        res.json(images);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch trash bin" });
    }
};

const deleteImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        if (image.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // --- Soft Deletion Implementation ---
        image.isDeleted = true;
        image.deletedAt = new Date();
        await image.save();

        res.json({ message: "Image moved to trash" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error });
    }
};

const restoreImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image || !image.isDeleted) {
            return res.status(404).json({ message: "Deleted image not found" });
        }

        if (image.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        image.isDeleted = false;
        image.deletedAt = null;
        await image.save();

        res.json({ message: "Image restored successfully" });
    } catch (error) {
        res.status(500).json({ message: "Restore failed", error });
    }
};

module.exports = { 
    uploadImage, 
    getUserImages, 
    getDeletedImages,
    deleteImage, 
    restoreImage 
};