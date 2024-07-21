const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register new user
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// A user can Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: "Invalid login credentials" });
  }
});

// Get each tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo");
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
