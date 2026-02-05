
import React, { useState, useEffect } from 'react';
import { Home, BarChart2, Bell, Settings, User, Droplets, Menu, X, Moon, Sun } from 'lucide-react';
import { SOURCES as INITIAL_SOURCES, DEVICE_INFO } from './constants';
import { SourceId, WaterData, SourceInfo } from './types';
import { generateMockData } from './services/dataService';

// Pages
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Alerts from './components/Alerts';
import SystemSettings from './components/SystemSettings';
import Profile from './components/Profile';
import SplashScreen from './components/SplashScreen';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [activeSourceId, setActiveSourceId] = useState<SourceId>('overhead-tank');
  const [waterData, setWaterData] = useState<WaterData>(generateMockData('overhead-tank'));
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Dynamic App State
  const [sources, setSources] = useState<SourceInfo[]>(INITIAL_SOURCES);
  const [userName, setUserName] = useState("Rohan Sharma");
  const [userEmail, setUserEmail] = useState("rohan.s@aquasense.io");
  const [alerts, setAlerts] = useState([
    { id: '1', title: 'Critical TDS Spike', description: 'TDS reached 1240 ppm at Borewell source. Immediate attention required.', source: 'Borewell', severity: 'Critical', timestamp: '2 mins ago', dismissed: false },
    { id: '2', title: 'High Turbidity Warning', description: 'Water clarity decreased. Filter check recommended.', source: 'Overhead Tank', severity: 'Warning', timestamp: '1 hour ago', dismissed: false },
    { id: '3', title: 'System Maintenance', description: 'Scheduled sensor cleaning in 24 hours.', source: 'All', severity: 'Info', timestamp: '4 hours ago', dismissed: false },
    { id: '4', title: 'Connection Restored', description: 'ESP32 module reconnected to local Wi-Fi.', source: 'Borewell', severity: 'Info', timestamp: 'Yesterday', dismissed: false },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaterData(generateMockData(activeSourceId));
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSourceId]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSourceChange = (id: SourceId) => {
    setActiveSourceId(id);
    setWaterData(generateMockData(id));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const addSource = (newSource: SourceInfo) => {
    setSources(prev => [...prev, newSource]);
  };

  const deleteSource = (id: string) => {
    if (sources.length <= 1) {
      alert("At least one source must remain active.");
      return;
    }
    const newSources = sources.filter(s => s.id !== id);
    setSources(newSources);
    if (activeSourceId === id) {
      setActiveSourceId(newSources[0].id as SourceId);
    }
  };

  if (loading) return <SplashScreen />;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'alerts', label: 'Alerts', icon: Bell, count: alerts.length },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const activeSource = sources.find(s => s.id === activeSourceId) || sources[0];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard data={waterData} source={activeSource} sources={sources} onSourceChange={handleSourceChange} />;
      case 'analytics': return <Analytics sourceId={activeSourceId} />;
      case 'alerts': return <Alerts activeSourceId={activeSourceId} alerts={alerts} onDismiss={dismissAlert} />;
      case 'settings': return <SystemSettings userName={userName} setUserName={setUserName} userEmail={userEmail} setUserEmail={setUserEmail} />;
      case 'profile': return <Profile sources={sources} userName={userName} onAddSource={addSource} onEditName={setUserName} onDeleteSource={deleteSource} />;
      default: return <Dashboard data={waterData} source={activeSource} sources={sources} onSourceChange={handleSourceChange} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 lg:translate-x-0 lg:static lg:block ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-sky-500 p-2 rounded-lg shadow-lg shadow-sky-500/20">
                <Droplets className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">AquaSense</h1>
            </div>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.count ? <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">{item.count}</span> : null}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2">
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-500" />}
                <span>{isDarkMode ? 'Light' : 'Dark'} Mode</span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isDarkMode ? 'bg-sky-500' : 'bg-slate-300'}`}>
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-4' : ''}`} />
              </div>
            </button>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Live IoT Feed</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 -ml-2 text-slate-500" onClick={() => setSidebarOpen(true)}><Menu className="w-6 h-6" /></button>
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Source</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{activeSource.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Sync</span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{waterData.timestamp}</span>
            </div>
            <button 
              onClick={() => setActiveTab('profile')}
              className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-800/50 transition-colors"
            >
              {userName.charAt(0)}
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto scroll-smooth">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;
