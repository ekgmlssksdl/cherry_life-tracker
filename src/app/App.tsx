import React, { useState } from 'react';
import { AppProvider } from '@/app/context/AppContext';
import { Home } from '@/app/components/Home';
import { Calendar } from '@/app/components/Calendar';
import { MonthlyHabitTracker } from '@/app/components/MonthlyHabitTracker';
import { WeeklyHabitTracker } from '@/app/components/WeeklyHabitTracker';
import { YearlyHabitTracker } from '@/app/components/YearlyHabitTracker';
import { Home as HomeIcon, Calendar as CalendarIcon, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

type View = 'home' | 'calendar' | 'weeklyHabit' | 'monthlyHabit' | 'yearlyHabit';
type HabitView = 'weekly' | 'monthly' | 'yearly';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setCurrentView('home');
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleShowMonthlyHabit = () => {
    setCurrentView('monthlyHabit');
  };

  const handleBackToCalendar = () => {
    setCurrentView('calendar');
  };

  const handleHabitViewChange = (view: HabitView) => {
    if (view === 'weekly') {
      setCurrentView('weeklyHabit');
    } else if (view === 'monthly') {
      setCurrentView('monthlyHabit');
    } else if (view === 'yearly') {
      setCurrentView('yearlyHabit');
    }
  };

  const navItems = [
    { id: 'calendar' as const, label: '캘린더', icon: CalendarIcon },
    { id: 'home' as const, label: '홈', icon: HomeIcon },
    { id: 'monthlyHabit' as const, label: '해빗 트래커', icon: BarChart3 },
  ];

  return (
    <AppProvider>
      <div className="relative min-h-screen pb-20">
        {/* Content */}
        {currentView === 'home' && <Home selectedDate={selectedDate} onDateChange={handleDateChange} />}
        {currentView === 'calendar' && <Calendar onSelectDate={handleDateSelect} onShowMonthlyHabit={handleShowMonthlyHabit} />}
        {currentView === 'weeklyHabit' && <WeeklyHabitTracker onViewChange={handleHabitViewChange} onSelectDate={handleDateSelect} />}
        {currentView === 'monthlyHabit' && <MonthlyHabitTracker onViewChange={handleHabitViewChange} onSelectDate={handleDateSelect} />}
        {currentView === 'yearlyHabit' && <YearlyHabitTracker onViewChange={handleHabitViewChange} onSelectDate={handleDateSelect} />}

        {/* Bottom Navigation */}
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50"
          style={{ borderTopColor: '#FFB3C1' }}
        >
          <div className="max-w-3xl mx-auto px-6 py-3">
            <div className="flex items-center justify-around gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentView(item.id)}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                      isActive ? 'bg-red-50' : ''
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? 'text-red-500' : 'text-gray-400'}`} />
                    <span className={`text-xs font-medium ${isActive ? 'text-red-500' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.nav>
      </div>
    </AppProvider>
  );
};

export default App;