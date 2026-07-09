import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-red-50 border border-yellow-400 p-8 rounded-lg shadow-md text-center max-w-md w-full">
        {/* Error Icon */}
        <span className="text-6xl" role="img" aria-label="Error">
          😔
        </span>

        {/* Error Title */}
        <h1 className="text-4xl font-bold  mb-2 text-red-500 mt-8">Opps ...</h1>

        <h1 className="my-3 text-xl font-semibold text-gray-500  md:text-xl">
          Something Went Wrong!
        </h1>

        {/* Error Message */}
        <p className="text-gray-600 mb-6 ">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col items-center justify-center gap-y-4 sm:flex-row sm:gap-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex  items-center justify-center  w-1/2 px-5 py-1 text-md text text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto   hover:bg-gray-100 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:rotate-180 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>

            <span className="p-1 font-semibold">Go back</span>
          </button>

          {/* Go to Home Button */}
          <a
            href="/" // Replace with your home route
            className="inline-block bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-500 transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}
