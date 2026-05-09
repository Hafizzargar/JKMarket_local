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
        <div className="bg-[#0D1110] rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-[#1B4332]/5 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#BC6C25]/5 blur-[120px] rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B4332]/5 blur-[120px] rounded-full -ml-48 -mb-48" />
          
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
