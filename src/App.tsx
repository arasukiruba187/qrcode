import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { QRGeneratorPage } from './components/generator/QRGeneratorPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { SettingsModal } from './components/settings/SettingsModal';
import { PrintQRView } from './components/print/PrintQRView';

export const MainContent: React.FC = () => {
  const { currentTab } = useApp();

  return (
    <main className="flex-1">
      {currentTab === 'landing' && <LandingPage />}
      {currentTab === 'generator' && <QRGeneratorPage />}
      {currentTab === 'dashboard' && <DashboardPage />}
      {currentTab === 'analytics' && <AnalyticsPage />}
      {currentTab === 'settings' && <SettingsModal />}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 light:bg-slate-50 light:text-slate-900 transition-colors duration-200 selection:bg-electric-500 selection:text-white">
      <Header />
      <MainContent />
      <Footer />
      <ToastContainer />
      <PrintQRView />
    </div>
  );
};

export default App;
