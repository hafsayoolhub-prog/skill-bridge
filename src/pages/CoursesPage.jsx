import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const categories = ["all", "web", "mobile", "ai", "data"];

  useEffect(() => {
    // Fetch courses from JSON file
    fetch("/courses.json")
      .then((response) => response.json())
      .then((data) => {
        // Simulate network delay
        setTimeout(() => {
          setCourses(data);
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []);

  const filteredCourses =
    selectedCategory === "all"
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  return (
    <main className="min-h-screen py-8 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-black mb-2">
            Explore Courses
          </h1>
          <p className="text-gray-600 text-lg">
            Learn new skills from industry experts
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading courses...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/courses/${course.id}`)}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary-500/30 transition cursor-pointer hover:shadow-2xl hover:shadow-primary-500/10 transform hover:-translate-y-1 animate-fade-in shadow-sm"
              >
                <div className="relative h-40 bg-linear-to-br from-primary-600 to-primary-700 overflow-hidden">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-95"
                  />
                  <div className="absolute top-3 right-3 bg-primary-600/80 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {course.level}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-black mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {course.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm text-gray-700">
                    <p>👨‍🏫 {course.instructor}</p>
                    <p>⏱️ {course.duration}</p>
                    <p>👥 {course.students} students</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500 font-bold">
                        {course.rating}
                      </span>
                      <span className="text-amber-400">★</span>
                    </div>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition">
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
