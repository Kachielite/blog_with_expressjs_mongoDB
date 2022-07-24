require('dotenv').config();
const cloudinary = require('cloudinary').v2;

module.exports = cloudinary.config({ 
    cloud_name: 'dahpyu601', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});
