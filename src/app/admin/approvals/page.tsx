'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { isAdmin } from '../../../lib/adminAuth';
import { 
  ArrowLeft, 
  UserCheck,
  UserX,
  Clock,
  Mail,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Save,
  X as XIcon
} from 'lucide-react';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  registeredAt: any;
}

export default function AdminApprovalsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<PendingUser[]>([]);
  const [rejectedUsers, setRejectedUsers] = useState<PendingUser[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [editingUser, setEditingUser] = useState<PendingUser | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: ''
  });
  const [editLoading, setEditLoading] = useState(false);

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
        fetchAllUsers();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      // Fetch pending users
      const pendingQuery = query(
        collection(db, 'users'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      const pending = pendingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PendingUser));

      // Fetch approved users
      const approvedQuery = query(
        collection(db, 'users'),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc')
      );
      const approvedSnapshot = await getDocs(approvedQuery);
      const approved = approvedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PendingUser));

      // Fetch rejected users
      const rejectedQuery = query(
        collection(db, 'users'),
        where('status', '==', 'rejected'),
        orderBy('createdAt', 'desc')
      );
      const rejectedSnapshot = await getDocs(rejectedQuery);
      const rejected = rejectedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PendingUser));

      setPendingUsers(pending);
      setApprovedUsers(approved);
      setRejectedUsers(rejected);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to load users. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: PendingUser) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    if (!editFormData.name.trim()) {
      alert('Name is required');
      return;
    }

    if (!editFormData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
      alert('Valid email is required');
      return;
    }

    setEditLoading(true);
    try {
      await updateDoc(doc(db, 'users', editingUser.id), {
        name: editFormData.name.trim(),
        email: editFormData.email.toLowerCase().trim(),
        updatedAt: new Date().toISOString()
      });

      // Update in all lists
      const updateUser = (u: PendingUser) => 
        u.id === editingUser.id 
          ? { ...u, name: editFormData.name, email: editFormData.email }
          : u;

      setPendingUsers(prev => prev.map(updateUser));
      setApprovedUsers(prev => prev.map(updateUser));
      setRejectedUsers(prev => prev.map(updateUser));

      setEditingUser(null);
      alert('✓ User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleApprove = async (userId: string, userName: string) => {
    if (!confirm(`Approve registration for "${userName}"?`)) {
      return;
    }

    setActionLoading(userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'approved',
        approvedAt: new Date().toISOString()
      });

      // Move user from pending to approved
      const user = pendingUsers.find(u => u.id === userId);
      if (user) {
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        setApprovedUsers(prev => [{ ...user, status: 'approved' }, ...prev]);
      }

      alert(`✓ User "${userName}" has been approved!`);
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string, userName: string) => {
    const reason = prompt(`Reject registration for "${userName}"?\n\nOptional: Enter reason for rejection:`);
    
    if (reason === null) {
      // User clicked cancel
      return;
    }

    setActionLoading(userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason || 'No reason provided'
      });

      // Move user from pending to rejected
      const user = pendingUsers.find(u => u.id === userId);
      if (user) {
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        setRejectedUsers(prev => [{ ...user, status: 'rejected' }, ...prev]);
      }

      alert(`✗ User "${userName}" has been rejected.`);
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Permanently delete "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(userId);
    try {
      await deleteDoc(doc(db, 'users', userId));

      // Remove from all lists
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      setApprovedUsers(prev => prev.filter(u => u.id !== userId));
      setRejectedUsers(prev => prev.filter(u => u.id !== userId));

      alert(`User "${userName}" has been permanently deleted.`);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const renderUserList = (users: PendingUser[], status: 'pending' | 'approved' | 'rejected') => {
    if (users.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {status === 'pending' && <Clock className="w-8 h-8 text-gray-400" />}
            {status === 'approved' && <CheckCircle className="w-8 h-8 text-gray-400" />}
            {status === 'rejected' && <XCircle className="w-8 h-8 text-gray-400" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No {status} users
          </h3>
          <p className="text-sm text-gray-500">
            {status === 'pending' && 'All registrations have been processed'}
            {status === 'approved' && 'No approved users yet'}
            {status === 'rejected' && 'No rejected users yet'}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-tsok-blue text-white flex items-center justify-center font-semibold text-lg">
                  {user.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-500">Registered: {formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                {status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(user.id, user.name)}
                      disabled={actionLoading === user.id}
                      className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{actionLoading === user.id ? 'Processing...' : 'Approve'}</span>
                    </button>
                    <button
                      onClick={() => handleReject(user.id, user.name)}
                      disabled={actionLoading === user.id}
                      className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <UserX className="w-4 h-4" />
                      <span>{actionLoading === user.id ? 'Processing...' : 'Reject'}</span>
                    </button>
                  </>
                )}
                {status === 'approved' && (
                  <button
                    onClick={() => handleEditUser(user)}
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
                {status === 'rejected' && (
                  <button
                    onClick={() => handleDelete(user.id, user.name)}
                    disabled={actionLoading === user.id}
                    className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{actionLoading === user.id ? 'Deleting...' : 'Delete'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <Image
                src="/tsok-logo.png"
                alt="TSOK Logo"
                width={96}
                height={96}
                className="object-contain animate-pulse"
              />
              <div className="absolute inset-0 border-4 border-tsok-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-700 font-semibold">Loading user approvals...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait</p>
          </div>
        </div>
      )}

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
                <h1 className="text-xl font-bold text-tsok-blue">User Approvals</h1>
                <p className="text-xs text-gray-600">Manage Registration Requests</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-700 text-white cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('pending')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm mb-1">Pending Approval</p>
                <p className="text-4xl font-bold">{pendingUsers.length}</p>
              </div>
              <Clock className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-700 text-white cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('approved')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm mb-1">Approved Users</p>
                <p className="text-4xl font-bold">{approvedUsers.length}</p>
              </div>
              <CheckCircle className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-red-500 to-red-700 text-white cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('rejected')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm mb-1">Rejected Users</p>
                <p className="text-4xl font-bold">{rejectedUsers.length}</p>
              </div>
              <XCircle className="w-12 h-12 opacity-50" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${
                  activeTab === 'pending'
                    ? 'text-tsok-blue'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Pending ({pendingUsers.length})</span>
                </span>
                {activeTab === 'pending' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-tsok-blue"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('approved')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${
                  activeTab === 'approved'
                    ? 'text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Approved ({approvedUsers.length})</span>
                </span>
                {activeTab === 'approved' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('rejected')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${
                  activeTab === 'rejected'
                    ? 'text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5" />
                  <span>Rejected ({rejectedUsers.length})</span>
                </span>
                {activeTab === 'rejected' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'pending' && renderUserList(pendingUsers, 'pending')}
          {activeTab === 'approved' && renderUserList(approvedUsers, 'approved')}
          {activeTab === 'rejected' && renderUserList(rejectedUsers, 'rejected')}
        </div>

        {/* Help Notice */}
        {pendingUsers.length > 0 && activeTab === 'pending' && (
          <div className="mt-8 card bg-blue-50 border-l-4 border-tsok-blue">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-tsok-blue flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Approval Instructions</h3>
                <p className="text-sm text-gray-700">
                  Review each pending registration carefully. Once approved, users will be able to access all courses and materials. 
                  Rejected users can be permanently deleted from the system.
                </p>
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
                <XIcon className="w-6 h-6" />
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

              {/* Status Badge */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Account Status:</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  editingUser.status === 'approved' ? 'bg-green-100 text-green-800' :
                  editingUser.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {editingUser.status?.charAt(0).toUpperCase() + editingUser.status?.slice(1)}
                </span>
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
    </div>
  );
}
