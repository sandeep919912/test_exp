import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Popup from "./Popup";
// import { load } from "@cashfreepayments/cashfree-js";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [token, setToken] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate()

  const checkLogin = () => {
    const isToken = localStorage.getItem("token");
    if (isToken) {
      setToken(true);
    }else{
      navigate("/login")
    }
  };

  const handlePremium = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/payment/create-order",
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

      // not working from here
      console.log("problem....");

      const verifyResponse = await axios.get(
        `http://localhost:3000/api/payment/verify?orderId=${data.orderId}`,
      );

      console.log("here i m");

      if (verifyResponse.data.status === "SUCCESSFUL") {
        alert("Payment successful! You are now a premium user.");
        localStorage.setItem("isPremium", "true");
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
    // console.log(isPremium);

    if (isPremium) {
      setPremium(true);
    }
  };

  useEffect(() => {
    checkLogin();
    checkPremium();
  }, []);


  // getAllExpences

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
                  onClick={() => setShowPopup(true)}
                  className="w-[110px] text-center py-1 bg-green-700 hover:bg-green-800 transition duration-150 rounded text-white font-semibold cursor-pointer"
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
                className="w-[110px] text-center py-1 bg-yellow-700 hover:bg-yellow-800 transition duration-150 rounded text-white font-semibold cursor-pointer"
              >
                Get Premium
              </button>
            )
          ) : (
            <Link
              to="/login"
              className="w-[100px] text-center py-1 bg-blue-600 hover:bg-blue-700 transition duration-150 rounded text-white font-semibold cursor-pointer"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {showPopup ? (
        <div className="absolute w-[100%] bg-black/30 backdrop-blur-sm h-2/2  z-10  flex justify-center items-center">
          <Popup setShowPopup={setShowPopup}/>
        </div>
      ) : null}
    </div>
  );
};
