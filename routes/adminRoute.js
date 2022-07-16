const express = require("express");
const adminController = require("../controllers/adminController");
const isAuth = require("../middleware/isAuth");
const { body } = require("express-validator/check");

const route = express.Router();

//GET Admin Dashboard
route.get("/admin", isAuth, adminController.getAdminDashboard);

//GET Edit Page
route.get("/admin/edit/:postId", isAuth, adminController.editPost);

//POST update
route.post(
  "/admin/update/:postId",
  [
    body("title")
      .not()
      .isEmpty()
      .withMessage("Please provide a title for your article")
      .trim(),
    body('image')
      .custom((value, {req}) =>{
        if(typeof req.file === 'undefined'){
          return true;
        }
        if(req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/jpg'){
          return true;
        } else {
          return false;
        }
      })
      .withMessage('Invalid Image!!!! Image must be JPEG, JPG or PNG'),
    body("article")
      .not()
      .isEmpty()
      .withMessage("You have not written anything :(")
      .isLength({ min: 40 })
      .withMessage("Articles must have a minimum of 40 character")
      .trim(),
  ],
  isAuth,
  adminController.postUpdate
);

//GET New Post Page
route.get("/admin/add_post", isAuth, adminController.getEditPostPage);

//POST new post
route.post(
  "/admin/post_blog",
  [
    body("title")
      .not()
      .isEmpty()
      .withMessage("Please provide a title for your article")
      .trim(),
    body('image')
      .custom((value, {req}) =>{
        if(req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/jpg'){
          return true;
        } else {
          return false;
        }
      })
      .withMessage('Invalid Image!!!! Image must be JPEG, JPG or PNG'),
    body("article")
      .not()
      .isEmpty()
      .withMessage("You have not written anything :(")
      .isLength({ min: 40 })
      .withMessage("Articles must have a minimum of 40 character")
      .trim(),
  ],
  isAuth,
  adminController.postNewBlogPost
);

//Delete post
route.post("/admin/delete/:postId", isAuth, adminController.deletePost);

module.exports = route;
