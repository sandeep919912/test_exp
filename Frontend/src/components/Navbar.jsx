import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import { load } from "@cashfreepayments/cashfree-js";

export const Navbar = () => {
  let token = "";
  const handlePremium = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log(token);
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

      console.log(data);

      const cashfree = Cashfree({
        mode: "sandbox",
      });

      const result = await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal",
      });

      console.log("Checkout result:", result);

      const verifyResponse = await axios.get(
        `http://localhost:3000/api/payment/verify?orderId=${data.orderId}`,
      );

      console.log(verifyResponse)
      
      if (verifyResponse.data.status === "SUCCESSFUL") {
        alert("Payment successful! You are now a premium user.");

        localStorage.setItem("isPremium", "true");
      }

      console.log("Payment verification result:", verifyResponse.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    token = localStorage.getItem("token");
  }, [token]);

  return (
    <div className="flex w-full">
      <div className="flex justify-between shadow-md p-3 w-full">
        <h3 className="font-semibold text-2xl text-gray-700">
          Expense Tracker
        </h3>
        {token ? (
          <Link
            to={"/login"}
            className="w-[100px] text-center py-1 bg-blue-600 hover:bg-blue-700 transition duration-150 rounded text-white font-semibold cursor-pointer"
          >
            login
          </Link>
        ) : (
          <button
            onClick={handlePremium}
            className="w-[110px] text-center py-1 bg-yellow-700 hover:bg-yellow-800 transition duration-150 rounded text-white font-semibold cursor-pointer"
          >
            Get Premium
          </button>
        )}
      </div>
    </div>
  );
};
