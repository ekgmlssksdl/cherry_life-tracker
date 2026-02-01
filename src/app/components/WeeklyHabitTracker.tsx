import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion } from 'motion/react';
import { ColorBox } from '@/app/components/ColorBox';

interface WeeklyHabitTrackerProps {
  onViewChange: (view: 'weekly' | 'monthly' | 'yearly') => void;
  onSelectDate: (date: string) => void;
}

export const WeeklyHabitTracker: React.FC<WeeklyHabitTrackerProps> = ({ onViewChange, onSelectDate }) => {
  const { exercises, catCares } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  // 주의 시작일 계산 (일요일 기준)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentDate);
  
  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // 주의 날짜 배열 생성
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  const weekDayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // 주 범위 표시
  const weekRangeText = () => {
    const endDate = new Date(weekStart);
    endDate.setDate(weekStart.getDate() + 6);
    return `${weekStart.getMonth() + 1}/${weekStart.getDate()} - ${endDate.getMonth() + 1}/${endDate.getDate()}`;
  };

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
      getCount: (date: Date) => {
        const dateStr = formatDateString(date);
        const care = catCares.find(c => c.date === dateStr);
        return care?.stoolCount || 0;
      }
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
      getCount: (date: Date) => {
        const dateStr = formatDateString(date);
        const care = catCares.find(c => c.date === dateStr);
        return care?.urineCount || 0;
      }
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
      getCount: (date: Date) => {
        const dateStr = formatDateString(date);
        const care = catCares.find(c => c.date === dateStr);
        return care ? (500 - care.foodRemaining) : 0;
      }
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
      getCount: () => 0
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
      getCount: () => 0
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
      getCount: () => 0
    },
  ];

  const handleDayClick = (date: Date) => {
    const dateStr = formatDateString(date);
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
            주간 해빗 트래커 🍒
          </h1>
          
          {/* Tabs */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button 
              onClick={() => onViewChange('weekly')}
              className="text-sm font-bold text-gray-900 border-b-2 border-rose-500 pb-1"
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
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Yearly
            </button>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={prevWeek}
              variant="ghost"
              className="rounded-full hover:bg-white h-8 w-8 p-0"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Button>
            
            <div className="bg-yellow-100 rounded-full px-6 py-2">
              <span className="text-sm font-bold text-gray-900">
                {weekRangeText()}
              </span>
            </div>
            
            <Button
              onClick={nextWeek}
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
            const completedDays = weekDays.filter(day => habit.check(day)).length;
            const percentage = ((completedDays / 7) * 100).toFixed(0);
            
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
                    <span className="text-xs text-gray-500">{completedDays}/7</span>
                    <span className="text-xs font-bold text-emerald-500">{percentage}%</span>
                  </div>
                </div>

                {/* Week Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, i) => {
                    const hasActivity = habit.check(day);
                    const today = isToday(day);
                    const count = habit.getCount(day);
                    
                    return (
                      <button
                        key={i}
                        onClick={() => handleDayClick(day)}
                        className={`
                          flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                          ${hasActivity ? habit.activeColor + ' text-white' : habit.color + ' text-gray-600'}
                          ${today ? 'ring-2 ring-rose-500' : ''}
                          hover:scale-105
                        `}
                      >
                        <span className="text-[10px] font-medium">{weekDayNames[i]}</span>
                        <span className="text-base font-bold">{day.getDate()}</span>
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