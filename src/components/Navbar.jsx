import logo from "../../public/logo.png";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center ">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="SkillBridge Logo" className="w-24 h-auto" />
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-black transition font-medium "
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="text-gray-600 hover:text-black transition font-medium cursor-pointer"
            >
              Courses
            </button>
            <button
              onClick={() => navigate("/tasks")}
              className="text-gray-600 hover:text-black transition font-medium cursor-pointer"
            >
              Tasks
            </button>

            <div className="flex items-center gap-6 pl-8 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-black font-medium ">{user?.name}</p>
                <p className="text-gray-500 text-xs">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition cursor-pointer"
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
