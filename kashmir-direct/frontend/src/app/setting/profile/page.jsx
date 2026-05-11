'use client';

import { Suspense } from 'react';
import ProfileNode from '../../../components/ui/ProfileNode';
import AuthGuard from '../../../components/auth/AuthGuard';
import SovereignLoading from '../../../components/ui/SovereignLoading';

/**
 * 👤 PROFILE PAGE
 * Dedicated page for managing artisan credentials and security.
 */
function ProfileContent() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] pt-4 pb-20 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-[0_20px_50px_-15px_rgba(27,67,50,0.06)] border border-[#1B4332]/5 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#BC6C25]/2 blur-3xl rounded-full -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <ProfileNode isModal={false} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <SovereignLoading message="Forging Profile Node" />
      </div>
    }>
      <AuthGuard>
        <ProfileContent />
      </AuthGuard>
    </Suspense>
  );
}
