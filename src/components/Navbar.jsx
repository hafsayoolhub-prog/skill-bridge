"use client";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SB</span>
            </div>
            <h1 className="text-xl font-bold text-black hidden sm:block">
              SkillBridge
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-black transition font-medium text-sm "
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="text-gray-600 hover:text-black transition font-medium text-sm"
            >
              Courses
            </button>
            <button
              onClick={() => navigate("/tasks")}
              className="text-gray-600 hover:text-black transition font-medium text-sm"
            >
              Tasks
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-black font-medium text-sm">{user?.name}</p>
                <p className="text-gray-500 text-xs">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
