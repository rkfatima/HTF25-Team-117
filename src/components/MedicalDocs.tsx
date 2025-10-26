import React from 'react';
import type { MedicalDocument, AnalysisResult } from '../types';

interface MedicalDocsProps {
  documents: Omit<MedicalDocument, 'data'>[];
  documentData: Record<string, string>;
  addDocument: (doc: MedicalDocument) => void;
  deleteDocument: (id: string) => void;
  setMedications: (meds: any[]) => void;
  analysisResults: { [docId: string]: { analysis?: AnalysisResult; isLoading: boolean } };
  setAnalysisResults: (results: { [docId: string]: { analysis?: AnalysisResult; isLoading: boolean } }) => void;
}

export const MedicalDocs: React.FC<MedicalDocsProps> = ({
  documents,
  documentData,
  addDocument,
  deleteDocument,
  setMedications,
  analysisResults,
  setAnalysisResults
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Medical Documents</h2>
      {/* Implementation details to be added */}
    </div>
  );
};