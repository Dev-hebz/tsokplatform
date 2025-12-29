'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Students cannot register - only admin creates accounts
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-tsok-blue to-blue-900 flex items-center justify-center">
      <div className="text-white text-center">
        <p className="text-xl mb-2">Registration Disabled</p>
        <p className="text-sm">Only administrators can create user accounts</p>
        <p className="text-xs mt-4">Redirecting to login...</p>
      </div>
    </div>
  );
}
