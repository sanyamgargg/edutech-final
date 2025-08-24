import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to EduTech
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Your learning platform is working! This is a test page to verify the frontend is rendering correctly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/courses"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Backend Status</h2>
          <p className="text-gray-400">Check if the backend is connected:</p>
          <div className="mt-4">
            <a 
              href="http://localhost:4000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              http://localhost:4000
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;