const jwt = require("jsonwebtoken");

const jwtMiddilware = (req, res, next) => {
  console.log("inside jwtMiddilware function");

  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Please provide a token" });
    }

    // Verify token and extract payload directly
    const jwtResponse = jwt.verify(token, process.env.jwt_secret);

    req.userId = jwtResponse.userId; // matches login token
    req.role = jwtResponse.role;     // your role name

    if (req.role !== "admin" && req.role !== "user") {
      return res.status(403).json({ success: false, message: "Access denied. Login Required." });
    }

    next();

  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired token, please login" });
  }
};

module.exports = jwtMiddilware;
