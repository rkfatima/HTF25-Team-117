import React from 'react';
import type { HealthLog } from '../types';

interface HealthLogFormProps {
  onSubmit: (log: Omit<HealthLog, 'id'>) => void;
  onClose: () => void;
}

export const HealthLogForm: React.FC<HealthLogFormProps> = ({ onSubmit, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add Health Log</h2>
        {/* Form implementation to be added */}
      </div>
    </div>
  );
};