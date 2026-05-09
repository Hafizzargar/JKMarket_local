'use client';

import { useState } from 'react';
import Drawer from './Drawer';
import ProfileNode from './ProfileNode';
import UserNode from './UserNode';

export default function ProfileIdentityPortal({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)} 
        className={`cursor-pointer active:scale-95 transition-transform ${className}`}
      >
        <UserNode />
      </div>

      <Drawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Artisan Identity Forge"
        side="right"
      >
        <ProfileNode isModal={true} />
      </Drawer>
    </>
  );
}
