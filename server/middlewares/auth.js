const jwt = require("jsonwebtoken");

const authMiddleware = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      return {
        _id: decoded.id,
        role: decoded.role,
        email: decoded.email
      };
    } catch (error) {
      return null;
    }
  }
  return null;
};

module.exports = authMiddleware;
