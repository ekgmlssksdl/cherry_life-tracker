import React, { useState } from 'react';
import { useApp, Event } from '@/app/context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { ColorBox } from '@/app/components/ColorBox';

interface CalendarProps {
  onSelectDate: (date: string) => void;
  onShowMonthlyHabit?: () => void;
}

export const Calendar: React.FC<CalendarProps> = ({ onSelectDate, onShowMonthlyHabit }) => {
  const { dayLogs, exercises, catCares, events, supplements, languageStudies } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    // 오늘이 포된 주의 일요일 찾기
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    return sunday;
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const nextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToToday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    setCurrentWeekStart(sunday);
  };

  // 현재 주의 7일 가져오기
  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 날짜 문자열을 day 숫자로 변환
  const getDay = (dateString: string): number => {
    const date = new Date(dateString);
    if (date.getFullYear() === year && date.getMonth() === month) {
      return date.getDate();
    }
    return 0;
  };

  // 날짜의 grid position 계산 (0-based)
  const getGridPosition = (day: number): { row: number; col: number } => {
    const position = startDayOfWeek + day - 1;
    const row = Math.floor(position / 7);
    const col = position % 7;
    return { row, col };
  };

  // 반복 일정을 포함하여 모든 이벤트 생성
  const generateRecurringEvents = (start: Date, end: Date): Event[] => {
    const allEvents: Event[] = [];
    const dayMap: { [key: string]: number } = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };

    events.forEach((event: Event) => {
      if (!event.recurrence || event.recurrence.type === 'none') {
        // 반복이 없는 일정은 그대로 추가
        allEvents.push(event);
        return;
      }

      const eventStart = new Date(event.date);
      const recurrence = event.recurrence;
      
      // 이벤트의 종료 날짜 확인 (반복 종료 날짜)
      const eventEndDate = event.endDate ? new Date(event.endDate) : null;
      
      // 반복이 weekly이고 weekDays가 지정된 경우
      if (recurrence.type === 'weekly' && recurrence.weekDays && recurrence.weekDays.length > 0) {
        // 반복이 종료되는 날짜 (이벤트의 endDate 또는 캘린더 범위의 끝)
        const repeatEndDate = eventEndDate || end;
        
        // 시작 날짜부터 종료 날짜까지 하루씩 순회
        let currentDate = new Date(eventStart);
        
        let count = 0;
        const MAX_COUNT = 1000;
        
        while (currentDate <= repeatEndDate && currentDate <= end && count < MAX_COUNT) {
          count++;
          
          const currentDayOfWeek = currentDate.getDay();
          
          // 지정된 요일 중 하나와 일치하는지 확인
          const matchesWeekDay = recurrence.weekDays.some(day => dayMap[day] === currentDayOfWeek);
          
          if (matchesWeekDay && currentDate >= start) {
            const dateStr = formatDateString(currentDate);
            // 반복 일정의 각 occurrence는 단일 날짜로 저장 (endDate 제거)
            allEvents.push({
              ...event,
              id: `${event.id}_${dateStr}`,
              date: dateStr,
              endDate: undefined, // 각 occurrence는 하루짜리 일정으로 처리
            });
          }
          
          // 다음 날로 이동
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return; // weekly는 여기서 처리 완료
      }
      
      // 다른 반복 타입들 (monthly, yearly, custom)
      let currentIterDate = new Date(eventStart);
      
      // 최적화: 반복 시작점이 범위보다 한참 전이면 점프 (간단한 구현을 위해 생략하고 순차 계산)
      if (eventStart > end) return;

      // 무한 루프 방지
      let count = 0;
      const MAX_COUNT = 1000;

      while (currentIterDate <= end && count < MAX_COUNT) {
        count++;
        
        // 이벤트의 endDate를 넘어서면 중단
        if (eventEndDate && currentIterDate > eventEndDate) {
          break;
        }
        
        // 현재 반복 날짜가 범위(start~end) 내에 있고, 시작일(eventStart) 이후인 경우 추가
        if (currentIterDate >= start && currentIterDate >= eventStart) {
          const dateStr = formatDateString(currentIterDate);
          // 반복 일정의 각 occurrence는 단일 날짜로 저장
          allEvents.push({
            ...event,
            id: `${event.id}_${dateStr}`,
            date: dateStr,
            endDate: undefined, // 각 occurrence는 하루짜리 일정으로 처리
          });
        }

        // 다음 날짜 계산
        if (recurrence.type === 'monthly') {
          // 월간 반복 (매월 같은 일)
          currentIterDate.setMonth(currentIterDate.getMonth() + 1);
        } else if (recurrence.type === 'yearly') {
          // 연간 반복
          currentIterDate.setFullYear(currentIterDate.getFullYear() + 1);
        } else if (recurrence.type === 'custom' && recurrence.interval && recurrence.unit) {
          // 커스텀 반복
          const interval = recurrence.interval;
          switch (recurrence.unit) {
            case 'day':
              currentIterDate.setDate(currentIterDate.getDate() + interval);
              break;
            case 'week':
              currentIterDate.setDate(currentIterDate.getDate() + (interval * 7));
              break;
            case 'month':
              currentIterDate.setMonth(currentIterDate.getMonth() + interval);
              break;
            case 'year':
              currentIterDate.setFullYear(currentIterDate.getFullYear() + interval);
              break;
          }
        } else {
          // 기본 1주일 (안전장치)
           currentIterDate.setDate(currentIterDate.getDate() + 7);
        }
      }
    });

    return allEvents;
  };

  const getActivities = (day: number) => {
    const dateString = formatDateString(new Date(year, month, day));
    const catCare = catCares.find(c => c.date === dateString);
    const dayLog = dayLogs.find(log => log.date === dateString);
    const dayExercises = exercises.filter(e => e.date === dateString);
    
    // 참고: 여기서는 캘린더 그리드 렌더링에 사용되는 events를 반환하지 않습니다.
    // getEventSegments에서 계산된 expandedEvents를 사용하여 캘린더에 표시합니다.
    return {
      dayLog,
      catCare,
      exercises: dayExercises,
    };
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() && 
           date.getMonth() === today.getMonth() && 
           date.getDate() === today.getDate();
  };

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-[60px] border-r border-b border-gray-200" />);
  }

  // 일정 색상들
  const eventColors = [
    { bg: 'bg-pink-200', text: 'text-pink-800' },
    { bg: 'bg-purple-200', text: 'text-purple-800' },
    { bg: 'bg-blue-200', text: 'text-blue-800' },
    { bg: 'bg-teal-200', text: 'text-teal-800' },
    { bg: 'bg-amber-200', text: 'text-amber-800' },
    { bg: 'bg-rose-200', text: 'text-rose-800' },
    { bg: 'bg-indigo-200', text: 'text-indigo-800' },
    { bg: 'bg-emerald-200', text: 'text-emerald-800' },
  ];

  const getEventColor = (eventId: string) => {
    // ID가 문자열일 수 있으므로 해시코드 비슷하게 처리하거나 단순화
    let hash = 0;
    for (let i = 0; i < eventId.length; i++) {
      hash = eventId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % eventColors.length;
    return eventColors[index];
  };

  // 이벤트를 주 단위로 분할
  interface EventSegment {
    event: Event;
    startDay: number;
    endDay: number;
    row: number;
    startCol: number;
    endCol: number;
  }

  const getEventSegments = (): EventSegment[] => {
    const segments: EventSegment[] = [];
    
    // 현재 월 범위
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    // 반복 일정을 포함한 모든 이벤트 생성
    const expandedEvents = generateRecurringEvents(
      new Date(year, month, 1), // 시작일
      new Date(year, month + 1, 0) // 종료일
    );
    
    // 현재 월의 이벤트만 필터링
    const monthEvents = expandedEvents.filter(e => {
      const eventStart = new Date(e.date);
      const eventEnd = new Date(e.endDate || e.date);
      return eventEnd >= monthStart && eventStart <= monthEnd;
    });

    monthEvents.forEach(event => {
      const eventStartDate = new Date(event.date);
      const eventEndDate = new Date(event.endDate || event.date);
      
      // 현재 월 범위로 제한
      let startDay = getDay(event.date);
      // 지난달에서 넘어온 경우
      if (startDay === 0 && eventStartDate < monthStart) {
        startDay = 1;
      }
      
      let endDay = getDay(event.endDate || event.date);
      // 다음달로 넘어가는 경우
      if (endDay === 0 && eventEndDate > monthEnd) {
        endDay = daysInMonth;
      }
      
      if (startDay === 0 && endDay === 0) return;
      if (startDay === 0) startDay = 1;
      if (endDay === 0) endDay = daysInMonth;
      
      const startPos = getGridPosition(startDay);
      const endPos = getGridPosition(endDay);
      
      // 같은 주에 있으면 하나의 segment
      if (startPos.row === endPos.row) {
        segments.push({
          event,
          startDay,
          endDay,
          row: startPos.row,
          startCol: startPos.col,
          endCol: endPos.col,
        });
      } else {
        // 여러 주에 걸쳐있으면 주별로 분할
        let currentDay = startDay;
        let currentRow = startPos.row;
        
        while (currentDay <= endDay) {
          const currentPos = getGridPosition(currentDay);
          const weekEndCol = 6;
          const weekEndDay = currentDay + (weekEndCol - currentPos.col);
          const segmentEndDay = Math.min(weekEndDay, endDay);
          const segmentEndPos = getGridPosition(segmentEndDay);
          
          segments.push({
            event,
            startDay: currentDay,
            endDay: segmentEndDay,
            row: currentRow,
            startCol: currentPos.col,
            endCol: segmentEndPos.col,
          });
          
          currentDay = segmentEndDay + 1;
          currentRow++;
        }
      }
    });
    
    return segments;
  };

  const eventSegments = getEventSegments();

  for (let day = 1; day <= daysInMonth; day++) {
    const activities = getActivities(day);
    const today = isToday(new Date(year, month, day));
    const dateString = formatDateString(new Date(year, month, day));
    
    // 현재 날짜에 해당하는 일정 segments 찾기
    const daySegments = eventSegments.filter(seg => 
      day >= seg.startDay && day <= seg.endDay && 
      getGridPosition(day).row === seg.row
    );
    
    // 일정 길이 순으로 정렬 (짧은 것 먼저, 긴 것 나중에)
    daySegments.sort((a, b) => {
      const aDuration = getDay(a.event.endDate || a.event.date) - getDay(a.event.date);
      const bDuration = getDay(b.event.endDate || b.event.date) - getDay(b.event.date);
      if (aDuration !== bDuration) {
        return aDuration - bDuration; // 짧은 일정이 위로
      }
      return getDay(a.event.date) - getDay(b.event.date); // 같으면 시작일 빠른 순
    });
    
    days.push(
      <motion.button
        key={day}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onSelectDate(dateString)}
        className={`
          min-h-[60px] p-1.5 relative overflow-visible transition-all flex flex-col border-r border-b
          ${today ? 'bg-rose-100 border-rose-400 shadow-[inset_0_0_0_1.5px_#E63946]' : activities.dayLog?.photo ? 'border-pink-400 bg-white hover:bg-rose-50' : 'border-gray-200 bg-white hover:bg-rose-50'}
        `}
        style={activities.dayLog?.photo ? {
          backgroundImage: `url(${activities.dayLog.photo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}}
      >
        {/* 사진이 있을 때 오버레이 추가 */}
        {activities.dayLog?.photo && (
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
        )}
        
        {/* 날짜 숫자 */}
        <div className="relative z-10 flex items-start gap-1 mb-1">
          <span className={`font-semibold text-sm ${today ? 'text-rose-600' : activities.dayLog?.photo ? 'text-gray-900 drop-shadow' : 'text-gray-900'}`}>
            {day}
          </span>
          {/* 특이사항 표시 */}
          {activities.catCare && (activities.catCare.vomitTypes || activities.catCare.stoolConditions || activities.catCare.abnormalityMemo) && (() => {
            // 더 보기의 심각한 구토 타입
            const seriousVomitTypes = ['핑크', '짙은갈색', '녹색', '이물질', '빨강'];
            const hasSeriousVomit = activities.catCare.vomitTypes?.some(v => seriousVomitTypes.includes(v.type));
            
            // 일반 구토 타입 (기본 5개)
            const normalVomitTypes = ['투명', '빽빽(거품)', '사료토', '헛역질', '노랑'];
            const hasNormalVomit = activities.catCare.vomitTypes?.some(v => normalVomitTypes.includes(v.type));
            
            const hasStool = activities.catCare.stoolConditions && activities.catCare.stoolConditions.length > 0;
            const hasMemo = activities.catCare.abnormalityMemo;
            
            let dotColor = 'bg-gray-500'; // 기본: 메모만 있는 경우
            
            // 우선순위: 둘 다 > 심각한 구토 > 일반 구토 > 변 상태 > 메모만
            if ((hasSeriousVomit || hasNormalVomit) && hasStool) {
              dotColor = 'bg-orange-500'; // 구토 + 변 상태 둘 다 → 주황색
            } else if (hasSeriousVomit) {
              dotColor = 'bg-red-500'; // 심각한 구토만 → 빨간색
            } else if (hasNormalVomit) {
              dotColor = 'bg-yellow-500'; // 일반 구토만 → 노란색
            } else if (hasStool) {
              dotColor = 'bg-amber-700'; // 변 상태만 → 갈색
            }
            // else: 메모만 있으면 회색 (기본값)
            
            return (
              <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${dotColor}`} />
            );
          })()}
        </div>
        
        {/* 일기 메모 (20자 이하만 표시) */}
        {activities.dayLog?.memo && activities.dayLog.memo.length <= 20 && activities.dayLog.showInCalendar !== false && (
          <div className="relative z-10 px-1 py-0.5 text-[9px] text-gray-700 leading-tight">
            {activities.dayLog.memo}
          </div>
        )}
        
        {/* 일정  - 하단 */}
        <div className="relative z-10 mt-auto mb-0 flex flex-col gap-0.5 -mb-1.5">
          {daySegments.map((segment, idx) => {
            const color = getEventColor(segment.event.id); // ID 기반 색상
            const isStartOfSegment = day === segment.startDay;
            const isEndOfSegment = day === segment.endDay;
            
            // 전체 일정의 중앙 날짜 계산
            const totalEventStart = getDay(segment.event.date);
            const totalEventEnd = getDay(segment.event.endDate || segment.event.date);
            const totalEventMiddle = Math.floor((totalEventStart + totalEventEnd) / 2);
            const isMiddleDay = day === totalEventMiddle;
            
            return (
              <div
                key={`${segment.event.id}-${idx}`}
                className={`
                  ${color.text} text-[10px] px-1 truncate pointer-events-auto cursor-pointer relative flex items-center leading-none
                  ${isStartOfSegment ? 'rounded-l' : '-ml-1.5 pl-2'}
                  ${isEndOfSegment ? 'rounded-r' : '-mr-1.5 pr-2'}
                `}
                style={{
                  height: '10px',
                }}
                title={segment.event.title}
              >
                <div className={`absolute inset-0 ${color.bg} opacity-40 ${isStartOfSegment ? 'rounded-l' : ''} ${isEndOfSegment ? 'rounded-r' : ''}`} />
                <div className="relative z-10 flex items-center justify-center w-full">
                  {isMiddleDay && (
                    <>
                      {segment.event.recurrence?.type && segment.event.recurrence.type !== 'none' && (
                        <span className="mr-0.5 text-[8px] opacity-70">↻</span>
                      )}
                      {segment.event.time && <span className="mr-0.5 text-[9px]">{segment.event.time}</span>}
                      <span className="text-[9px]">{segment.event.title}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.button>
    );
  }

  const weekDayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  // 주 범위 표시 문자열
  const getWeekRangeString = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    const formatDate = (d: Date) => `${d.getMonth() + 1}.${d.getDate()}`;
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className="min-h-screen p-3 pb-4 pt-[24px]" style={{ background: '#FFF5F7', fontFamily: 'OngleipParkDahyeon, sans-serif' }}>
      <div className="max-w-2xl mx-auto space-y-3">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-xl font-bold flex items-center justify-center gap-2" style={{ color: '#E63946' }}>
            Calendar 🍒
          </h1>
        </motion.div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-4 shadow-sm border hover:shadow-md transition-shadow"
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={prevMonth}
              variant="ghost"
              className="rounded-lg hover:bg-gray-100 h-9 w-9 p-0"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Button>
            
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                {year}년 {month + 1}월
              </h2>
              <Button
                onClick={() => setCurrentDate(new Date())}
                size="sm"
                className="rounded-full hover:bg-rose-50 h-7 w-7 p-0 text-lg"
                variant="ghost"
              >
                🍒
              </Button>
            </div>
            
            <Button
              onClick={nextMonth}
              variant="ghost"
              className="rounded-lg hover:bg-gray-100 h-9 w-9 p-0"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </Button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 border-l border-t border-gray-200">
            {weekDayLabels.map((day, index) => (
              <div
                key={day}
                className={`text-center font-semibold py-1.5 text-xs border-r border-b border-gray-200 ${
                  index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 border-l border-gray-200">
            {days}
          </div>
        </motion.div>

        {/* Habit Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => onShowMonthlyHabit && onShowMonthlyHabit()}
          className="bg-white rounded-3xl p-4 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
        >
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                prevWeek();
              }}
              variant="ghost"
              className="rounded-lg hover:bg-gray-100 h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <span className="text-sm font-bold text-gray-700">
                  {getWeekRangeString()}
                </span>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToToday();
                  }}
                  size="sm"
                  className="rounded-full hover:bg-rose-50 h-7 w-7 p-0 text-lg ml-2"
                  variant="ghost"
                >
                  🍒
                </Button>
              </div>
            </div>
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                nextWeek();
              }}
              variant="ghost"
              className="rounded-lg hover:bg-gray-100 h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </Button>
          </div>

          {/* Week Day Labels */}
          <div className="flex items-center gap-0.5 mb-0">
            {/* 라벨 영역 (왼쪽 빈 공간) */}
            <div className="w-14 flex-shrink-0" />
            
            {/* 요일 라벨 */}
            <div className="flex gap-0.5 flex-1">
              {weekDays.map((date, idx) => {
                const isTodayDate = isToday(date);
                return (
                  <div key={idx} className={`flex-1 text-center py-0.5 ${isTodayDate ? 'bg-rose-50' : ''}`}>
                    <span className="text-[10px] text-gray-500">{weekDayLabels[idx]}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-0">
            {/* 영양제 섭취 */}
            <div className="flex items-center gap-0.5">
              {/* 라벨 */}
              <div className="w-14 flex-shrink-0 flex items-center justify-start pl-1">
                <span className="text-[10px] text-gray-700">영양제</span>
              </div>
              
              {/* 날짜 셀들 (7일) */}
              <div className="flex gap-0.5 flex-1">
                {weekDays.map((date, idx) => {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const dayStr = String(date.getDate()).padStart(2, '0');
                  const dateStr = `${year}-${month}-${dayStr}`;
                  
                  const daySupplement = supplements.find(s => s.date === dateStr);
                  
                  // AppContext.tsx Supplement: probiotics, magnesium, oliveOil, other.
                  const s = daySupplement;
                  let completedCount = 0;
                  if (s) {
                    if (s.probiotics) completedCount++;
                    if (s.magnesium) completedCount++;
                    if (s.oliveOil) completedCount++;
                    if (s.other) completedCount++;
                  }
                  const totalCount = 4; // Hardcoded 4 types
                  const completionRate = s ? completedCount / totalCount : 0;
                  
                  // 달성률에 따른 색상 강도
                  let dotColor = 'bg-gray-100'; // 완료하지 않은 날
                  if (completionRate > 0) {
                    if (completionRate >= 1) dotColor = 'bg-emerald-500';
                    else if (completionRate >= 0.75) dotColor = 'bg-emerald-400';
                    else if (completionRate >= 0.5) dotColor = 'bg-emerald-300';
                    else dotColor = 'bg-emerald-200';
                  }
                  
                  const isTodayDate = isToday(date);
                  
                  return (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDate(dateStr);
                      }}
                      className={`
                        flex-1 h-8 transition-all flex items-center justify-center relative
                        ${isTodayDate ? 'bg-rose-50' : ''}
                        hover:scale-105
                      `}
                    >
                      <div className={`w-4 h-4 rounded-full transition-colors ${dotColor}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 언어 공부 */}
            <div className="flex items-center gap-0.5">
              {/* 라벨 */}
              <div className="w-14 flex-shrink-0 flex items-center justify-start pl-1">
                <span className="text-[10px] text-gray-700">언어</span>
              </div>
              
              {/* 날짜 셀들 (7일) */}
              <div className="flex gap-0.5 flex-1">
                {weekDays.map((date, idx) => {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const dayStr = String(date.getDate()).padStart(2, '0');
                  const dateStr = `${year}-${month}-${dayStr}`;
                  
                  const dayLanguage = languageStudies.find(l => l.date === dateStr);
                  
                  let count = 0;
                  if (dayLanguage) {
                    if (dayLanguage.english) count++;
                    if (dayLanguage.french) count++;
                    if (dayLanguage.japanese) count++;
                    if (dayLanguage.spanish) count++;
                  }
                  const totalLangs = 4;
                  const completionRate = count / totalLangs;
                  
                  // 달성률에 따른 색상 강도
                  let dotColor = 'bg-gray-100'; // 완료하지 않은 날
                  if (completionRate > 0) {
                    if (completionRate >= 1) dotColor = 'bg-blue-500';
                    else if (completionRate >= 0.75) dotColor = 'bg-blue-400';
                    else if (completionRate >= 0.5) dotColor = 'bg-blue-300';
                    else dotColor = 'bg-blue-200';
                  }
                  
                  const isTodayDate = isToday(date);
                  
                  return (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDate(dateStr);
                      }}
                      className={`
                        flex-1 h-8 transition-all flex items-center justify-center relative
                        ${isTodayDate ? 'bg-rose-50' : ''}
                        hover:scale-105
                      `}
                    >
                      <div className={`w-4 h-4 rounded-full transition-colors ${dotColor}`} />
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* 운동 */}
            <div className="flex items-center gap-0.5">
              {/* 라벨 */}
              <div className="w-14 flex-shrink-0 flex items-center justify-start pl-1">
                <span className="text-[10px] text-gray-700">운동</span>
              </div>
              
              {/* 날짜 셀들 (7일) */}
              <div className="flex gap-0.5 flex-1">
                {weekDays.map((date, idx) => {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const dayStr = String(date.getDate()).padStart(2, '0');
                  const dateStr = `${year}-${month}-${dayStr}`;
                  
                  // 해당 날짜의 모든 운동 가져오기
                  const dayExercises = exercises.filter(e => e.date === dateStr);
                  const exerciseCount = dayExercises.length;
                  
                  const hasSwimming = dayExercises.some(e => e.type === 'swimming');
                  const hasPilates = dayExercises.some(e => e.type === 'pilates');
                  const hasOther = dayExercises.some(e => e.type !== 'swimming' && e.type !== 'pilates');
                  const isTodayDate = isToday(date);
                  
                  // 운동 도트 색상 결정
                  let dotColor = 'bg-gray-100';
                  
                  if (exerciseCount >= 2) {
                    // 2개 이상이면 초록색
                    dotColor = 'bg-emerald-400';
                  } else if (exerciseCount === 1) {
                    // 1개만 있으면 타입별로 구분
                    if (hasPilates) {
                      dotColor = 'bg-pink-400'; // 필라테스 - 분홍색
                    } else if (hasSwimming) {
                      dotColor = 'bg-sky-400'; // 수영 - 하늘색
                    } else if (hasOther) {
                      dotColor = 'bg-orange-400'; // 기타 - 주황색
                    }
                  }
                  
                  return (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDate(dateStr);
                      }}
                      className={`
                        flex-1 h-8 transition-all flex items-center justify-center relative
                        ${isTodayDate ? 'bg-rose-50' : ''}
                        hover:scale-105
                      `}
                    >
                      <div className={`w-4 h-4 rounded-full transition-colors ${dotColor}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};