import React from "react";

const variantClasses = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-400 disabled:bg-blue-900 disabled:text-gray-400",
  secondary:
    "bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-500 disabled:bg-gray-800 disabled:text-gray-500",
  danger:
    "bg-red-600 text-white hover:bg-red-500 focus:ring-red-400 disabled:bg-red-900 disabled:text-gray-400",
  ghost:
    "bg-transparent text-gray-200 hover:text-white hover:bg-gray-800 focus:ring-gray-500 disabled:text-gray-500",
};

const sizeClasses = {
  md: "px-5 py-3 text-lg",
  sm: "px-4 py-2 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`rounded-xl font-semibold tracking-wide transition-colors duration-150 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default React.memo(Button);
