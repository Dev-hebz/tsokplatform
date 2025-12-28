'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { isAdmin } from '../../../lib/adminAuth';
import { 
  ArrowLeft, 
  Plus,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Video
} from 'lucide-react';

export default function AdminCoursesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/admin/login');
      } else {
        const adminStatus = await isAdmin(currentUser.uid);
        if (!adminStatus) {
          alert('Access denied. Admin privileges required.');
          router.push('/courses');
          return;
        }
        fetchCourses();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        let totalVideos = 0;
        
        if (data.modules && Array.isArray(data.modules)) {
          data.modules.forEach((module: any) => {
            if (module.videos && Array.isArray(module.videos)) {
              totalVideos += module.videos.length;
            }
          });
        }
        
        return {
          id: doc.id,
          title: data.title || 'Untitled',
          description: data.description || '',
          category: data.category || 'General',
          thumbnail: data.thumbnail || '',
          modules: data.modules || [],
          totalVideos
        };
      });
      
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Delete course "${courseTitle}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'courses', courseId));
      setCourses(courses.filter(c => c.id !== courseId));
      alert('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-tsok-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-tsok-blue hover:text-blue-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <Image
                  src="/tsok-logo.png"
                  alt="TSOK Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-tsok-blue">Course Management</h1>
                  <p className="text-xs text-gray-600">TSOK Admin Dashboard</p>
                </div>
              </div>
            </div>

            <Link href="/admin/courses/add" className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add New Course</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            All Courses ({courses.length})
          </h2>
          <p className="text-gray-600">Manage your course content and structure</p>
        </div>

        {courses.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first course</p>
            <Link href="/admin/courses/add" className="btn-primary inline-flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create First Course</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="card hover:shadow-xl transition-shadow">
                {/* Thumbnail */}
                <div className="relative h-48 bg-gray-200 rounded-t-xl overflow-hidden mb-4">
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
                <div className="px-4 pb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.modules.length} modules</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Video className="w-4 h-4" />
                      <span>{course.totalVideos} videos</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <Link
                      href={`/course/${course.id}`}
                      className="btn-secondary text-center flex items-center justify-center space-x-1 text-sm py-2"
                      target="_blank"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </Link>
                    <Link
                      href={`/admin/courses/edit/${course.id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id, course.title)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-1 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
