const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    image_id:{
        type: String,
        required: true
    },
    article:{
        type: String,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: {}});

module.exports = mongoose.model('Blog',blogSchema);