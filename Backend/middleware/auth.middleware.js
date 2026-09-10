import jwt from "jsonwebtoken"

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("authHeader............." , authHeader)

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

    console.log("decooooooooodeedddd" , decoded)
    req.user = decoded;

    next();

  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authenticateUser;