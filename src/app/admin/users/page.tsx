'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';
import { onAuthStateChanged, deleteUser } from 'firebase/auth';
import { isAdmin } from '../../../lib/adminAuth';
import { 
  ArrowLeft, 
  Users,
  Calendar,
  Mail,
  Award,
  Search,
  Plus,
  Trash2,
  MapPin,
  Edit,
  X,
  Save
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  status?: string;
  role?: string;
  progress?: any;
  location?: {
    country: string;
    city: string;
    ip: string;
    lastAccess: string;
  };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    status: 'approved',
    role: 'student'
  });
  const [editLoading, setEditLoading] = useState(false);
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error' | 'info'}>({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

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
        fetchUsers();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      status: user.status || 'approved',
      role: user.role || 'student'
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    if (!editFormData.name.trim()) {
      showToast('Name is required', 'error');
      return;
    }

    if (!editFormData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
      showToast('Valid email is required', 'error');
      return;
    }

    setEditLoading(true);
    try {
      await updateDoc(doc(db, 'users', editingUser.id), {
        name: editFormData.name.trim(),
        email: editFormData.email.toLowerCase().trim(),
        status: editFormData.status,
        role: editFormData.role,
        updatedAt: new Date().toISOString()
      });

      // Update local state
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...editFormData }
          : u
      ));

      setEditingUser(null);
      showToast('User updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating user:', error);
      showToast('Failed to update user. Please try again.', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string, userEmail: string) => {
    if (!confirm(`Delete user "${userName}" (${userEmail})? This cannot be undone.`)) {
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'users', userId));
      
      // Update local state
      setUsers(users.filter(u => u.id !== userId));
      
      showToast('User deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Failed to delete user from database', 'error');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                <h1 className="text-xl font-bold text-tsok-blue">User Management</h1>
                <p className="text-xs text-gray-600">TSOK Admin Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <Users className="w-6 h-6 text-tsok-blue" />
              <span>Registered Users ({users.length})</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 flex-1 md:flex-initial">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Search users..."
                />
              </div>
              <Link href="/admin/users/add" className="btn-primary flex items-center justify-center space-x-2 whitespace-nowrap">
                <Plus className="w-5 h-5" />
                <span>Add User</span>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-tsok-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm ? 'No users found' : 'No users yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try a different search term' : 'Users will appear here when they register'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Access
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-tsok-blue text-white flex items-center justify-center font-semibold">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'admin' ? '👑 Admin' : '👤 Student'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {user.location?.city && user.location?.country 
                              ? `${user.location.city}, ${user.location.country}`
                              : 'Not tracked'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {user.location?.lastAccess 
                              ? formatDate(user.location.lastAccess)
                              : 'Never'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-tsok-yellow" />
                          <span className="text-sm text-gray-700">
                            {Object.keys(user.progress || {}).length} subjects enrolled
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 text-sm font-medium"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name, user.email)}
                            className="text-red-600 hover:text-red-900 flex items-center space-x-1 text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
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

        {/* Statistics Cards */}
        {!loading && users.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm mb-1">Total Users</p>
                  <p className="text-4xl font-bold">{users.length}</p>
                </div>
                <Users className="w-12 h-12 opacity-50" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-green-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm mb-1">This Month</p>
                  <p className="text-4xl font-bold">
                    {users.filter(u => {
                      try {
                        const userDate = new Date(u.createdAt);
                        const now = new Date();
                        return userDate.getMonth() === now.getMonth() && 
                               userDate.getFullYear() === now.getFullYear();
                      } catch {
                        return false;
                      }
                    }).length}
                  </p>
                </div>
                <Calendar className="w-12 h-12 opacity-50" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-yellow-500 to-yellow-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm mb-1">Active Learners</p>
                  <p className="text-4xl font-bold">
                    {users.filter(u => Object.keys(u.progress || {}).length > 0).length}
                  </p>
                </div>
                <Award className="w-12 h-12 opacity-50" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Loading Overlay */}
            {editLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 rounded-2xl flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="relative w-20 h-20 mb-4 mx-auto">
                    <Image
                      src="/tsok-logo.png"
                      alt="TSOK Logo"
                      width={80}
                      height={80}
                      className="object-contain animate-pulse"
                    />
                    <div className="absolute inset-0 border-4 border-tsok-blue border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-700 font-semibold">Updating user...</p>
                </div>
              </div>
            )}

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Edit User</h3>
              <button
                onClick={() => setEditingUser(null)}
                disabled={editLoading}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tsok-blue"
                  placeholder="Juan Dela Cruz"
                  disabled={editLoading}
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tsok-blue"
                  placeholder="email@example.com"
                  disabled={editLoading}
                />
              </div>

              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tsok-blue"
                  disabled={editLoading}
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Role
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tsok-blue"
                  disabled={editLoading}
                >
                  <option value="student">👤 Student</option>
                  <option value="admin">👑 Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ Admin users can manage courses, users, and approvals
                </p>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">User ID:</p>
                <p className="text-sm font-mono text-gray-700">{editingUser.id}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setEditingUser(null)}
                disabled={editLoading}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-tsok-blue text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-2xl border-l-4 ${
            toast.type === 'success' ? 'bg-green-50 border-green-500' :
            toast.type === 'error' ? 'bg-red-50 border-red-500' :
            'bg-blue-50 border-blue-500'
          }`}>
            <div className="flex-shrink-0">
              {toast.type === 'success' && (
                <Award className="w-6 h-6 text-green-600" />
              )}
              {toast.type === 'error' && (
                <X className="w-6 h-6 text-red-600" />
              )}
              {toast.type === 'info' && (
                <Mail className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <p className={`font-medium ${
              toast.type === 'success' ? 'text-green-800' :
              toast.type === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {toast.message}
            </p>
            <button
              onClick={() => setToast({ ...toast, show: false })}
              className={`ml-2 ${
                toast.type === 'success' ? 'text-green-600 hover:text-green-800' :
                toast.type === 'error' ? 'text-red-600 hover:text-red-800' :
                'text-blue-600 hover:text-blue-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
