import React, { useEffect, useState } from "react";
import axios from "axios"
import {Link} from "react-router-dom"

const Login = () => {

  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")

  const data = {
    email,
    password
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:3000/api/user/login" , data)

      localStorage.setItem("token" , res.data.token)

    } catch (error) {
      console.log(error)
    }
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
                 onChange={(e)=>setEmail(e.target.value)}
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
                 onChange={(e)=>setPassword(e.target.value)}
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
            <Link to={"/signup"} className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium">
              signup
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;