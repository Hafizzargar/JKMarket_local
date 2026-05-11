'use client';

import LoginForm from '../../../components/auth/LoginForm';
import FloatingAnimation from '../../../components/ui/FloatingAnimation';

export default function BuyerLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#FDFBF7]">
      <FloatingAnimation />
      <LoginForm role="Buyer" />
    </div>
  );
}
