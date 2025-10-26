import React from 'react';
import type { MedicationReminder } from '../types';

interface RemindersProps {
  medications: MedicationReminder[];
  setMedications: (meds: MedicationReminder[]) => void;
  reminderSound: string;
  setReminderSound: (sound: string) => void;
}

export const Reminders: React.FC<RemindersProps> = ({ medications, setMedications, reminderSound, setReminderSound }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Medication Reminders</h2>
      {/* Implementation details to be added */}
    </div>
  );
};