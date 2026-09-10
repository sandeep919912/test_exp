import React, { useEffect, useState } from "react";
import axios from "axios";

const MainContent = () => {



  //post expenses

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const data = {
    amount,
    title: description,
    category,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log(data);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/expense/add-expense",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      getAllExpenses();
      alert(res.data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setAmount("");
      setDescription("");
      setCategory("");
    }
  };

  // get all expenses
  const [expenses, setExpenses] = useState([]);

  const getAllExpenses = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        "http://localhost:3000/api/expense/get-user-expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setExpenses(res.data.Expenses);
    } catch (error) {
      console.log(error);
    }
  };

  // Calculate total expense
  const totalExpense = expenses.reduce((acc, curr) => {
    return acc + Number(curr.amount);
  }, 0);

  useEffect(() => {
    getAllExpenses();
  }, []);

  //delete expense

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:3000/api/expense/delete-expense/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Remove deleted expense from UI
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5 flex justify-between ">
      {/* input boxes */}
      <div className="w-[45%] h-auto shadow-md rounded-lg p-4 shadow-sm">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Amount */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Amount
            </label>
            <input
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              type="number"
              placeholder="Enter amount"
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              placeholder="Enter description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Add Expense
          </button>
        </form>

        <div className="absolute left-4 bottom-4 flex w-[44%] h-[60px] rounded-xl bg-white shadow-lg border border-blue-100 p-2  justify-around items-center">
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">
            Your Total Expense
          </h3>

          <p className="text-3xl font-bold text-blue-600 mt-1">
            ₹{totalExpense}
          </p>
        </div>
      </div>

      {/* All Expenses */}

      <div className="w-[50%] shadow-md h-auto rounded p-4">
        <h1 className="font-semibold text-gray-600 border-b border-gray-500">
          Your All Expenses
        </h1>

        <div className="all-expenses mt-6">
          {expenses && expenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense, index) => {
                    return (
                      <tr
                        key={expense.id}
                        className="border-b hover:bg-blue-50 transition"
                      >
                        <td className="px-4 py-3">{index + 1}</td>

                        <td className="px-4 py-3 font-medium w-[20%]">
                          <div className="relative group max-w-[200px]">
                            <div className="truncate cursor-pointer">
                              {expense.title}
                            </div>

                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-3 py-2 rounded-md whitespace-normal w-max max-w-[350px] z-10">
                              {expense.title}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                            {expense.category}
                          </span>
                        </td>

                        <td className="px-4 py-3 font-semibold">
                          ₹{expense.amount}
                        </td>

                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded-md cursor-pointer hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No expenses found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
