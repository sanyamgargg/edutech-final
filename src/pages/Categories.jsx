import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await courseAPI.showAllCategory();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading categories..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Course Categories</h1>
          <p className="text-gray-400 text-lg">
            Explore courses by category and find what interests you most
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No categories available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/category/${category._id}`}
      className="bg-gray-900 rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-200 hover:shadow-xl"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpenIcon className="h-8 w-8 text-black" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">
          {category.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          {category.description || 'Explore courses in this category'}
        </p>
        <div className="text-white font-semibold">
          {category.courses?.length || 0} courses
        </div>
      </div>
    </Link>
  );
};

export default Categories; 