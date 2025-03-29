import React from "react";

const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`spinner ${className || ""}`}>
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
  );
};

export default LoadingSpinner;