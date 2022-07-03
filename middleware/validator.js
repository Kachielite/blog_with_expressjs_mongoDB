const { body } = require("express-validator/check");
const User = require("../models/userModel")

exports.validateRegistration = 
  body("username").trim().custom(value =>{
    return User.findOne({username: value}).then(username =>{
      if(username){
         throw new Error("Username exist. Please use a different username")
      }
    })
  }),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isStrongPassword({
      minLength: 4,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    })
    .withMessage("Password must have a min of four characters, contain at least one uppercase character, one lowercase character and one special character"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(
        "Passwords do not match. Please check the passwords to ensure they match"
      );
    }
  })

