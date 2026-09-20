import React, { useEffect, useState } from "react";
import axios from "axios";
import AiPopup from "./AiPopup";

const MainContent = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [aiPopup, setAiPopup] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(2);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const data = {
    amount,
    title: description,
    category,
  };

  //Add Expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log(data);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/expense/add-expense`,
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
        `${import.meta.env.VITE_BACKEND_URL}/expense/get-user-expenses`,
        {
          params: {
            currPage,
            pageLimit,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.setItem("isPremium", true);

      setExpenses(res.data.userWithExpense.Expenses);
      setTotalPages(res.data.totalPages);
      setTotalExpenses(res.data.userWithExpense.totalExpenses);
    } catch (error) {
      console.log(error);
    }
  };

  //using useEffect for rendering
  useEffect(() => {
    getAllExpenses();
  }, [currPage, pageLimit]);

  // delete expense
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/expense/delete-expense/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (expenses.length === 1 && currPage > 1) {
        setCurrPage((prev) => prev - 1);
      } else {
        getAllExpenses();
      }
    } catch (error) {
      console.log(error);
    }
  };


  //suggestion section
  const suggestCategory = async (description) => {
    setLoading(true);
    if (!description.trim()) {
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/gemini/suggestion`,
        {
          prompt: description,
        },
      );

      setCategory(res.data.category);
    } catch (error) {
      console.log("Category suggestion error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!description.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      suggestCategory(description);
    }, 700);

    return () => clearTimeout(timer);
  }, [description]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/*SUMMARY CARDS*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        {/* TOTAL EXPENSE */}
        <div className="relative overflow-hidden bg-blue-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />

          <div className="relative flex justify-between items-start">
            <div>
              <p className="text-sm text-blue-100">Total Expense</p>

              <h2 className="text-3xl sm:text-4xl font-bold mt-3">
                ₹{totalExpenses}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
              ₹
            </div>
          </div>

          <div className="relative mt-6 pt-4 border-t border-white/20">
            <p className="text-xs text-blue-100">Your total spending</p>
          </div>
        </div>

        {/* EXPENSE COUNT */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Current Page</p>

              <h2 className="text-3xl font-bold text-slate-800 mt-3">
                {currPage}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              #
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-6">
            Page {currPage} of {totalPages}
          </p>
        </div>

        {/* TRACKING CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm sm:col-span-2 xl:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Expense Tracking</p>

              <h2 className="text-xl font-bold text-slate-800 mt-3">
                Stay organized
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
              ✓
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-5">
            Add, view and manage your expenses from one place.
          </p>
        </div>
      </div>

      {/*  MAIN CONTENT  */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/*  ADD EXPENSE  */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* HEADER */}
          <div className="px-5 sm:px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                +
              </div>

              <div>
                <h2 className="font-semibold text-slate-800">Add Expense</h2>

                <p className="text-xs text-slate-400 mt-1">
                  Create a new expense
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form
            className="p-5 sm:p-6 flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            {/* AMOUNT */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amount
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                  ₹
                </span>

                <input
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                  type="number"
                  placeholder="Enter amount"
                  className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>

              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="Enter description"
                className="w-full border border-slate-200 rounded-xl px-3 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category{" "}
                {loading ? (
                  <div className="flex gap-1">
                    <p>AI is thinking please wait</p>
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                  </div>
                ) : null}
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-3 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition cursor-pointer"
              >
                <option value="">Select category</option>

                <option value="Food">Food</option>

                <option value="Travel">Travel</option>

                <option value="Entertainment">Entertainment</option>

                <option value="Shopping">Shopping</option>

                <option value="Others">Others</option>
              </select>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition shadow-sm hover:shadow-md"
            >
              Add Expense
            </button>
          </form>
        </div>

        {/* ALL EXPENSES */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* TABLE HEADER */}
          <div className="p-5 sm:p-6 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Your Expenses
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Manage your recent expenses.
                </p>
              </div>

              {/* PAGE LIMIT */}
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl w-fit">
                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                  Show
                </span>

                <select
                  value={pageLimit}
                  onChange={(e) => {
                    setPageLimit(Number(e.target.value));
                    setCurrPage(1);
                  }}
                  className="bg-transparent outline-none font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="2">2</option>

                  <option value="5">5</option>

                  <option value="10">10</option>
                </select>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto h-[300.67px] overflow-auto">
            {expenses && expenses.length > 0 ? (
              <table className="w-full min-w-162.5">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      #
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      Title
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense, index) => {
                    return (
                      <tr
                        key={expense.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        <td className="px-5 py-4 text-sm text-slate-400">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4">
                          <div className="relative group max-w-50">
                            <div className="truncate cursor-pointer text-sm font-medium text-slate-700">
                              {expense.title}
                            </div>

                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs px-3 py-2 rounded-lg whitespace-normal w-max max-w-75 z-20">
                              {expense.title}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                            {expense.category}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-semibold text-slate-800">
                            ₹{expense.amount}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-xl text-slate-400 mb-3">
                  ₹
                </div>

                <h3 className="font-semibold text-slate-700">
                  No expenses found
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  Add your first expense.
                </p>
              </div>
            )}
          </div>

          {/* PAGINATION  */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-700">{currPage}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrPage(currPage - 1)}
                disabled={currPage === 1}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">
                {currPage}
              </span>

              <button
                onClick={() => {
                  setCurrPage(currPage + 1);
                }}
                disabled={currPage >= totalPages}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ASK AI */}
      <button
        onClick={() => setAiPopup(true)}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center font-bold text-sm transition hover:scale-105 z-40"
      >
        AI
      </button>

      {/*  AI POPUP  */}
      {aiPopup ? (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <AiPopup setShowAiPopup={setAiPopup} />
        </div>
      ) : null}
    </div>
  );
};

export default MainContent;
