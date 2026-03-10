const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    filename: {
        type: String,
        required: true
    }

},
{ timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;