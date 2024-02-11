// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/", userController.getUsers);
router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.get("/verify-email", userController.verifyEmail);
router.post("/", userController.addUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post(
  "/resend-verification-email",
  userController.resendVerificationEmail
);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
module.exports = router;
