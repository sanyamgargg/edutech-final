import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  StarIcon, 
  UserIcon, 
  ClockIcon, 
  BookOpenIcon,
  PlayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchCourseDetails();
    fetchReviews();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await courseAPI.getCourseDetails(courseId);
      setCourse(response.data.course);
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const [reviewsResponse, avgRatingResponse] = await Promise.all([
        courseAPI.getAllRating(courseId),
        courseAPI.averageRating(courseId)
      ]);
      setReviews(reviewsResponse.data.ratings || []);
      setAverageRating(avgRatingResponse.data.averageRating || 0);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleEnrollment = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isStudent) {
      toast.error('Only students can enroll in courses');
      return;
    }

    setEnrolling(true);
    try {
      const response = await paymentAPI.capturePayments(courseId);
      
      if (response.data.success) {
        if (course.price === 0) {
          toast.success('Successfully enrolled in the free course!');
        } else {
          toast.success('Payment successful! You are now enrolled.');
        }
        // Refresh course details to show updated enrollment status
        fetchCourseDetails();
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      if (course.price === 0) {
        toast.error('Failed to enroll in the course');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!rating || !review.trim()) {
      toast.error('Please provide both rating and review');
      return;
    }

    try {
      await courseAPI.createRating({
        courseId: courseId,
        rating: rating,
        review: review
      });
      toast.success('Review submitted successfully!');
      setRating(0);
      setReview('');
      fetchReviews();
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading course details..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Course not found</h2>
          <p className="text-gray-400">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-4">{course.courseName}</h1>
            <p className="text-gray-400 text-lg mb-6">{course.description}</p>
            
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">
                  {course.instructor?.firstName} {course.instructor?.lastName}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <StarIconSolid className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500">({reviews.length} reviews)</span>
              </div>
            </div>

            {course.whatYouWillLearn && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">What you'll learn</h3>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-gray-300">{course.whatYouWillLearn}</p>
                </div>
              </div>
            )}

            {course.instructions && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Requirements</h3>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-gray-300">{course.instructions}</p>
                </div>
              </div>
            )}
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6 sticky top-8">
              <div className="aspect-video bg-gray-800 rounded-lg mb-4">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">No thumbnail</span>
                  </div>
                )}
              </div>

              <div className="text-3xl font-bold text-white mb-4">
                {course.price ? `$${course.price}` : 'Free'}
              </div>

              <button
                onClick={handleEnrollment}
                disabled={enrolling}
                className="w-full bg-white text-black py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {enrolling 
                  ? 'Enrolling...' 
                  : course.price === 0 
                    ? 'Enroll for Free' 
                    : `Enroll Now - $${course.price}`
                }
              </button>

              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Course Status</span>
                  <span className="text-white">{course.status}</span>
                </div>
                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {course.tags.map((tag, index) => (
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
            </div>
          </div>
        </div>

        {/* Course Content */}
        {course.courseContent && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="space-y-4">
                {course.courseContent.subSections?.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Section {sectionIndex + 1}: {section.title}
                    </h3>
                    <div className="space-y-2">
                      {section.subSections?.map((subSection, subIndex) => (
                        <div key={subIndex} className="flex items-center space-x-3 text-gray-300">
                          <PlayIcon className="h-4 w-4" />
                          <span>{subSection.title}</span>
                          <span className="text-gray-500 text-sm">
                            {subSection.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Student Reviews</h2>
          
          {/* Review Form */}
          {isAuthenticated && isStudent && (
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-2xl"
                      >
                        {star <= rating ? (
                          <StarIconSolid className="text-yellow-400" />
                        ) : (
                          <StarIcon className="text-gray-400 hover:text-yellow-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Review
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    placeholder="Share your thoughts about this course..."
                  />
                </div>
                <button
                  onClick={handleReviewSubmit}
                  className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review this course!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {review.user?.firstName} {review.user?.lastName}
                        </p>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIconSolid
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? 'text-yellow-400' : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300">{review.review}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 