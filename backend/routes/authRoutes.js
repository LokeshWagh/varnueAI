const express = require("express");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authmiddleware.js");
const supabase = require("../config/supabaseClient.js");

const router = express.Router();

// Signup - http://localhost:4000/api/signup - Public
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role = "user" } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    if (password !== confirmPassword || password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
//  Passwords hashing
    const hashedPassword = await bcrypt.hash(password, 12);
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role,
        },
      ])
      .select()
      .single();

    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
// JWT token generation
    const token = require("jsonwebtoken").sign(
      { id: data.id, email: data.email, role: data.role, name: data.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "Signup successful!",
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login - http://localhost:4000/api/login - Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = require("jsonwebtoken").sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Forgot password - http://localhost:4000/api/forgot-password - Public
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email required" });
    }

    const userEmail = email.toLowerCase().trim();

    const { data: user } = await supabase
      .from("users")
      .select("email")
      .eq("email", userEmail)
      .single();

    if (!user) {
      return res.json({ success: true, message: "OTP sent to your email!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Store OTP
    await supabase
      .from("users")
      .update({
        otp: otp.toString(),
        otp_expiry: otpExpiry.toISOString(),
      })
      .eq("email", userEmail);

    const emailSent = await sendOTP(userEmail, otp);

    if (emailSent) {
      console.log(`✅ OTP sent to ${userEmail}`);
      res.json({ success: true, message: "OTP sent to your email!" });
    } else {
      console.error(` Failed to send email to ${userEmail}`);
      res.json({ success: true, message: "OTP sent to your email!" });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Reset password - http://localhost:4000/api/reset-password - Public
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password too short" });
    }

    const userEmail = email.toLowerCase().trim();

    const { data: user } = await supabase
      .from("users")
      .select("id, otp, otp_expiry")
      .eq("email", userEmail)
      .single();

    if (!user || user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await supabase
      .from("users")
      .update({
        password: hashedPassword,
        otp: null,
        otp_expiry: null,
      })
      .eq("email", userEmail);

    res.json({
      success: true,
      message: "Password reset successful! Please login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all users https://localhost:4000/api/users --Admin only
router.get("/users", authMiddleware.requireAdmin, async (req, res) => {
  try {
    const { data } = await supabase
      .from("users")
      .select("id, name, email, role");

    res.json({ success: true, users: data, count: data.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update user https://localhost:4000/api/profile/:id --Admin only
router.put("/profile/:id", authMiddleware.requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Name and email required" });
    }

    // user can edit only his profile OR admin can edit anyone
    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const { data, error } = await supabase
      .from("users")
      .update({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: role,
      })
      .eq("id", id)
      .select("id, name, email, role")
      .maybeSingle();

    if (error) {
      console.log("SUPABASE ERROR:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update profile" });
    }

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully!",
      user: data,
    });
  } catch (error) {
    console.log("SERVER ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete https://localhost:4000/api/users/:id --Admin only
router.delete("/users/:id", authMiddleware.requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete user" });
    }

    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
