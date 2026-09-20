import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const Popup = ({setShowPopup}) => {
  //getAllexpences

  const [leaderboard, setLeaderboard] = useState([]);
  const getAllExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/leaderboard/get-leaderboard`,
      );

      console.log(response.data);
      setLeaderboard(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllExpenses();
  }, []);
  

  return (
    <div className="w-full fixed relative max-w-md mx-auto h-[500px] overflow-auto bg-white rounded-xl shadow-md p-5">
       <button
      onClick={() => setShowPopup(false)}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
    >
      ❌
    </button>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        🏆 Leaderboard
      </h2>

      <div className="space-y-2">
        {leaderboard.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-500 w-6">
                #{index + 1}
              </span>

              <div>
                <p className="font-semibold text-gray-800">
                  {user.name}
                </p>
              </div>
            </div>

            <p className="font-semibold text-gray-700">
              ₹{Number(user.totalExpenses).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Popup;
