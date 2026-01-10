import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { handleLogin, user } = useContext(AuthContext);
  const navigate = useNavigate();

   useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isFormValid = () => {
    return email && validateEmail(email) && password && password.length >= 6
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const name = email.split("@")[0]
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
      handleLogin(capitalizedName, email)
      setIsLoading(false)
    }, 1200)
  }

  const handleDemoLogin = () => {
    setIsLoading(true)
    setError("")

    setTimeout(() => {
      handleLogin("Demo User", "demo@skillbridge.com")
      setIsLoading(false)
    }, 1200)
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
  }

  const getEmailError = () => {
    if (!touched.email) return ""
    if (!email) return "Email is required"
    if (!validateEmail(email)) return "Please enter a valid email"
    return ""
  }

  const getPasswordError = () => {
    if (!touched.password) return ""
    if (!password) return "Password is required"
    if (password.length < 6) return "Password must be at least 6 characters"
    return ""
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow animate-fade-in">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-linear-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-2xl">SB</span>
            </div>
            <h1 className="text-3xl font-bold text-black mb-0.5">SkillBridge</h1>
            <p className="text-gray-600 text-sm">Learn, Manage, Succeed</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 mt-3"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-black font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Try Demo Account"}
          </button>

          <p className="text-gray-500 text-xs text-center mt-6">
            Demo credentials: Use any email and password (min 6 chars) to get
            started
          </p>
        </div>
      </div>
    </div>
  );
}
