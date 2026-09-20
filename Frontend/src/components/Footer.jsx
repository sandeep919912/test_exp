import axios from "axios";
import React, { useState } from "react";

const Footer = () => {
  const [downloads, setDownloads] = useState([]);
  const [showDownloads, setShowDownloads] = useState(false);

  const handleGetDownloads = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/reports/downloads`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(res.data);
      setDownloads(res.data);
      setShowDownloads(!showDownloads);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-5 py-6">
      {/* Download History Button */}
      <button
        onClick={handleGetDownloads}
        className="group flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-all duration-200"
      >
        <span className="text-lg">↓</span>

        <span className="group-hover:underline">Download History</span>
      </button>

      {/* Download History Panel */}
      {showDownloads && (
        <div className="mt-4 w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                Download History
              </h3>

              <p className="text-xs text-gray-500">
                Your generated expense reports
              </p>
            </div>

            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-600">
              {downloads.length} Files
            </span>
          </div>

          {/* Files */}
          <div className="p-3">
            {downloads.length > 0 ? (
              <div className="flex flex-col gap-2">
                {downloads.map((items, index) => {
                  const fileName = items.url.split("/").pop();

                  return (
                    <a
                      key={index}
                      href={items.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-3 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                    >
                      {/* File information */}
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          📄
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-700">
                            {fileName}
                          </p>

                          <p className="text-xs text-gray-400">
                            Expense Report
                          </p>
                        </div>
                      </div>

                      {/* Download icon */}
                      <div className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                        ↓
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                  📂
                </div>

                <p className="text-sm font-semibold text-gray-700">
                  No downloads yet
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Your generated reports will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
