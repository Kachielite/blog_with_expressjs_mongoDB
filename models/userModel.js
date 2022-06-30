const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema= Schema({
    username:{
        type: String,
        required: true
    }, 
    password:{
        type: String,
        required: true        
    },
    email:{
        type: String,
        required: true
    },
    resetToken: String,
    resetExpiration: Date,
    postId:[{
                type: Schema.Types.ObjectId,
                ref: 'Blog',
                required: true
    }]
})



module.exports = mongoose.model('User', userSchema);