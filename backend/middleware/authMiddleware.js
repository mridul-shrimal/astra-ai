const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.substring(7);

    console.log("🔐 AUTH HEADER RECEIVED");
    console.log("🔑 TOKEN LENGTH:", token.length);

    const response = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/user`,
      {
        method: "GET",
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const user = await response.json();

    console.log("👤 SUPABASE RESPONSE STATUS:", response.status);
    console.log("👤 SUPABASE USER:", user?.id || null);

    if (!response.ok || !user?.id) {
      console.log("❌ SUPABASE USER ERROR:", user);

      return res.status(401).json({
        success: false,
        message: "Invalid or expired session.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);

    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

module.exports = requireAuth;