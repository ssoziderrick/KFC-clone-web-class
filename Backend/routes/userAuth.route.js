const { Router } = require("express");
const userDetails = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userAuthRouter = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

userAuthRouter.post("/signup", async (req, res) => {
  try {
    const firstname = String(req.body.firstname || "").trim();
    const lastname = String(req.body.lastname || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!firstname || !lastname || !emailPattern.test(email) || password.length < 8) {
      return res.status(400).json({ message: "Enter your first and last name, a valid email, and a password of at least 8 characters." });
    }
    if (await userDetails.findOne({ email })) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    const hash = await bcrypt.hash(password, 12);
    await userDetails.create({ firstname, lastname, email, password: hash, token: "" });
    return res.status(201).json({ message: "Account created successfully. You can now log in." });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "An account with this email already exists." });
    console.error("Signup failed:", err.message);
    return res.status(500).json({ message: "Unable to create account right now." });
  }
});

userAuthRouter.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });
    if (!process.env.SECRET_KEY) return res.status(503).json({ message: "Login is not configured. Set SECRET_KEY in Backend/.env and restart the API." });
    const user = await userDetails.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const token = jwt.sign(
      { sub: String(user._id), firstname: user.firstname, lastname: user.lastname, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );
    user.token = token;
    await user.save();
    return res.status(200).json({ message: "Login successful.", token, user: { id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email } });
  } catch (err) {
    console.error("Login failed:", err.message);
    return res.status(500).json({ message: "Unable to log in right now." });
  }
});

userAuthRouter.post("/logout", async (req, res) => {
  try {
    const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "") || req.headers.token;
    if (!token) return res.status(400).json({ message: "Authentication token is required." });
    await userDetails.findOneAndUpdate({ token }, { $set: { token: "" } });
    return res.status(200).json({ message: "Logged out." });
  } catch (err) {
    console.error("Logout failed:", err.message);
    return res.status(500).json({ message: "Unable to log out right now." });
  }
});
module.exports = userAuthRouter;
