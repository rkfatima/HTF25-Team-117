import React from 'react';
import type { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export const Profile: React.FC<ProfileProps> = ({ profile, setProfile }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile</h2>
      {/* Implementation details to be added */}
    </div>
  );
};