import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-tsok-blue hover:text-blue-900">
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
                <h1 className="text-xl font-bold text-tsok-blue">About TSOK</h1>
                <p className="text-xs text-gray-600">Teachers Specialists Organization of Kuwait</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card">
          <h2 className="text-3xl font-bold text-tsok-blue mb-6">
            About TSOK Learning Platform
          </h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              The Teachers Specialists Organization of Kuwait (TSOK) Learning Platform is dedicated to 
              empowering Filipino educators in Kuwait through quality online education and professional development.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Mission</h3>
            <p className="text-gray-700 mb-4">
              To provide accessible, high-quality educational resources that help teachers enhance their 
              skills, share knowledge, and build a stronger community of educators.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">What We Offer</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Comprehensive video-based courses</li>
              <li>Professional development resources</li>
              <li>Community-driven content</li>
              <li>Free access to educational materials</li>
              <li>Progress tracking and certifications</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contact Us</h3>
            <p className="text-gray-700">
              For inquiries, please reach out to the TSOK administration team.
            </p>
          </div>
        </div>
      </main>

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
