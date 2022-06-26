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
    postId:[{
                type: Schema.Types.ObjectId,
                ref: 'Blog',
                required: true
    }]
})



module.exports = mongoose.model('User', userSchema);