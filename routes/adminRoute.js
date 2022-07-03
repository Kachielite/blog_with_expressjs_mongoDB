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
    body("imageURL")
      .not()
      .isEmpty()
      .withMessage("Please provide an image url for the article. Must be the URL of the image for it to display correctly. You can upload images to an online resource and paste the URL here")
      .isURL({ protocols: ["http", "https", "ftp"], require_protocol: true })
      .withMessage("Kindly provide a valid image url")
      .trim(),
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
