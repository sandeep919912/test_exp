import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const data = {
    email,
    password,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/login",
        data,
      );

      localStorage.setItem("token", res.data.token);
      alert("login successfull");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetPassword = async (e)=> {
    e.preventDefault()
    const res = await axios.post("http://localhost:3000/api/reset-pass/sendmail" , {email})

    alert(res.data.message)
  }

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-950 tracking-tight">
            Login
          </h1>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">
                Email Address
              </label>

              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-slate-600 text-gray-500 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">
                Password
              </label>

              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Create a strong password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-slate-600 text-gray-500 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30"
            >
              login
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            new user ?{" "}
            <Link
              to={"/signup"}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
            >
              signup
            </Link>
          </p>

          <p
            onClick={() => setOpen(true)}
            className="underline hover:text-blue-600 cursor-pointer"
          >
            forgot password ?
          </p>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Reset Password
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter your email and we'll send you a password reset link.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                Send Reset Link
              </button>
            </form>

            {/* Close */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-sm text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
