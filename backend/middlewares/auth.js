import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify signature
    req.userId = decoded.userId; // attach user info
    next();
  } catch (error) {
    console.log(error)
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
