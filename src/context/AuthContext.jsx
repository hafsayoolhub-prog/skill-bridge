import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  user: null,
  handleLogin: () => {},
  handleLogout: () => {},
  enrolledCourses: [],
  wishlist: [],
  tasks: [],
  enrollCourse: () => {},
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  userStats: {
    currentStreak: 0,
    tasksCompleted: 0,
    certificatesEarned: 0,
  },
  addTask: () => {},
  toggleTask: () => {},
  deleteTask: () => {},
  addCertificate: () => {},
  calculateStreak: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [userStats, setUserStats] = useState({
    currentStreak: 0,
    tasksCompleted: 0,
    certificatesEarned: 0,
  });
  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedEnrolled = localStorage.getItem("enrolledCourses");
    const savedWishlist = localStorage.getItem("wishlist");
    const savedTasks = localStorage.getItem("tasks");
    const savedStats = localStorage.getItem("userStats");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedEnrolled) setEnrolledCourses(JSON.parse(savedEnrolled));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedStats) setUserStats(JSON.parse(savedStats));

    // Load tasks from localStorage or fetch from JSON
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Fetch initial tasks from JSON
      fetch("/tasks.json")
        .then((res) => res.json())
        .then((data) => {
          setTasks(data);
          localStorage.setItem("tasks", JSON.stringify(data));
        })
        .catch((error) => console.error("Error loading initial tasks:", error));
    }
  }, []);

  const calculateStreak = (currentUser = user) => {
    // Use the passed-in user, or fall back to the state user
    if (!currentUser || !currentUser.loginTime) return 0;

    const lastLogin = new Date(currentUser.loginTime);
    const today = new Date();

    lastLogin.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today - lastLogin;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return userStats.currentStreak;
    } else if (diffDays === 0) {
      // If they already logged in today, keep the current streak
      return userStats.currentStreak > 0 ? userStats.currentStreak - 1 : 0;
    } else {
      return 0;
    }
  };

  const handleLogin = (name, email) => {
    const userData = { name, email, loginTime: new Date().toISOString() };
    const newStreakBase = calculateStreak(userData);

    setUser(userData);
    setUserStats((prev) => {
      const updatedStats = {
        ...prev,
        currentStreak: Math.min(newStreakBase + 1, 30),
        tasksCompleted: prev.tasksCompleted + 1,
      };
      // Save to localStorage immediately to prevent loss on refresh
      localStorage.setItem("userStats", JSON.stringify(updatedStats));
      return updatedStats;
    });

    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const enrollCourse = (courseId) => {
    setEnrolledCourses((prev) => {
      if (!prev.includes(courseId)) {
        const updated = [...prev, courseId];
        localStorage.setItem("enrolledCourses", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };
  const addCertificate = () => {
    setUserStats((prev) => {
      const updated = {
        ...prev,
        certificatesEarned: prev.certificatesEarned + 1,
      };
      localStorage.setItem("userStats", JSON.stringify(updated));
      return updated;
    });
  };

  const addToWishlist = (courseId) => {
    setWishlist((prev) => {
      if (!prev.includes(courseId)) {
        const updated = [...prev, courseId];
        localStorage.setItem("wishlist", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const removeFromWishlist = (courseId) => {
    setWishlist((prev) => {
      const updated = prev.filter((id) => id !== courseId);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(), 
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => {
      const updated = [...prev, newTask];
      localStorage.setItem("tasks", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleTask = (taskId) => {
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      localStorage.setItem("tasks", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => {
      const updated = prev.filter((task) => task.id !== taskId);
      localStorage.setItem("tasks", JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    handleLogin,
    handleLogout,
    enrolledCourses,
    wishlist,
    tasks,
    enrollCourse,
    addToWishlist,
    removeFromWishlist,
    addTask,
    toggleTask,
    deleteTask,
    userStats,
    addCertificate,
    calculateStreak,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
