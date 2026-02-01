import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion } from 'motion/react';
import { ColorBox } from '@/app/components/ColorBox';

interface YearlyHabitTrackerProps {
  onViewChange: (view: 'weekly' | 'monthly' | 'yearly') => void;
  onSelectDate: (date: string) => void;
}

export const YearlyHabitTracker: React.FC<YearlyHabitTrackerProps> = ({ onViewChange, onSelectDate }) => {
  const { exercises, catCares } = useApp();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const prevYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const nextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // 해빗 데이터
  const habits = [
    {
      id: 'poop',
      label: '대변',
      color: 'bg-amber-100',
      activeColor: 'bg-amber-400',
      check: (date: Date) => {
        const dateStr = formatDateString(date);
        const care = catCares.find(c => c.date === dateStr);
        return care && care.stoolCount > 0;
      },
    },
    {
      id: 'urine',
      label: '소변',
      color: 'bg-blue-100',
      activeColor: 'bg-blue-400',
      check: (date: Date) => {
        const dateStr = formatDateString(date);
        const care = catCares.find(c => c.date === dateStr);
        return care && care.urineCount > 0;
      },
    },
    {
      id: 'food',
      label: '사료',
      color: 'bg-pink-100',
      activeColor: 'bg-pink-400',
      check: (date: Date) => {
        const dateStr = formatDateString(date);
        const care = catCares.find(c => c.date === dateStr);
        return care && (500 - care.foodRemaining) > 0;
      },
    },
    {
      id: 'pill',
      label: '영양제',
      color: 'bg-emerald-100',
      activeColor: 'bg-emerald-400',
      check: (date: Date) => {
        const dateStr = formatDateString(date);
        const care = catCares.find(c => c.date === dateStr);
        return care && care.supplements;
      },
    },
    {
      id: 'swimming',
      label: '수영',
      color: 'bg-cyan-100',
      activeColor: 'bg-cyan-400',
      check: (date: Date) => {
        const dateStr = formatDateString(date);
        return exercises.some(e => e.date === dateStr && e.type === 'swimming');
      },
    },
    {
      id: 'pilates',
      label: '필라테스',
      color: 'bg-purple-100',
      activeColor: 'bg-purple-400',
      check: (date: Date) => {
        const dateStr = formatDateString(date);
        return exercises.some(e => e.date === dateStr && e.type === 'pilates');
      },
    },
  ];

  // 월별 완료율 계산
  const getMonthStats = (habit: typeof habits[0], month: number) => {
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    let completedDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, month, day);
      if (habit.check(date)) {
        completedDays++;
      }
    }

    const percentage = daysInMonth > 0 ? ((completedDays / daysInMonth) * 100).toFixed(0) : '0';
    return { completedDays, daysInMonth, percentage };
  };

  // 연간 총 완료율 계산
  const getYearStats = (habit: typeof habits[0]) => {
    let totalCompleted = 0;
    let totalDays = 0;

    for (let month = 0; month < 12; month++) {
      const stats = getMonthStats(habit, month);
      totalCompleted += stats.completedDays;
      totalDays += stats.daysInMonth;
    }

    const percentage = totalDays > 0 ? ((totalCompleted / totalDays) * 100).toFixed(0) : '0';
    return { totalCompleted, totalDays, percentage };
  };

  const handleMonthClick = (month: number) => {
    // 해당 월의 첫 날로 이동
    const firstDay = new Date(currentYear, month, 1);
    const dateStr = formatDateString(firstDay);
    onSelectDate(dateStr);
  };

  return (
    <div className="min-h-screen p-3 pb-20 pt-[24px]" style={{ background: '#FFF5F7', fontFamily: 'OngleipParkDahyeon, sans-serif' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h1 className="text-xl font-bold text-center mb-2" style={{ color: '#E63946' }}>
            연간 해빗 트래커 🍒
          </h1>
          
          {/* Tabs */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button 
              onClick={() => onViewChange('weekly')}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Weekly
            </button>
            <button 
              onClick={() => onViewChange('monthly')}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Monthly
            </button>
            <button 
              onClick={() => onViewChange('yearly')}
              className="text-sm font-bold text-gray-900 border-b-2 border-rose-500 pb-1"
            >
              Yearly
            </button>
          </div>

          {/* Year Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={prevYear}
              variant="ghost"
              className="rounded-full hover:bg-white h-8 w-8 p-0"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Button>
            
            <div className="bg-yellow-100 rounded-full px-6 py-2">
              <span className="text-sm font-bold text-gray-900">
                {currentYear}
              </span>
            </div>
            
            <Button
              onClick={nextYear}
              variant="ghost"
              className="rounded-full hover:bg-white h-8 w-8 p-0"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </motion.div>

        {/* Habit Cards */}
        <div className="space-y-3">
          {habits.map((habit, index) => {
            const yearStats = getYearStats(habit);
            
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm border"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ColorBox color={habit.color} />
                    <span className="text-sm font-bold text-gray-900">
                      {['poop', 'urine', 'food', 'pill'].includes(habit.id) 
                        ? `고양이 케어 - ${habit.label}` 
                        : habit.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {yearStats.totalCompleted}/{yearStats.totalDays}
                    </span>
                    <span className="text-xs font-bold text-emerald-500">{yearStats.percentage}%</span>
                  </div>
                </div>

                {/* Year Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 12 }, (_, month) => {
                    const stats = getMonthStats(habit, month);
                    const hasActivity = stats.completedDays > 0;
                    const intensity = parseInt(stats.percentage) / 100;
                    
                    // 강도에 따른 색상 조정
                    let bgColor = habit.color;
                    if (hasActivity) {
                      if (intensity > 0.8) bgColor = habit.activeColor;
                      else if (intensity > 0.5) bgColor = habit.activeColor.replace('400', '300');
                      else if (intensity > 0.2) bgColor = habit.activeColor.replace('400', '200');
                    }
                    
                    return (
                      <button
                        key={month}
                        onClick={() => handleMonthClick(month)}
                        className={`
                          flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                          ${bgColor}
                          ${hasActivity ? 'text-gray-900' : 'text-gray-500'}
                          hover:scale-105 hover:shadow-md
                        `}
                      >
                        <span className="text-[10px] font-medium">{monthNames[month]}</span>
                        <span className="text-xs font-bold">{stats.percentage}%</span>
                        <span className="text-[9px]">{stats.completedDays}일</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};