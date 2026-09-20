import React, { useEffect, useState } from "react";
import { X, Sparkles, Send } from "lucide-react";
import axios from "axios";

const AiPopup = ({ setShowAiPopup }) => {

    const [prompt , setPrompt] = useState("")
    const [loading , setLoading] = useState(false)

    const [response , setResponse] = useState("")
    const handleSend = async () => {
        try {
            setLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/gemini/ask`, {prompt})
            setResponse(res.data)
        } catch (error) {
            alert(error.message)
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }


  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Sparkles className="text-blue-600" size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-800">
                AI Expense Assistant
              </h2>

              <p className="text-xs text-gray-500">
                Ask anything about your expenses
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={() => setShowAiPopup(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat area */}
        <div className="h-[350px] p-5 overflow-y-auto bg-gray-50">


          {/* Example user message */}
          <div className="flex justify-end mt-5">
            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[75%]">
              <p className="text-sm">
                {prompt}
              </p>
            </div>
          </div>

          {/* AI message */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-blue-600" />
            </div>

            <div className="bg-white shadow-sm border rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
              <p className="text-sm text-gray-700">
               {loading ? "thinking...." : <p>{response}</p>}
              </p>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-2">

            <input
                onChange={(e)=> setPrompt(e.target.value)}
              type="text"
              placeholder="Ask about your expenses..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            />

            <button
            onClick={handleSend}
              className="w-11 h-11 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
            >
              {loading ? (<div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>) : <Send size={18} />}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AiPopup;