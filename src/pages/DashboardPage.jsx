import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
export default function DashboardPage() {
  const { user, enrolledCourses, tasks, userStats, calculateStreak } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [enrolledCoursesList, setEnrolledCoursesList] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    // Fetch courses and user stats
    Promise.all([fetch("/courses.json").then((res) => res.json())])
      .then(([coursesData]) => {
        // Filter enrolled courses
        const enrolled = coursesData.filter((course) =>
          enrolledCourses.includes(course.id),
        );
        setEnrolledCoursesList(enrolled);

        // Filter recent tasks (upcoming and recent completed from context)
        const recentTasksFiltered = tasks
          .filter((task) =>
            // Convert everything to string to prevent "1" !== 1 mismatch
            enrolledCourses.map(String).includes(String(task.courseId)),
          )
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 5);

        setRecentTasks(recentTasksFiltered);

        // Calculate dynamic stats
        const completedTasks = tasks.filter(
          (task) => task.completed && enrolledCourses.includes(task.courseId),
        ).length;
        const totalTasks = tasks.filter((task) =>
          enrolledCourses.includes(task.courseId),
        ).length;
        const progress =
          totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const upcomingTasks = totalTasks - completedTasks;

        setStats({
          coursesEnrolled: enrolled.length,
          tasksCompleted: completedTasks,
          currentStreak: userStats.currentStreak,
          progress: progress,
          upcomingTasks: upcomingTasks,
          certificatesEarned: userStats.certificatesEarned,
        });

        setLoadingStats(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setLoadingStats(false);
      });
  }, [enrolledCourses, userStats, tasks]);

  if (loadingStats) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-black mb-2">
            Welcome back, <span className="text-primary-500">{user?.name}</span>
          </h1>
          <p className="text-gray-600">
            Continue your learning journey and manage your tasks
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[
            {
              label: "Courses Enrolled",
              value: stats?.coursesEnrolled,
              icon: "📚",
            },
            {
              label: "Tasks Completed",
              value: stats?.tasksCompleted,
              icon: "✓",
            },
            {
              label: "Current Streak",
              value: `${stats?.currentStreak} days`,
              icon: "🔥",
            },
            {
              label: "Certificates Earned",
              value: stats?.certificatesEarned,
              icon: "🏆",
            },
            {
              label: "Upcoming Tasks",
              value: stats?.upcomingTasks,
              icon: "📅",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-3 hover:border-primary-500/30 transition animate-fade-in shadow-sm"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className=" flex items-center justify-between ">
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <p className="text-2xl">{stat.icon}</p>
              </div>
              <p className="text-3xl font-bold text-black mb-2">
                {stat.value}
              </p>{" "}
            </div>
          ))}
        </div>

        {/* Enrolled Courses Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">
            Your Enrolled Courses
          </h2>
          {enrolledCoursesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCoursesList.map((course) => (
                <div
                  key={course.id}
                  className="bg-white border border-gray-200 rounded-xl  hover:border-primary-500/30 transition cursor-pointer shadow-sm"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-black mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      👨‍🏫 {course.instructor}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-500 text-sm">
                        ⭐ {course.rating}
                      </span>
                      <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                        View Course →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
              <p className="text-gray-600 text-lg mb-4">
                You haven't enrolled in any courses yet!
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>

        {/* Recent Tasks & CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-xl font-bold text-black mb-6">
                Recent Tasks
              </h2>
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center text-sm gap-4 p-2 bg-gray-50 rounded-lg transition"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-black"
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Due: {task.dueDate}
                      </p>
                    </div>
                    {task.completed && (
                      <span className="text-green-500 font-bold text-sm">
                        Done
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <button
              onClick={() => navigate("/courses")}
              className="w-full bg-linear-to-r from-primary-500 to-primary-600 hover:bg-linear-to-r hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-4 rounded-xl transition cursor-pointer"
            >
              Browse Courses
            </button>
            <button
              onClick={() => navigate("/tasks")}
              className="w-full bg-gray-200 hover:bg-gray-300 text-black font-bold py-3 px-4 rounded-xl transition"
            >
              Manage Tasks
            </button>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
              <p className="text-gray-600 text-sm mb-3">
                Your learning journey
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-linear-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                  style={{ width: `${stats?.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round(stats?.progress)}% to next level
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
