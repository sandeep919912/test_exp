import User from "../models/user.model.js";
import Expense from "../models/expense.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(name, email, password);

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashPassword,
    });

    res.status(201).json({ message: "user signup successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    

    const isPassMatch = await bcrypt.compare(password, user.password);

    if (!isPassMatch)
      return res.status(401).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({ message: "login successfull", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export { signUp, login };
