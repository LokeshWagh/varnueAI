const jwt = require('jsonwebtoken');

const authMiddleware = {
  requireAuth: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token required' });
    
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  },

  // Admin only
  requireAdmin: (req, res, next) => {
    authMiddleware.requireAuth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }
      next();
    });
  }
};

module.exports = authMiddleware;
