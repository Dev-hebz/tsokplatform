'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../../lib/firebase';
import { isAdminEmail } from '../../../../lib/adminAuth';
import { ArrowLeft, UserPlus, Mail, Lock, User } from 'lucide-react';

export default function AdminAddUserPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        role: role,
        createdAt: new Date().toISOString(),
        createdBy: 'admin',
        progress: {},
        location: {
          country: '',
          city: '',
          ip: '',
          lastAccess: null
        }
      });

      setSuccess(`User "${name}" created successfully!`);
      setName('');
      setEmail('');
      setPassword('');
      setRole('student');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already exists');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters');
      } else {
        setError(err.message || 'Failed to create user');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin/users" className="text-tsok-blue hover:text-blue-900">
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
                <h1 className="text-xl font-bold text-tsok-blue">Add New User</h1>
                <p className="text-xs text-gray-600">TSOK Admin Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New User Account</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Juan Dela Cruz"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="user@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field"
                required
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Students can browse subjects, Admins can manage content
              </p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create User</span>
                  </>
                )}
              </button>
              <Link href="/admin/users" className="btn-secondary flex-1 text-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
