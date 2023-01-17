require("dotenv").config();
const express = require("express");
// const errorHandler = require("../../middleware/error");
const authHandler = require("../../middleware/auth");
const User = require("../../models/user");
const { generateAuthToken } = require("../../utils/helpers");
const { userMail } = require("../../utils/user.mail");
const { userSMS } = require("../../utils/user.sms");
const createUserSchema = require("./validationSchema");

const router = express.Router();

// All users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).send(users);
});

// User email verify
router.get("/verifyemail", async (req, res) => {
  // extract the token from the query parameter
  const token = req.query.token;

  // look up the user in the database using the token
  const user = await User.findOne({ token: token });
  if (!user.token) {
    res.status(400).send({ message: "token not available" });
    return;
  } else {
    user.isEmailVerified = true;
    user.token = null;
    user.save();
    res.status(200).send({ message: "Email verified.." });
  }
});

// User sms verify
router.get("/verifysms", async (req, res) => {
  // extract the token from the query parameter
  const token = req.query.token;

  // look up the user in the database using the token
  const user = await User.findOne({ token: token });
  if (!user.token) {
    res.status(400).send({ message: "token not available" });
    return;
  } else {
    user.isEmailVerified = true;
    user.token = null;
    user.save();
    res.status(200).send({ message: "Email verified.." });
  }
});

// Specific user
router.get("/:userId", authHandler, async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId });

  res.status(200).send(user);
});

// Update user
router.put("/:userId", authHandler, async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    {
      _id: req.params.userId,
    },
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    }
  );
  const { error } = createUserSchema(updatedUser);
  if (error) {
    return res.status(400).send({ message: error.message });
  }
  let user = new User(updatedUser);
  user = await user.save();
  res.status(200).send(user);
});

// Delete user
router.delete("/:userId", authHandler, async (req, res) => {
  const user = await User.findByIdAndDelete({
    _id: req.params.userId,
  });

  res.status(200).send(user);
});

// Signup user
router.post("/signup", async (req, res) => {
  const payload = req.body;
  const { error } = createUserSchema(payload);
  if (error) {
    return res.status(400).send({ message: error.message });
  }

  const token = generateAuthToken({
    name: payload.name,
    email: payload.email,
    password: payload.password,
  });

  // res.status(200).send({ message: "success", token });

  let user = new User({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    token: token,
    isEmailVerified: false,
  });

  user = await user.save();
  userMail(payload.email, token);
  userSMS(payload.phone);
  res.status(200).send({ message: "User saved successfully", user });
});

// Login user
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const userPass = req.body.password;
  if (!user) {
    return res.status(400).send({ message: "Invalid Email or Password" });
  }

  if (req.body.password !== userPass) {
    return res.status(400).send({ message: "Invalid Email or Password" });
  }

  const token = generateAuthToken({
    name: user.name,
    email: user.email,
    password: user.password,
    id: user._id,
  });

  res.status(200).send({ message: "success", token });
});

router.get("/logout", (req, res) => {
  res.status(200).send({ message: "log out" });
});

module.exports = router;
