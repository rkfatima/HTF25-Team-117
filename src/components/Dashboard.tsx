import React from 'react';
import type { HealthLog, UserProfile } from '../types';

interface DashboardProps {
  healthLogs: HealthLog[];
  profile: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ healthLogs, profile }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      {/* Implementation details to be added */}
    </div>
  );
};