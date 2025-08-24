import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAllCourses();
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await courseAPI.showAllCategory();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading courses..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Explore Courses</h1>
          <p className="text-gray-400 text-lg">
            Discover thousands of courses from top instructors around the world
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No courses found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CourseCard = ({ course }) => {
  return (
    <Link
      to={`/course/${course._id}`}
      className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-200 hover:shadow-xl"
    >
      <div className="aspect-video bg-gray-800 relative">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-500 text-sm">No thumbnail</span>
          </div>
        )}
        {course.status === 'Published' && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Published
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {course.courseName}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {course.description || 'No description available'}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {course.instructor && (
              <span className="text-gray-400 text-sm">
                {course.instructor.firstName} {course.instructor.lastName}
              </span>
            )}
          </div>
          <div className="text-white font-semibold">
            {course.price ? `$${course.price}` : 'Free'}
          </div>
        </div>
        {course.tags && course.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default Courses; 