import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
                <h1 className="text-xl font-bold text-tsok-blue">Terms of Service</h1>
                <p className="text-xs text-gray-600">TSOK Learning Platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card">
          <h2 className="text-3xl font-bold text-tsok-blue mb-6">Terms of Service</h2>
          
          <div className="prose max-w-none text-gray-700 space-y-6">
            <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Acceptance of Terms</h3>
              <p>
                By accessing and using the TSOK Learning Platform, you accept and agree to be bound by these Terms of Service.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. User Accounts</h3>
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Course Access</h3>
              <p>
                All courses and materials are provided for educational purposes only. 
                You may not redistribute, sell, or commercially exploit any content from this platform.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. User Conduct</h3>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Share your account credentials with others</li>
                <li>Download or attempt to download protected content</li>
                <li>Interfere with the platform's operation</li>
                <li>Use the platform for any illegal purposes</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Intellectual Property</h3>
              <p>
                All course content, including videos, materials, and documentation, remain the property of TSOK 
                and its content creators. Unauthorized use is prohibited.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Disclaimer</h3>
              <p>
                The platform and courses are provided "as is" without warranties of any kind. 
                TSOK is not responsible for any damages arising from the use of this platform.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Changes to Terms</h3>
              <p>
                TSOK reserves the right to modify these terms at any time. 
                Continued use of the platform constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Contact</h3>
              <p>
                For questions about these terms, please contact the TSOK administration team.
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
