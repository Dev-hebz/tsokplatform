'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'courses'));
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || 'Untitled',
        description: doc.data().description || '',
        category: doc.data().category || 'General',
        thumbnail: doc.data().thumbnail || '',
        modules: doc.data().modules || []
      }));
      
      setCourses(coursesData);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-tsok-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-tsok-blue hover:text-blue-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <Image
                  src="/tsok-logo.png"
                  alt="TSOK Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
                <div>
                  <h1 className="text-2xl font-bold text-tsok-blue">TSOK Courses</h1>
                  <p className="text-sm text-gray-600">Browse Our Learning Resources</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Available Courses</h2>
          <p className="text-gray-600">
            Enhance your teaching skills with our comprehensive course library
          </p>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="card hover:shadow-xl transition-shadow">
                {/* Thumbnail */}
                <div className="relative h-48 bg-gray-200 rounded-t-xl overflow-hidden">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-tsok-blue to-blue-900">
                      <BookOpen className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  {course.category && (
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-tsok-blue text-white text-xs font-semibold rounded-full">
                        {course.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>
                      {course.modules.length} {course.modules.length === 1 ? 'module' : 'modules'}
                    </span>
                  </div>

                  {/* Button */}
                  <Link href={`/course/${course.id}`} className="btn-primary w-full text-center">
                    Start Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses available yet</h3>
            <p className="text-gray-500 mb-6">Check back soon for new courses!</p>
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TSOK. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Developed by Godmisoft
          </p>
        </div>
      </footer>
    </div>
  );
}
