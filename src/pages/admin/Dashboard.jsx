import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { courseAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  UsersIcon, 
  BookOpenIcon, 
  AcademicCapIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalCategories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // In a real app, you'd have admin-specific APIs
      const [coursesResponse, categoriesResponse] = await Promise.all([
        courseAPI.getAllCourses(),
        courseAPI.showAllCategory()
      ]);
      
      const courses = coursesResponse.data.courses || [];
      const categories = categoriesResponse.data.categories || [];
      
      setStats({
        totalCourses: courses.length,
        totalStudents: courses.reduce((acc, course) => acc + (course.studentEnrolled?.length || 0), 0),
        totalInstructors: new Set(courses.map(course => course.instructor?._id)).size,
        totalCategories: categories.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.accountType !== 'Admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpenIcon,
      color: 'bg-blue-600'
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: UsersIcon,
      color: 'bg-green-600'
    },
    {
      title: 'Total Instructors',
      value: stats.totalInstructors,
      icon: AcademicCapIcon,
      color: 'bg-purple-600'
    },
    {
      title: 'Total Categories',
      value: stats.totalCategories,
      icon: ChartBarIcon,
      color: 'bg-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-gray-400 text-lg">
            Welcome back, {user.firstName}! Here's an overview of your platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <button className="w-full bg-white text-black py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Manage Courses
              </button>
              <button className="w-full bg-white text-black py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Manage Users
              </button>
              <button className="w-full bg-white text-black py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                View Analytics
              </button>
              <button className="w-full bg-white text-black py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                System Settings
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Database</span>
                <span className="text-green-400">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">API Server</span>
                <span className="text-green-400">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">File Storage</span>
                <span className="text-green-400">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Email Service</span>
                <span className="text-green-400">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 