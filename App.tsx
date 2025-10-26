import React, { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { HealthLog, PeriodCycle, MedicationReminder, MedicalDocument, UserProfile, PeriodLog as PeriodLogType, AnalysisResult } from './types';
import { Dashboard } from './components/Dashboard';
import { PeriodTracker } from './components/PeriodTracker';
import { Chatbot } from './components/Chatbot';
import { DietChatbot } from './components/DietChatbot';
import { Reminders } from './components/Reminders';
import { MedicalDocs } from './components/MedicalDocs';
import { HealthLogForm } from './components/HealthLogForm';
import { Profile } from './components/Profile';
import { ChartIcon, CalendarIcon, MessageSquareIcon, BellIcon, FileTextIcon, PlusIcon, UserIcon, MenuIcon, BowlIcon, XIcon } from './components/icons';

type View = 'dashboard' | 'tracker' | 'chatbot' | 'reminders' | 'documents' | 'profile' | 'dietChatbot';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [healthLogs, setHealthLogs] = useLocalStorage<HealthLog[]>('healthLogs', []);
  const [periodCycles, setPeriodCycles] = useLocalStorage<PeriodCycle[]>('periodCycles', []);
  const [periodLogs, setPeriodLogs] = useLocalStorage<PeriodLogType[]>('periodLogs', []);
  const [medications, setMedications] = useLocalStorage<MedicationReminder[]>('medications', []);
  const [documents, setDocuments] = useLocalStorage<Omit<MedicalDocument, 'data'>[]>('documents', []);
  const [documentData, setDocumentData] = useState<Record<string, string>>({}); // Session-only data
  const [profile, setProfile] = useLocalStorage<UserProfile>('userProfile', {});
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [analysisResults, setAnalysisResults] = useLocalStorage<{ [docId: string]: { analysis?: AnalysisResult; isLoading: boolean } }>('analysisResults', {});

  
  const [activeNotification, setActiveNotification] = useState<MedicationReminder | null>(null);
  const [triggeredToday, setTriggeredToday] = useLocalStorage<Record<string, string>>('triggeredReminders', {});
  const [reminderSound, setReminderSound] = useLocalStorage<string>('reminderSound', 'data:audio/wav;base64,UklGRkIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQwAAACAAAD//w==');

  // Document management lifted from MedicalDocs
  const addDocument = (doc: MedicalDocument) => {
    const { data, ...metadata } = doc;
    setDocuments(prev => [metadata, ...prev]);
    if (data) {
        setDocumentData(prev => ({ ...prev, [doc.id]: data }));
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    setDocumentData(prev => {
        const newData = { ...prev };
        delete newData[id];
        return newData;
    });
    setAnalysisResults(prev => {
        const newResults = { ...prev };
        delete newResults[id];
        return newResults;
    });
  };
  
  // Reminder check effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Reset daily triggers if the day has changed
      if (triggeredToday.date !== todayStr) {
        setTriggeredToday({ date: todayStr });
      }

      const dueMedication = medications.find(med => {
        return med.active && med.time === currentTime && !triggeredToday[med.id];
      });

      if (dueMedication) {
        setActiveNotification(dueMedication);
        setTriggeredToday(prev => ({ ...prev, [dueMedication.id]: currentTime }));
      }
    }, 10000); // Check every 10 seconds for reliability

    return () => clearInterval(interval);
  }, [medications, triggeredToday, setTriggeredToday]);

  // Sound playing effect
  useEffect(() => {
    if (activeNotification) {
      const audio = new Audio(reminderSound);
      audio.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [activeNotification, reminderSound]);


  // Theme logic
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const handleAddLog = useCallback((log: Omit<HealthLog, 'id'>) => {
    const newLog = { ...log, id: Date.now().toString() };
    setHealthLogs(prevLogs => [newLog, ...prevLogs].sort((a,b) => b.date.localeCompare(a.date)));
    setIsLogModalOpen(false);
  }, [setHealthLogs]);

  const navItems: { view: View, label: string, icon: React.FC<any> }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: ChartIcon },
    { view: 'tracker', label: 'Period Tracker', icon: CalendarIcon },
    { view: 'dietChatbot', label: 'AI Diet Planner', icon: BowlIcon },
    { view: 'chatbot', label: 'AI Health Guide', icon: MessageSquareIcon },
    { view: 'reminders', label: 'Med Reminders', icon: BellIcon },
    { view: 'documents', label: 'Medical Docs', icon: FileTextIcon },
    { view: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard healthLogs={healthLogs} profile={profile} theme={theme} setTheme={setTheme} />;
      case 'tracker':
        return <PeriodTracker periodCycles={periodCycles} setPeriodCycles={setPeriodCycles} periodLogs={periodLogs} setPeriodLogs={setPeriodLogs} />;
      case 'chatbot':
        return <Chatbot />;
      case 'dietChatbot':
        const latestDoc = documents.length > 0 ? { ...documents[0], data: documentData[documents[0].id] } : undefined;
        return <DietChatbot profile={profile} documents={latestDoc ? [latestDoc] : []} periodCycles={periodCycles} periodLogs={periodLogs} analysisResults={analysisResults} healthLogs={healthLogs} />;
      case 'reminders':
        return <Reminders medications={medications} setMedications={setMedications} reminderSound={reminderSound} setReminderSound={setReminderSound}/>;
      case 'documents':
        return <MedicalDocs documents={documents} documentData={documentData} addDocument={addDocument} deleteDocument={deleteDocument} setMedications={setMedications} analysisResults={analysisResults} setAnalysisResults={setAnalysisResults} />;
      case 'profile':
        return <Profile profile={profile} setProfile={setProfile} />;
      default:
        return <Dashboard healthLogs={healthLogs} profile={profile} theme={theme} setTheme={setTheme} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      {/* Sidebar */}
       <aside className={`bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
         <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} p-4 h-16 border-b border-slate-200 dark:border-slate-700`}>
          {isSidebarOpen && <h1 className="text-xl font-bold text-violet-600">Vitalis</h1>}
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">
             {isSidebarOpen ? <XIcon className="h-6 w-6"/> : <MenuIcon className="h-6 w-6"/> }
           </button>
         </div>
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map(({ view, label, icon: Icon }) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`w-full flex items-center p-3 rounded-md text-sm font-medium transition-colors ${isSidebarOpen ? '' : 'justify-center'} ${
                activeView === view
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="h-6 w-6" />
              {isSidebarOpen && <span className="ml-3">{label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-end items-center p-4 h-16 bg-white dark:bg-slate-800/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
          <button onClick={() => setIsLogModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors">
            <PlusIcon className="h-5 w-5" />
            <span>Add Health Log</span>
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
      
      {/* Reminder Notification Modal */}
      {activeNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-8 max-w-sm w-full text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-violet-100 dark:bg-violet-900 mb-4">
                      <BellIcon className="h-8 w-8 text-violet-600 dark:text-violet-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Medication Reminder</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">It's time to take your medication:</p>
                  <p className="text-2xl font-semibold text-violet-700 dark:text-violet-300 mt-4">
                      {activeNotification.name}
                  </p>
                   <p className="text-md text-slate-600 dark:text-slate-300">
                      {activeNotification.dosage}
                  </p>
                  <button
                      onClick={() => setActiveNotification(null)}
                      className="mt-6 w-full px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                  >
                      Dismiss
                  </button>
              </div>
          </div>
      )}

      {/* Health Log Modal */}
      {isLogModalOpen && <HealthLogForm onSubmit={handleAddLog} onClose={() => setIsLogModalOpen(false)} />}
    </div>
  );
};

export default App;