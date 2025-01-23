import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 ">
      <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center pt-8 sm:justify-start sm:pt-0">
          <div className="px-4 text-lg text-gray-500 border-r border-gray-400 tracking-wider">
            401
          </div>
          <div className="ml-4 text-lg text-gray-500 uppercase tracking-wider">
            Unauthorized
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 text-center">
        <button
          onClick={handleBack}
          className="ml-4 text-sm text-gray-500 uppercase hover:underline tracking-wider ">
          Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
