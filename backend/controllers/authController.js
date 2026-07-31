const supabase = require("../config/supabase");

// =============================
// SIGN UP
// =============================
const signup = async (req, res) => {
  try {
    const { email, password, full_name } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =============================
// LOGIN
// =============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Login Successful",
      data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  signup,
  login,
};