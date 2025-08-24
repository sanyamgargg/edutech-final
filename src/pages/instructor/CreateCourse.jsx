import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { user, isInstructor } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    whatYouWillLearn: '',
    price: '',
    tags: [],
    instructions: '',
    category: '',
    status: 'Draft'
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (!isInstructor) {
      navigate('/');
      return;
    }
    fetchCategories();
  }, [isInstructor, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await courseAPI.showAllCategory();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.courseName.trim()) {
      toast.error('Course name is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Course description is required');
      return;
    }

    setLoading(true);

    try {
      const courseData = {
        ...formData,
        price: formData.price || '0'
      };

      const response = await courseAPI.createCourse(courseData);
      
      if (response.data.success) {
        toast.success('Course created successfully!');
        navigate('/my-courses');
      }
    } catch (error) {
      console.error('Course creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  if (!isInstructor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Create New Course</h1>
          <p className="text-gray-400">
            Share your knowledge and create an amazing learning experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="courseName" className="block text-sm font-medium text-gray-300 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Course Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="Describe what students will learn in this course"
                />
              </div>

              <div>
                <label htmlFor="whatYouWillLearn" className="block text-sm font-medium text-gray-300 mb-2">
                  What You'll Learn
                </label>
                <textarea
                  id="whatYouWillLearn"
                  name="whatYouWillLearn"
                  value={formData.whatYouWillLearn}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="List the key learning outcomes"
                />
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Course Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                  Price (USD)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="0.00"
                />
                <p className="text-gray-500 text-sm mt-1">Leave empty for free course</p>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-300 mb-2">
                Requirements/Instructions
              </label>
              <textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="What should students know before taking this course?"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Tags</h2>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-700 text-white"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-red-400"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Course Status */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Course Status</h2>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
              <p className="text-gray-500 text-sm mt-1">
                Draft courses are only visible to you. Published courses are available to students.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/my-courses')}
              className="px-6 py-3 border border-gray-600 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-white text-black rounded-md font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse; 