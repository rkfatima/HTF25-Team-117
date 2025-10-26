export interface HealthLog {
  id: string;
  date: string;
  type: string;
  value: string | number;
  notes?: string;
}

export interface PeriodCycle {
  id: string;
  startDate: string;
  endDate: string;
  symptoms: string[];
  flow: 'light' | 'medium' | 'heavy';
  notes?: string;
}

export interface PeriodLog {
  date: string;
  symptoms: string[];
  flow: 'light' | 'medium' | 'heavy';
  notes?: string;
}

export interface MedicationReminder {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  active: boolean;
  notes?: string;
}

export interface MedicalDocument {
  id: string;
  name: string;
  type: string;
  date: string;
  data: string;
  notes?: string;
}

export interface UserProfile {
  name?: string;
  dateOfBirth?: string;
  gender?: string;
  height?: number;
  weight?: number;
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isLoading?: boolean;
}

export interface AnalysisResult {
  summary: string;
  recommendations: string[];
  warnings?: string[];
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
}