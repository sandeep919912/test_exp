import React, { useEffect, useState } from "react";
import axios from "axios"
import {Link} from "react-router-dom"

const Signup = () => {

  const [name , setName] = useState("")
  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")

  const data = {
    name,
    email,
    password
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:3000/api/user/signup" , data)

      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-950 tracking-tight">
            Create Account
          </h1>

          <p className="text-slate-400 mt-2">
            Join us and get started today
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

          <form className="space-y-5" onSubmit={handleSubmit}>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">
                Full Name
              </label>

              <input
                onChange={(e)=>setName(e.target.value)}
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-slate-600 text-gray-500 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

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
              <label className="block text-sm font-medium text-slate-900 mb-2">
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
              Create Account
            </button>

          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link to={"/login"} className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium">
              Login
            </Link>
          </p>

        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          By creating an account, you agree to our Terms & Privacy Policy.
        </p>

      </div>
    </div>
  );
};

export default Signup;