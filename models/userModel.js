const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema= Schema({
    name:{
        type: String,
        required: true
    }, 
    email:{
        type: String,
        required: true        
    },
    postId:[{
                type: Schema.Types.ObjectId,
                ref: 'Blog',
                required: true
    }]
})



module.exports = mongoose.model('User', userSchema);