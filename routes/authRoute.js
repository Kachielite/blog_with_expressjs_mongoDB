const express = require("express");
const validator = require("../middleware/validator");
const { body } = require("express-validator/check");
const User = require("../models/userModel");

const authController = require("../controllers/authController");

const route = express.Router();

//GET Login Page
route.get("/login", authController.getLogin);

//POST log in
route.post("/auth/login",  authController.postLogin);

//GET Register Page
route.get("/register", authController.getRegistration);

//POST Registration
route.post(
  "/auth/register",
  [
    body("username")
      .trim()
      .custom((value) => {
        return User.findOne({ username: value }).then((username) => {
          if (username) {
            return Promise.reject(
              "Username exist. Please use a different username."
            );
          }
        });
      }),
    body("email")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((email) => {
          if (email) {
            return Promise.reject("Email exist. Please use a different email.");
          }
        });
      }),
    body("password")
      .isStrongPassword({
        minLength: 4,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must have a min of four characters, contain at least one uppercase character, one lowercase character and one special character"
      ),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(
          "Passwords do not match. Please check the passwords to ensure they match"
        );
      }
      return true;
    }),
  ],
  authController.postRegistration
);

//POST LOGOUT
route.post("/logout", authController.postLogout);

//GET Forget password page
route.get("/forget", authController.getForgetPasswordPage);

//POST send password reset link
route.post("/auth/forget", authController.forgetPassword);

//Get reset password page
route.get("/reset/:token", authController.getResetPassword);

//POST reset password
route.post("/auth/reset", authController.resetPassword);

module.exports = route;
