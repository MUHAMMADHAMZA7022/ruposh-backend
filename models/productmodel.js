const mongoose = require("mongoose");
const productschema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please Enter Product Name"],
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"],
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
        maxlength: [8, "Price caannot exceed 8 charaters"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [{
        publicid: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },],
    cateogery: {
        type: String,
        required: [true, "Please Enter Product Cateogry"],
    },
    stock: {
        type: Number,
        required: [true, "Please Enter Product Stock"],
        default: 1,
        maxlength: [4, "Stock Cannot exceed 4 Caharacters"],
    },
    numofreviews: {
        type: Number,
        default: 0,
    },
    reviews: [

        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "user",
                required: true
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            }
        },],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    createdate: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("product", productschema)