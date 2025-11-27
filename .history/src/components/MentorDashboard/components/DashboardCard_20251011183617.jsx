import React from "react";

const DashboardCard = ({ icon, title, description, onClick, isDarkMode }) => (
  <div
    onClick={onClick}
    className={`p-10 m-2 rounded-xl shadow-md max-w-sm w-11/12 text-left transition duration-200
      ${
        isDarkMode
          ? "bg-gray-800 text-white hover:shadow-lg hover:bg-gray-700"
          : "bg-white text-gray-900 hover:shadow-lg hover:bg-gray-100"
      }`}
    style={{ cursor: onClick ? "pointer" : "default" }}
  >
    <h3 className="mb-2 text-xl font-semibold flex items-center gap-2">
      {icon} {title}
    </h3>
    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
      {description}
    </p>
  </div>
);

export default DashboardCard;
