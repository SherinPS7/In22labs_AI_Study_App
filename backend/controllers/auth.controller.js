const { User } = require('../models'); // ✅ Fix if you're using module.exports
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { z } = require("zod");
const { createUserSchema } = require("../validators/authSchema");
const { LoginUserSchema } = require("../validators/authSchema");

// ✅ New Controller: Check if mobile number exists
exports.checkMobile = async (req, res) => {
  const { mobile } = req.body;

  try {
    const existingUser = await User.findOne({ where: { mobile } });

    if (existingUser) {
      return res.status(200).json({ status: "exists", message: "Mobile number already registered" });
    }

    return res.status(200).json({ status: "new", message: "Mobile number is available" });
  } catch (err) {
    console.error('Error checking mobile:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Final Signup (after OTP is verified on frontend)
exports.signup = async (req, res) => {
  try {
    // ✅ Validate incoming body
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }
  const { firstname, lastname, mobile, password } = result.data;
   //console.log("Backend received:", req.body);  // <-- add this line


  
    // Optional: You may recheck if user already exists (safety)
    const existingUser = await User.findOne({ where: { mobile } });
    if (existingUser) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await User.create({
      first_name:firstname,
      last_name:lastname,
      mobile,
      password: hashedPassword,
    });
    console.log("Created user:", newUser.toJSON());

    return res.status(200).json({ message: 'User created successfully', userId: newUser.id });
  } catch (err) {
    console.error('Error in signup:', err);
    res.status(500).json({ message: 'Signup error', error: err.message });
  }
};
// ✅ New: Sign In with mobile and password
exports.login = async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ message: 'Mobile and password are required' });
  }

  try {
    const user = await User.findOne({ where: { mobile } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
      // Store user info in session
    req.session.userId = user.id;
    console.log("userid added to session" + req.session.userId);
    req.session.firstname = user.first_name;
    req.session.lastname = user.last_name;
    req.session.mobile = user.mobile;
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ message: 'Login error', error: err.message });
  }
};
exports.resetPassword = async (req, res) => {
  const { mobile, newPassword } = req.body;

  if (!mobile || !newPassword) {
    return res.status(400).json({ message: 'Mobile and new password are required' });
  }

  try {
    const user = await User.findOne({ where: { mobile } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error resetting password:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.checkMobileForReset = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }

  try {
    const user = await User.findOne({ where: { mobile } });
    if (!user) {
      return res.status(404).json({ message: 'Mobile number not registered' });
    }

    return res.status(200).json({ message: 'Mobile exists for password reset' });
  } catch (err) {
    console.error('Forgot checkMobile error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ New: Logout
exports.logout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Error during logout' });
      } else {
        return res.status(200).json({ message: 'Logout successful' });
      }
    });
  } else {
    return res.status(200).json({ message: 'No session to logout' });
  }
};
