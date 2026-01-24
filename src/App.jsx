import { useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import TasksPage from "./pages/TasksPage";
import CourseDetailPage from "./pages/CourseDetailPage";

function ProtectedRoute({ element }) {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-linear-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-primary-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-700 text-lg font-medium">
            Loading SkillBridge...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={<ProtectedRoute element={<DashboardPage />} />}
        />
        <Route
          path="/courses"
          element={<ProtectedRoute element={<CoursesPage />} />}
        />
        <Route
          path="/courses/:id"
          element={<ProtectedRoute element={<CourseDetailPage />} />}
        />
        <Route
          path="/tasks"
          element={<ProtectedRoute element={<TasksPage />} />}
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
