// controllers/userController.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  // Authenticate User
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "Email does not exist." });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .json({ success: false, message: "Incorrect password." });

  // Check if user is verified
  if (!user.emailVerified)
    return res
      .status(401)
      .json({ success: false, message: "Email has not been verified." });

  // Generate Token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  delete user.password;
  res
    .header("Authorization", token)
    .json({
      success: true,
      data: user,
      message: "Logged in successfully",
      token,
    });
};

exports.signup = async (req, res) => {
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    });

    // Send verification email
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const url = `${process.env.BASE_URL}verify-email/${token}`;
    const text = `<p>Please verify your email by clicking on the link below:</p><p>${url}</p>`;
    await sendEmail(user.email, "Verify Email", text);
    res.status(200).json({
      success: true,
      message: "account created successfully",
    });
  } catch (error) {
    if (error.code === "P2002") {
      // This is the error code for a unique constraint violation
      return res.status(409).json({ error: "Email already exists" });
    } else {
      // Some other error occurred
      return res
        .status(500)
        .json({ error: "An error occurred while creating the account" });
    }
  }
};

exports.addUser = async (req, res) => {
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword, // Store hashed password
      },
    });

    // Do not return password
    delete user.password;

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { emailVerified: true },
    });

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully." });
    // Or redirect to a frontend route
    // res.redirect(`${process.env.FRONTEND_URL}/email-verified`);
  } catch (error) {
    res.status(400).send("Invalid or expired verification link.");
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (!user) return res.status(404).send("User not found.");

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Here you need to send the email to the user with the resetToken
    // The email should contain a link to your front-end password reset page with the token as a parameter
    const url = `${process.env.BASE_URL}reset-password/${resetToken}`;

    const text = `<p>Please reset your password by clicking on the link below:</p><p>${url}</p>`;

    await sendEmail(user.email, "Reset your Password", text);

    res
      .status(200)
      .json({ success: true, message: "Password reset email sent." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (!user) return res.status(404).send("User not found.");

    if (user.emailVerified)
      return res.status(400).send("Email is already verified.");
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const url = `${process.env.BASE_URL}verify-email/${token}`;
    const text = `<p>Please verify your email by clicking on the link below:</p><p>${url}</p>`;
    await sendEmail(user.email, "Verify Email", text);
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
