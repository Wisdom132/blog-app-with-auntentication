const mongoose = require("mongoose");
// blog Schema
const draftSchema = mongoose.Schema({
    drafter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    featured_image: {
        type: Object,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },

}, {
    timestamp: true
});

const Draft = (module.exports = mongoose.model("Draft", draftSchema));