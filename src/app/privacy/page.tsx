import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
                <h1 className="text-xl font-bold text-tsok-blue">Privacy Policy</h1>
                <p className="text-xs text-gray-600">TSOK Learning Platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card">
          <h2 className="text-3xl font-bold text-tsok-blue mb-6">Privacy Policy</h2>
          
          <div className="prose max-w-none text-gray-700 space-y-6">
            <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Information We Collect</h3>
              <p>
                When you register for TSOK Learning Platform, we collect:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Name and email address</li>
                <li>Learning progress and course completion data</li>
                <li>Usage analytics to improve our platform</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How We Use Your Information</h3>
              <p>We use collected information to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Provide access to educational courses</li>
                <li>Track your learning progress</li>
                <li>Send course updates and notifications</li>
                <li>Improve our platform and services</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Data Security</h3>
              <p>
                We use Firebase Authentication and Firestore to securely store your data. 
                Your password is encrypted and we never store sensitive information in plain text.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Third-Party Services</h3>
              <p>We use the following services:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Firebase (Google) - Authentication and database</li>
                <li>YouTube - Video hosting and streaming</li>
                <li>Vercel - Platform hosting</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Your Rights</h3>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Access your personal data</li>
                <li>Request data deletion</li>
                <li>Opt-out of communications</li>
                <li>Update your information</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contact</h3>
              <p>
                For privacy-related questions, please contact the TSOK administration team.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TSOK. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
