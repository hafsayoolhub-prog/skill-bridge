"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function TasksPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useContext(AuthContext);
  const [filter, setFilter] = useState("all");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tasks are loaded from context, just set loading to false after a delay
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle,
        priority: "medium",
        dueDate: new Date().toISOString().split("T")[0],
        courseId: 1, // Default to first course, could be made dynamic
        estimatedTime: 60, // Default 1 hour
      });
      setNewTaskTitle("");
    }
  };

  const handleToggleTask = (id) => {
    toggleTask(id);
  };

  const handleDeleteTask = (id) => {
    deleteTask(id);
  };

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t[filter]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  return (
    <main className="min-h-screen py-8 px-4 lg:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-black mb-2">Task Manager</h1>
          <p className="text-gray-600 text-lg">
            Organize and track your learning goals
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Tasks", value: stats.total, icon: "📋" },
            { label: "Completed", value: stats.completed, icon: "✓" },
            { label: "Pending", value: stats.pending, icon: "⏳" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg py-3 px-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-2xl">{stat.icon}</p>
                <p className="text-2xl font-bold text-black">{stat.value}</p>
              </div>
              <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
            />
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Add Task
            </button>
          </div>
        </form>

        {/* Filter */}
        <div className="flex gap-3 mb-6">
          {["all", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                filter === f
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="text-center text-gray-600">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p className="text-lg">No tasks yet</p>
            <p className="text-sm">Create your first task to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition animate-fade-in shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  className="w-5 h-5 rounded cursor-pointer accent-primary-500"
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
                  <div className="flex items-center gap-3 text-xs text-gray-500 ">
                    <span>📅 {task.dueDate}</span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                    {/* <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {task.category}
                    </span> */}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-600 font-bold text-lg transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
