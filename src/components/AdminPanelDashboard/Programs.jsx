import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
export default function Programs() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      if (image) data.append("image", image);

      const res = await axios.post("http://localhost:5000/api/courses", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Course added successfully!");
      setFormData({ title: "", description: ""});
      setImage(null);
      setPreview(null);
      console.log("Saved course:", res.data);
    } catch (error) {
      console.error("Error adding course:", error);
      setMessage("❌ Failed to add course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          console.error("Failed to fetch courses:", res.statusText);
          setCourses([]);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error("Invalid data format:", data);
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  const removeCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) 
      return;
    try{
      const res = await fetch(`http://localhost:5000/api/courses/${id}`,
        {method: "DELETE"}
      );
      const data=await res.json();
      if(data.success){
        setCourses((prev) => prev.filter((c) => c.id !== id));
      }else{
        alert(data.message || "Failed to delete course");
      }
    }catch(err){
      console.error(err);
      alert("Error deleting course");
      }
    }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center items-center px-6">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl flex flex-col justify-center items-center p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Add New Course
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Cybersecurity"
              required
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description about the course..."
              rows="4"
              required
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Add Course"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full max-w-6xl mx-auto px-6">
        <h1 className="col-span-full text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Courses</h1>
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden"
          >
            {course.image_path && (
              <img
                src={`http://localhost:5000${course.image_path}`}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4"> {course.description}</p>
              <button
                onClick={() => removeCourse(course.id)}
               className="text-xl flex items-center border border-gray-100 px-2 py-1 bg-red-600 text-white rounded-full">
                <FaTrash className="size-4 pr-1"/>Delete
              </button>
            </div>
          </div>
        ))}
        {
          courses.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300 col-span-full text-center">
              No courses available. Please add a course.
            </p>
          )
        }
      </div>*/}
</div>
      
  );
}
