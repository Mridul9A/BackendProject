module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
    const token = authHeader.split(' ')[1];
    // Validate JWT token here
    next();
  };
  