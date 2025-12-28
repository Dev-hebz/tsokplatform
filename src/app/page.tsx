'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Video, Users, Award, LogIn, UserPlus, Menu, X } from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Lessons",
      description: "High-quality educational videos accessible anytime, anywhere"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Structured Subjects",
      description: "Well-organized modules for effective learning"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed analytics"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image
                src="/tsok-logo.png"
                alt="TSOK Logo"
                width={50}
                height={50}
                className="object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-tsok-blue">TSOK</h1>
                <p className="text-xs text-gray-600">Learning Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/about" className="text-gray-700 hover:text-tsok-blue transition-colors">
                About
              </Link>
              <Link href="/login" className="btn-secondary flex items-center space-x-2">
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link href="/register" className="btn-primary flex items-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                About
              </Link>
              <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Login
              </Link>
              <Link href="/register" className="block px-4 py-2 bg-tsok-blue text-white rounded">
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-tsok-blue to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Image
            src="/tsok-logo.png"
            alt="TSOK Logo"
            width={150}
            height={150}
            className="mx-auto mb-8 drop-shadow-2xl"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Teachers Specialists Organization of Kuwait
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Empowering Educators Through Quality Online Learning
          </p>
          <div className="flex justify-center">
            <Link href="/register" className="bg-tsok-yellow text-tsok-blue px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors shadow-lg">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-tsok-blue">
            Why Choose TSOK Learning Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-xl transition-shadow">
                <div className="text-tsok-blue mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-tsok-blue to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of educators enhancing their skills
          </p>
          <Link href="/register" className="bg-tsok-yellow text-tsok-blue px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors shadow-lg inline-block">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Image
              src="/tsok-logo.png"
              alt="TSOK Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <p className="font-semibold">TSOK</p>
              <p className="text-sm text-gray-400">Teachers Specialists Organization of Kuwait</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            © {isClient ? new Date().getFullYear() : '2024'} TSOK. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Developed by Heber Mayormita, LPT
          </p>
        </div>
      </footer>
    </div>
  );
}
