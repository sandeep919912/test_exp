import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Popup from "./Popup";
// import { load } from "@cashfreepayments/cashfree-js";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [token, setToken] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const checkLogin = () => {
    const isToken = localStorage.getItem("token");
    if (isToken) {
      setToken(true);
    } else {
      navigate("/login");
    }
  };

  const handlePremium = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/payment/create-order`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;

      // console.log(data);

      const cashfree = window.Cashfree({
        mode: "sandbox",
      });

      const result = await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal",
      });

      const verifyResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/payment/verify?orderId=${data.orderId}`,
      );

      if (verifyResponse.data.status === "SUCCESSFUL") {
        alert("Payment successful! You are now a premium user.");
      }

      console.log("Payment verification result:", verifyResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  //check premium

  const [premium, setPremium] = useState(false);

  const checkPremium = () => {
    const isPremium = localStorage.getItem("isPremium");

    if (isPremium) {
      setPremium(true);
    }
  };

  useEffect(() => {
    checkLogin();
    checkPremium();
  }, []);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/expense/report`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);

      
      window.open(res.data, "_blank");
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex justify-between shadow-md py-3 px-10 w-full">
        <h3 className="font-semibold text-2xl text-gray-700">
          Expense Tracker
        </h3>
        <div>
          {token ? (
            premium ? (
              <div className="flex gap-5 items-center">
                <button
                  onClick={handleDownload}
                  disabled={loading}
                  className="w-40 h-9 flex items-center justify-center bg-blue-700 hover:bg-blue-800 transition duration-150 rounded text-white font-semibold cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <h3>Download EP Report</h3>
                  )}
                </button>
                <button
                  onClick={() => setShowPopup(true)}
                  className="w-27.5 text-center py-1 bg-green-700 hover:bg-green-800 transition duration-150 rounded text-white font-semibold cursor-pointer"
                >
                  LeaderBoard
                </button>

                <h3 className=" text-center underline rounded text-amber-500 font-semibold">
                  You Are A Premium Member
                </h3>
              </div>
            ) : (
              <button
                onClick={handlePremium}
                className="w-27.5 text-center py-1 bg-yellow-700 hover:bg-yellow-800 transition duration-150 rounded text-white font-semibold cursor-pointer"
              >
                Get Premium
              </button>
            )
          ) : (
            <Link
              to="/login"
              className="w-25 text-center py-1 bg-blue-600 hover:bg-blue-700 transition duration-150 rounded text-white font-semibold cursor-pointer"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {showPopup ? (
        <div className="absolute w-full bg-black/30 backdrop-blur-sm h-2/2  z-10  flex justify-center items-center">
          <Popup setShowPopup={setShowPopup} />
        </div>
      ) : null}
    </div>
  );
};
