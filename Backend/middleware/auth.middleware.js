import jwt from "jsonwebtoken"

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }
    
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token",
      token:"Invalid"
    });
  }
};

export default authenticateUser;