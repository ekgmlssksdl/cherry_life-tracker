import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { ColorBox } from '@/app/components/ColorBox';
import { DayDetail } from '@/app/components/DayDetail';

interface MonthlyHabitTrackerProps {
  onViewChange: (view: 'weekly' | 'monthly' | 'yearly') => void;
  onSelectDate: (date: string) => void;
}

export const MonthlyHabitTracker: React.FC<MonthlyHabitTrackerProps> = ({ onViewChange, onSelectDate }) => {
  const { exercises, catCares, supplements, languageStudies, supplementItems, languageItems } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDayDetail, setShowDayDetail] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // 해빗 카드 데이터
  const habitCards = [
    {
      id: 'litter-box',
      label: '대소변',
      color: 'bg-amber-100',
      activeColor: 'bg-amber-300',
      check: (day: number) => {
        const dateStr = formatDateString(new Date(year, month, day));
        const care = catCares.find(c => c.date === dateStr);
        return care && (care.stoolCount > 0 || care.urineCount > 0);
      },
      getCount: (day: number) => {
        const dateStr = formatDateString(new Date(year, month, day));
        const care = catCares.find(c => c.date === dateStr);
        return (care?.stoolCount || 0) + (care?.urineCount || 0);
      }
    },
    {
      id: 'food',
      label: '사료',
      color: 'bg-pink-100',
      activeColor: 'bg-pink-300',
      check: (day: number) => {
        const dateStr = formatDateString(new Date(year, month, day));
        const care = catCares.find(c => c.date === dateStr);
        return care && care.foodRemaining > 0;
      },
      getCount: (day: number) => {
        const dateStr = formatDateString(new Date(year, month, day));
        const care = catCares.find(c => c.date === dateStr);
        if (care && care.foodRemaining !== undefined && care.foodRemaining !== null && care.foodRemaining > 0) {
          return care.foodRemaining;
        }
        return 0;
      }
    },
    {
      id: 'cat-supplements',
      label: '영양제',
      color: 'bg-purple-100',
      activeColor: 'bg-purple-300',
      check: (day: number) => {
        const dateStr = formatDateString(new Date(year, month, day));
        const care = catCares.find(c => c.date === dateStr);
        return care && care.supplements;
      },
      getCount: () => 0
    },
    {
      id: 'exercise',
      label: '운동',
      color: 'bg-rose-100',
      activeColor: 'bg-rose-300',
      check: (day: number) => {
        const dateStr = formatDateString(new Date(year, month, day));
        return exercises.some(e => e.date === dateStr);
      },
      getCount: () => 0
    },
    {
      id: 'supplements',
      label: '영양제 섭취',
      color: 'bg-teal-100',
      activeColor: 'bg-teal-300',
      check: (day: number) => {
        const dateStr = formatDateString(new Date(year, month, day));
        const supplement = supplements.find(s => s.date === dateStr);
        return supplement && supplement.checkedSupplementIds && supplement.checkedSupplementIds.length > 0;
      },
      getCount: () => 0
    },
    {
      id: 'language',
      label: '언어 공부',
      color: 'bg-violet-100',
      activeColor: 'bg-violet-300',
      check: (day: number) => {
        const dateStr = formatDateString(new Date(year, month, day));
        const study = languageStudies.find(s => s.date === dateStr);
        return study && study.checkedLanguageIds && study.checkedLanguageIds.length > 0;
      },
      getCount: () => 0
    },
  ];

  const handleDayClick = (day: number) => {
    const dateStr = formatDateString(new Date(year, month, day));
    onSelectDate(dateStr);
    setSelectedDate(dateStr);
    setShowDayDetail(true);
  };

  // 달력 그리드 생성
  const renderCalendarGrid = (habit: typeof habitCards[0]) => {
    const days = [];
    
    // 빈 셀 추가 (첫 주 시작 전)
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square" />
      );
    }
    
    // 날짜 셀 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const hasActivity = habit.check(day);
      const today = isToday(day);
      
      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          className={`
            aspect-square rounded text-[10px] font-medium transition-all
            ${hasActivity ? habit.activeColor + ' text-white' : habit.color + ' text-gray-600'}
            ${today ? 'ring-2 ring-rose-500' : ''}
            hover:scale-110
          `}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  // 통계 계산
  const getStats = (habit: typeof habitCards[0]) => {
    let completedDays = 0;
    let totalCount = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      if (habit.check(day)) {
        completedDays++;
        totalCount += habit.getCount(day);
      }
    }
    
    const percentage = daysInMonth > 0 ? ((completedDays / daysInMonth) * 100).toFixed(1) : '0.0';
    
    return { percentage, completedDays, totalCount };
  };

  return (
    <div className="min-h-screen p-3 pb-20 pt-[24px]" style={{ background: '#FFF5F7', fontFamily: 'OngleipParkDahyeon, sans-serif' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <h1 className="text-xl font-bold text-center mb-2" style={{ color: '#E63946' }}>
            월간 해빗 트래커 🍒
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
              className="text-sm font-bold text-gray-900 border-b-2 border-rose-500 pb-1"
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

          {/* Month Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={prevMonth}
              variant="ghost"
              className="rounded-full hover:bg-white h-8 w-8 p-0"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Button>
            
            <div className="bg-yellow-100 rounded-full px-6 py-2">
              <span className="text-sm font-bold text-gray-900">
                {year} {monthNames[month]}
              </span>
            </div>
            
            <Button
              onClick={nextMonth}
              variant="ghost"
              className="rounded-full hover:bg-white h-8 w-8 p-0"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </motion.div>

        {/* Habit Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {habitCards.map((habit, index) => {
            const stats = getStats(habit);
            
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-3 shadow-sm border"
              >
                {/* Card Header */}
                <div className="mb-3">
                  <span className="text-sm font-bold text-gray-900">
                    {['litter-box', 'food', 'cat-supplements'].includes(habit.id) 
                      ? `고양이 케어 - ${habit.label}` 
                      : habit.label}
                  </span>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {(() => {
                    const days = [];
                    // Empty cells
                    for (let i = 0; i < firstDayOfWeek; i++) {
                      days.push(<div key={`empty-${i}`} className="aspect-square" />);
                    }
                    // Day cells
                    for (let day = 1; day <= daysInMonth; day++) {
                      const hasActivity = habit.check(day);
                      const today = isToday(day);
                      const dateObj = new Date(year, month, day);
                      const isFuture = dateObj > new Date();
                      const dateStr = formatDateString(new Date(year, month, day));

                      // Calculate achievement rate for supplements and language
                      let bgColorClass = habit.color;
                      let textContent: any = day;

                      if (hasActivity) {
                        // 영양제 섭취 - 달성률에 따라 색상 농도 조절
                        if (habit.id === 'supplements') {
                          const supplement = supplements.find(s => s.date === dateStr);
                          if (supplement && supplementItems.length > 0) {
                            const checkedCount = supplement.checkedSupplementIds?.length || 0;
                            const totalCount = supplementItems.length;
                            const percentage = (checkedCount / totalCount) * 100;
                            
                            if (percentage === 100) bgColorClass = 'bg-teal-500'; // 100% - 가장 진하게
                            else if (percentage >= 75) bgColorClass = 'bg-teal-400'; // 75% 이상
                            else if (percentage >= 50) bgColorClass = 'bg-teal-300'; // 50% 이상
                            else if (percentage >= 25) bgColorClass = 'bg-teal-200'; // 25% 이상
                            else bgColorClass = 'bg-teal-100'; // 25% 미만
                          }
                          textContent = ''; // 색상만
                        }
                        // 언어 공부 - 달성률에 따라 색상 농도 조절
                        else if (habit.id === 'language') {
                          const study = languageStudies.find(s => s.date === dateStr);
                          if (study && languageItems.length > 0) {
                            const checkedCount = study.checkedLanguageIds?.length || 0;
                            const totalCount = languageItems.length;
                            const percentage = (checkedCount / totalCount) * 100;
                            
                            if (percentage === 100) bgColorClass = 'bg-violet-500'; // 100% - 가장 진하게
                            else if (percentage >= 75) bgColorClass = 'bg-violet-400'; // 75% 이상
                            else if (percentage >= 50) bgColorClass = 'bg-violet-300'; // 50% 이상
                            else if (percentage >= 25) bgColorClass = 'bg-violet-200'; // 25% 이상
                            else bgColorClass = 'bg-violet-100'; // 25% 미만
                          }
                          textContent = ''; // 색상만
                        }
                        // 대소변 - 숫자로 표시 (대변/소변)
                        else if (habit.id === 'litter-box') {
                          const care = catCares.find(c => c.date === dateStr);
                          // hasActivity가 true일 때만 여기 들어오므로 이미 0이 아님
                          if (care) {
                            // 대변만 본 날
                            if (care.stoolCount > 0 && care.urineCount === 0) {
                              bgColorClass = 'bg-amber-600';
                            }
                            // 소변만 본 날
                            else if (care.stoolCount === 0 && care.urineCount > 0) {
                              bgColorClass = 'bg-sky-500';
                            }
                            // 둘 다 본 날
                            else if (care.stoolCount > 0 && care.urineCount > 0) {
                              bgColorClass = 'bg-purple-500';
                            }
                            
                            // 대각선으로 표시
                            textContent = (
                              <div className="relative w-full h-full flex items-center justify-center">
                                <span className="absolute top-0 left-0.5 text-[9px] font-bold">{care.stoolCount}</span>
                                <span className="text-[10px]">/</span>
                                <span className="absolute bottom-0 right-0.5 text-[9px] font-bold">{care.urineCount}</span>
                              </div>
                            );
                          }
                        }
                        // 사료 - 먹은 양 숫자로만
                        else if (habit.id === 'food') {
                          const care = catCares.find(c => c.date === dateStr);
                          if (care && care.foodRemaining !== undefined && care.foodRemaining !== null && care.foodRemaining > 0) {
                            bgColorClass = habit.activeColor;
                            textContent = care.foodRemaining; // 입력한 값 그대로
                          }
                        }
                        // 고양이 영양제 - 먹었으면 진하게
                        else if (habit.id === 'cat-supplements') {
                          bgColorClass = 'bg-purple-500'; // 진하게
                          textContent = ''; // 색상만
                        }
                        // 운동 - 종류에 따라 색상 다르게
                        else if (habit.id === 'exercise') {
                          const ex = exercises.find(e => e.date === dateStr);
                          if (ex?.type === 'pilates') bgColorClass = 'bg-rose-500'; // 필라테스 - 로즈
                          else if (ex?.type === 'swimming') bgColorClass = 'bg-blue-500'; // 수영 - 블루
                          else bgColorClass = 'bg-orange-500'; // 기타 운동 - 오렌지
                          textContent = ''; // 색상만
                        }
                      }

                      days.push(
                        <button
                          key={day}
                          onClick={() => !isFuture && handleDayClick(day)}
                          disabled={isFuture}
                          className={`
                            aspect-square rounded text-[10px] font-medium transition-all flex items-center justify-center
                            ${hasActivity ? bgColorClass + ' text-white' : habit.color + ' text-gray-600'}
                            ${today ? 'ring-2 ring-rose-500' : ''}
                            ${!isFuture ? 'hover:scale-110' : 'opacity-30 cursor-not-allowed'}
                          `}
                        >
                          {textContent}
                        </button>
                      );
                    }
                    return days;
                  })()}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center">
                      <span className="text-white text-[8px]">✓</span>
                    </div>
                    <span className="text-gray-600">{stats.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-orange-300 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">#</span>
                    </div>
                    <span className="text-gray-600">
                      {stats.totalCount > 0 ? stats.totalCount : stats.completedDays}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Day Detail */}
        <AnimatePresence>
          {showDayDetail && selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-2xl p-4 shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">
                    {new Date(selectedDate).toLocaleDateString('ko-KR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      weekday: 'long'
                    })}
                  </h2>
                  <Button
                    onClick={() => setShowDayDetail(false)}
                    variant="ghost"
                    className="rounded-full hover:bg-gray-100 h-8 w-8 p-0"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </Button>
                </div>
                <DayDetail date={selectedDate} isModal={true} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};