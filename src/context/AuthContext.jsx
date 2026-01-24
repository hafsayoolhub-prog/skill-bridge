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
    // 1. If no user or no previous login, start at 0
    if (!currentUser || !currentUser.loginTime) return 0;

    const lastLogin = new Date(currentUser.loginTime);
    const today = new Date();

    // Reset times to compare only dates
    lastLogin.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today - lastLogin;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // LOGGED IN TODAY: Return the streak as is (don't add, don't subtract)
      // We subtract 1 here because handleLogin will add 1 back immediately
      return userStats.currentStreak > 0 ? userStats.currentStreak - 1 : 0;
    } else if (diffDays === 1) {
      // LOGGED IN YESTERDAY: Perfect! Return current streak to be incremented
      return userStats.currentStreak;
    } else {
      // MISSED DAYS: Streak reset
      return 0;
    }
  };

  const handleLogin = (name, email) => {
    // 1. Get the existing user from storage to see their PREVIOUS login time
    const savedUser = JSON.parse(localStorage.getItem("user"));

    // 2. Calculate the base streak based on the OLD login time
    const newStreakBase = calculateStreak(savedUser);

    // 3. Update user with NEW login time
    const userData = { name, email, loginTime: new Date().toISOString() };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // 4. Update stats
    setUserStats((prev) => {
      const updatedStats = {
        ...prev,
        // If it's a new day, this becomes Base + 1.
        // If it's the same day, (Streak - 1) + 1 = Current Streak (stays same).
        currentStreak: Math.min(newStreakBase + 1, 30),
      };
      localStorage.setItem("userStats", JSON.stringify(updatedStats));
      return updatedStats;
    });
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
        task.id === taskId ? { ...task, completed: !task.completed } : task,
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
