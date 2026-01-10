"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    enrollCourse,
    addToWishlist,
    removeFromWishlist,
    enrolledCourses,
    wishlist,
  } = useContext(AuthContext);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch course details from JSON file
    fetch("/courses.json")
      .then((response) => response.json())
      .then((data) => {
        const courseData = data.find(
          (course) => course.id === Number.parseInt(id)
        );
        // Simulate network delay
        setTimeout(() => {
          setCourse(courseData);
          setLoading(false);
        }, 800);
      })
      .catch((error) => {
        console.error("Error fetching course:", error);
        setLoading(false);
      });
  }, [id]);
  useEffect(() => {
    if (course) {
      setIsEnrolled(enrolledCourses.includes(course.id));
      setIsInWishlist(wishlist.includes(course.id));
    }
  }, [enrolledCourses, wishlist, course]);

  const handleEnroll = () => {
    if (course) {
      if (isEnrolled) {
        setEnrollMessage("You are already enrolled in this course!");
        setTimeout(() => setEnrollMessage(""), 3000);
      } else {
        enrollCourse(course.id);
        setIsEnrolled(true);
        setEnrollMessage("Successfully enrolled in the course!");
        setTimeout(() => setEnrollMessage(""), 3000);
      }
    }
  };

  const handleWishlist = () => {
    if (course) {
      if (isInWishlist) {
        removeFromWishlist(course.id);
        setIsInWishlist(false);
        setWishlistMessage("Removed from wishlist");
        setTimeout(() => setWishlistMessage(""), 3000);
      } else {
        addToWishlist(course.id);
        setIsInWishlist(true);
        setWishlistMessage("Added to wishlist!");
        setTimeout(() => setWishlistMessage(""), 3000);
      }
    }
  };
  if (loading) {
    return (
      <main className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-gray-600">
          Loading course details...
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-gray-600">
          Course not found
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 lg:px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/courses")}
          className="text-primary-500 hover:text-primary-600 font-medium mb-6 flex items-center gap-2"
        >
          ← Back to Courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-80 object-cover rounded-t-2xl "
            />
            <div className="bg-white border border-gray-200 p-8 mb-8 shadow-sm">
              <h1 className="text-3xl font-bold text-black mb-4">
                {course.title}
              </h1>
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-700">
                <p>👨‍🏫 Instructor: {course.instructor}</p>
                <p>⭐ Rating: {course.rating}/5</p>
                <p>👥 {course.students} students</p>
                <p>⏱️ {course.duration}</p>
              </div>

              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">{course.description}</p>
                <p className="whitespace-pre-wrap text-sm pb-4">
                  {course.fullDescription}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-black mb-6">
                Course Modules
              </h2>
              <div className="space-y-3">
                {course.modules.map((module, idx) => (
                  <div
                    key={module.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-black font-medium">{module.title}</p>
                      <p className="text-gray-600 text-sm">
                        {module.lessons} lessons
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm">
              <p className="text-3xl font-bold text-black mb-4">
                ${course.price}
              </p>
              <button
                onClick={handleEnroll}
                disabled={isEnrolled}
                className={`w-full font-bold py-2 rounded-lg transition mb-4 ${
                  isEnrolled
                    ? "bg-green-600 hover:bg-green-700 text-white cursor-not-allowed"
                    : "bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white"
                }`}
              >
                {isEnrolled ? "Already Enrolled" : "Enroll Now"}
              </button>
              {enrollMessage && (
                <p
                  className={`text-sm mb-2 ${
                    enrollMessage.includes("already")
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {enrollMessage}
                </p>
              )}
              <button
                onClick={handleWishlist}
                className={`w-full font-bold py-2 rounded-lg transition ${
                  isInWishlist
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-black"
                }`}
              >
                {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
              {wishlistMessage && (
                <p
                  className={`text-sm mt-2 ${
                    wishlistMessage.includes("Removed")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {wishlistMessage}
                </p>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm mb-4 font-medium">
                  What you'll get:
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Video lessons
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Downloadable
                    resources
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Coding exercises
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Certificate of
                    completion
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> 30-day money back
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
