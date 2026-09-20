import Expense from "../models/expense.model.js";
import User from "../models/user.model.js";
import sequelize from "../config/db.connection.js";
import AWS from "aws-sdk";
import Reports from "../models/reports.model.js";


//Add Expenses
const addExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.userId;

    const { title, category, amount } = req.body;

    await Expense.create(
      {
        title,
        category,
        amount,
        userId,
      },
      { transaction: transaction },
    );

    // Update user's totalExpenses
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.increment("totalExpenses", {
      by: amount,
      transaction: transaction,
    });

    await transaction.commit();
    res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    res.status(500).json({ message: "internal server error" });
  }
};

const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findAll();

    res.status(200).json(expense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

//Delete Expense
const deleteExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Find the expense first
    const expense = await Expense.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    // Delete the expense
    await Expense.destroy(
      {
        where: {
          id,
          userId,
        },
      },
      { transaction: transaction },
    );

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.decrement("totalExpenses", {
      by: expense.amount,
      transaction: transaction,
    });

    transaction.commit();
    res.status(200).json({
      message: `Expense with ${id} has been deleted`,
    });
  } catch (error) {
    console.log(error);
    transaction.rollback();
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


//get user expenses with implemented pagination
const getExpensesByUser = async (req, res) => {
  try {
    const currPage = Number(req.query.currPage) || 1;
    const pageLimit = Number(req.query.pageLimit) || 10;

    const userId = req.user.userId;
    const offset = (currPage - 1) * pageLimit;

    const userWithExpense = await User.findOne({
      attributes: ["id", "name", "email", "totalExpenses" , "isPremium"],
      where: {
        id: userId,
      },
      include: {
        model: Expense,
        limit: pageLimit,
        offset: offset,
      },
    });

    const expenseCount = await Expense.count({
      where: {
        userId: req.user.userId,
      },
    });

    const totalPages = Math.ceil(expenseCount / pageLimit);

    if (!userWithExpense) res.status(404).json({ message: "user not found" });

    res.status(200).json({ userWithExpense, totalPages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

//Download Expense
const uploadToS3 = async (data, filename) => {
  const BUCKET_NAME = process.env.S3_BUCKET_NAME;
  const IAM_USER_KEY = process.env.AWS_ACCESS_KEY;
  const IAM_USER_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

  const s3Service = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET_KEY,
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL:"public-read",
    ContentType: "application/pdf"
  };

  const s3res = await s3Service.upload(params).promise();
  return s3res.Location
};

const downloadExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const AllExpenses = await User.findOne({
      attributes: [],
      where: {
        id: userId,
      },
      include: {
        model: Expense,
      },
    });

    const stringifiedExpense = JSON.stringify(AllExpenses);

    const filename = `expenses${userId}/${Date.now()}.txt`;
    const fileUrl = await uploadToS3(stringifiedExpense, filename);
    await Reports.create({
      userId,
      url:fileUrl
    })

    res.status(200).json(fileUrl);

    // const allExpense =
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export {
  addExpense,
  getExpense,
  deleteExpense,
  getExpensesByUser,
  downloadExpenses,
};