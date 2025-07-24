const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    // Simulate for dev if no token is sent
    if (process.env.NODE_ENV === 'development') {
      req.user = { id: '6874ef62815f6f2aff74ee74' };
      return next();
    }
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    console.log("Token:", token);
    console.log("Secret:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

export default verifyToken;
