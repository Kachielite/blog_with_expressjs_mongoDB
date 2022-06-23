const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    imageURL:{
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