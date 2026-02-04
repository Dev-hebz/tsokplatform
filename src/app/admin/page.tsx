'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { isAdmin } from '../../lib/adminAuth';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Video, 
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Menu,
  X,
  UserCheck
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  modules: any[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalVideos: 0,
    totalStudents: 0
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/admin/login');
      } else {
        // Check if user is admin
        const adminStatus = await isAdmin(currentUser.uid);
        if (!adminStatus) {
          // Not admin - redirect to student courses
          alert('Access denied. Admin privileges required.');
          router.push('/courses');
          return;
        }
        setUser(currentUser);
        fetchCourses();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Course));
      
      setCourses(coursesData);
      
      // Calculate stats
      const totalVideos = coursesData.reduce((acc, course) => {
        return acc + course.modules.reduce((modAcc, mod) => modAcc + (mod.videos?.length || 0), 0);
      }, 0);
      
      setStats({
        totalCourses: coursesData.length,
        totalVideos: totalVideos,
        totalStudents: 0 // Will be updated from users collection
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      fetchCourses();
      alert('Subject deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error deleting course');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-tsok-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-tsok-blue text-white transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b border-blue-800">
          <div className="flex items-center space-x-3">
            <Image
              src="/tsok-logo.png"
              alt="TSOK Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <h1 className="text-lg font-bold">TSOK Admin</h1>
              <p className="text-xs text-blue-200">Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-800 hover:bg-blue-700 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/courses"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>Subjects</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>Users</span>
          </Link>
          <Link
            href="/admin/approvals"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <UserCheck className="w-5 h-5" />
            <span>Approvals</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-800">
          <div className="px-4 py-2 mb-2 text-sm">
            <p className="text-blue-200">Signed in as:</p>
            <p className="font-semibold truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-md sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <h2 className="text-2xl font-bold text-tsok-blue">Dashboard</h2>
            </div>
            <Link href="/" className="text-sm text-tsok-blue hover:text-blue-900">
              View Public Site →
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-tsok-blue to-blue-900 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm mb-1">Total Subjects</p>
                  <p className="text-4xl font-bold">{stats.totalCourses}</p>
                </div>
                <BookOpen className="w-12 h-12 opacity-50" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-tsok-red to-red-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-200 text-sm mb-1">Total Videos</p>
                  <p className="text-4xl font-bold">{stats.totalVideos}</p>
                </div>
                <Video className="w-12 h-12 opacity-50" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-tsok-green to-green-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm mb-1">Total Students</p>
                  <p className="text-4xl font-bold">{stats.totalStudents}</p>
                </div>
                <Users className="w-12 h-12 opacity-50" />
              </div>
            </div>
          </div>

          {/* Subjects Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Manage Subjects</h3>
              <Link
                href="/admin/courses/add"
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Subject</span>
              </Link>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No subjects yet</h3>
                <p className="text-gray-500 mb-4">Create your first course to get started</p>
                <Link href="/admin/courses/add" className="btn-primary inline-flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Create First Subject</span>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modules
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Videos
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{course.title}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-tsok-blue text-white">
                            {course.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {course.modules?.length || 0}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {course.modules?.reduce((acc, mod) => acc + (mod.videos?.length || 0), 0) || 0}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/course/${course.id}`}
                              target="_blank"
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                            <Link
                              href={`/admin/courses/edit/${course.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Developed by Heber Mayormita, LPT</p>
          </div>
        </main>
      </div>
    </div>
  );
}
