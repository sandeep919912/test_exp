import e from "express"
import Expense from "../models/expense.model.js"
import User from "../models/user.model.js"

const addExpense = async (req , res) => {
    try {
        const userId = req.user.userId

        const {title , category , amount} = req.body

        console.log("body data here " , title , category , amount)

        await Expense.create({
            title,
            category,
            amount,
            userId
        })

        res.status(201).json({message:"Expense added successfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
}

const getExpense = async (req , res) => {
    try {
        const expense = await Expense.findAll()

        res.status(200).json(expense)

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
}

const deleteExpense = async (req , res) => {
    try {
        const {id} = req.params;

        const deletedExpense = await Expense.destroy({
            where:{
                id
            }
        })

        res.status(200).json({message:`Expense with ${id} has been deleted`})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
}


const getExpensesByUser = async (req , res) => {
  try {
    const userId = req.user.userId
    
    const userWithExpense = await User.findOne({
      attributes:["id" , "name" , "email"],
      where: {
        id: userId,
      },
      include: {
        model: Expense
      }
    });

    if(!userWithExpense) res.status(404).json({message:"user not found"})

    res.status(200).json(userWithExpense)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
    
  }
}
export { addExpense , getExpense , deleteExpense , getExpensesByUser}