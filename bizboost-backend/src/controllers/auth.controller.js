const User = require("../models/User");
const bcrypt = require("bcryptjs"); // Ensure using bcryptjs if that's what is installed, checking package.json... previously required 'bcrypt' in file but package.json has 'bcrypt' AND 'bcryptjs'. Safe to use bcrypt if installed. sticking to what was there.
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, password, name, full_name, fullName } = req.body;

    const userFullName = name || full_name || fullName;

    // 1. Validation: Missing Fields
    if (!userFullName) {
      return res.status(400).json({ message: "Full name is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // 2. Validation: Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 3. Validation: Password Length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // 4. Check Existing User
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // 5. Create User
    const password_hash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      full_name: userFullName,
      password_hash,
      role: "customer",
    });

    // Return user without password hash ideally, or just the user object as before
    res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Internal server error during registration", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      user,
      token
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Internal server error during login", error: err.message });
  }
};

module.exports = { register, login };
