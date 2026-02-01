import React, { useState } from 'react';
import { useApp, Event } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Plus, Trash2, Edit2, Calendar, Clock, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TimePicker } from '@/app/components/TimePicker';
import { Checkbox } from '@/app/components/ui/checkbox';

interface EventSectionProps {
  today: string;
}

export const EventSection: React.FC<EventSectionProps> = ({ today }) => {
  const { events, addEvent, updateEvent, deleteEvent } = useApp();
  
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState('');

  // 반복 설정 상태
  const [repeatType, setRepeatType] = useState<'none' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('none');
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [customInterval, setCustomInterval] = useState(1);
  const [customUnit, setCustomUnit] = useState<'day' | 'week' | 'month' | 'year'>('day');

  // 날짜가 반복 일정에 포함되는지 확인하는 함수
  const isEventOccurringOnDate = (event: Event, targetDateStr: string) => {
    // 1. 기본 날짜 범위 확인 (반복 없는 경우)
    const eventStartDate = new Date(event.date);
    const targetDate = new Date(targetDateStr);
    const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);

    // 반복이 없는 경우: 단순 날짜 범위 체크
    if (!event.recurrence || event.recurrence.type === 'none') {
      // Date 객체로 비교 (시간 제거)
      const targetTime = new Date(targetDateStr).setHours(0, 0, 0, 0);
      const startTime = new Date(event.date).setHours(0, 0, 0, 0);
      const endTime = event.endDate ? new Date(event.endDate).setHours(0, 0, 0, 0) : startTime;
      
      return targetTime >= startTime && targetTime <= endTime;
    }

    // 반복이 있는 경우:
    // 시작일 이전이면 false
    if (targetDate < eventStartDate) return false;

    // 종료일이 있고 그 이후면 false
    if (event.endDate) {
      const endTime = new Date(event.endDate).setHours(0, 0, 0, 0);
      const targetTime = new Date(targetDateStr).setHours(0, 0, 0, 0);
      if (targetTime > endTime) return false;
    }

    const recurrence = event.recurrence;
    const dayMap: { [key: string]: number } = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };

    if (recurrence.type === 'weekly') {
      if (!recurrence.weekDays || recurrence.weekDays.length === 0) return false;
      // 요일 체크
      const dayName = ['일', '월', '화', '수', '목', '금', '토'][targetDate.getDay()];
      return recurrence.weekDays.includes(dayName);
    }

    if (recurrence.type === 'monthly') {
      // 매월 같은 일 (예: 15일)
      return targetDate.getDate() === eventStartDate.getDate();
    }

    if (recurrence.type === 'yearly') {
      // 매년 같은 월/일
      return targetDate.getMonth() === eventStartDate.getMonth() && 
             targetDate.getDate() === eventStartDate.getDate();
    }

    if (recurrence.type === 'custom' && recurrence.interval && recurrence.unit) {
      const diffTime = targetDate.getTime() - eventStartDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (recurrence.unit === 'day') {
        return diffDays % recurrence.interval === 0;
      }
      if (recurrence.unit === 'week') {
        return (diffDays % (recurrence.interval * 7)) === 0;
      }
      if (recurrence.unit === 'month') {
        // 개월 수 차이 계산
        const monthDiff = (targetDate.getFullYear() - eventStartDate.getFullYear()) * 12 + 
                          (targetDate.getMonth() - eventStartDate.getMonth());
        return monthDiff >= 0 && monthDiff % recurrence.interval === 0 && 
               targetDate.getDate() === eventStartDate.getDate();
      }
      if (recurrence.unit === 'year') {
        const yearDiff = targetDate.getFullYear() - eventStartDate.getFullYear();
        return yearDiff >= 0 && yearDiff % recurrence.interval === 0 &&
               targetDate.getMonth() === eventStartDate.getMonth() &&
               targetDate.getDate() === eventStartDate.getDate();
      }
    }

    return false;
  };

  const todayEvents = events.filter(e => isEventOccurringOnDate(e, today));

  const toggleWeekDay = (day: string) => {
    setWeekDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  const handleAddEvent = () => {
    if (!title.trim()) {
      alert('일정 제목을 입력해주세요!');
      return;
    }

    const eventData = {
      date: startDate,
      endDate: endDate || undefined,
      title: title.trim(),
      description: description.trim(),
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      isAllDay,
      recurrence: repeatType === 'none' ? undefined : {
        type: repeatType,
        weekDays: repeatType === 'weekly' ? weekDays : undefined,
        interval: repeatType === 'custom' ? customInterval : undefined,
        unit: repeatType === 'custom' ? customUnit : undefined
      }
    };

    if (editingEventId) {
      updateEvent(editingEventId, eventData);
      setEditingEventId(null);
    } else {
      addEvent(eventData);
    }

    resetForm();
  };

  const handleEditEvent = (event: Event) => {
    setEditingEventId(event.id);
    setTitle(event.title);
    setDescription(event.description || '');
    setStartTime(event.startTime || '');
    setEndTime(event.endTime || '');
    setIsAllDay(event.isAllDay);
    setStartDate(event.date);
    setEndDate(event.endDate || '');
    
    // 반복 설정 로드
    if (event.recurrence) {
      setRepeatType(event.recurrence.type);
      setWeekDays(event.recurrence.weekDays || []);
      setCustomInterval(event.recurrence.interval || 1);
      setCustomUnit(event.recurrence.unit || 'day');
    } else {
      setRepeatType('none');
      setWeekDays([]);
      setCustomInterval(1);
      setCustomUnit('day');
    }

    setShowEventForm(true);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    setIsAllDay(false);
    setStartDate(today);
    setEndDate('');
    setRepeatType('none');
    setWeekDays([]);
    setCustomInterval(1);
    setCustomUnit('day');
    setShowEventForm(false);
  };

  const formatTimeRange = (event: Event) => {
    if (event.isAllDay) return '하루 종일';
    if (!event.startTime) return '';
    if (!event.endTime) return event.startTime;
    return `${event.startTime} - ${event.endTime}`;
  };

  // Event Item Component with gestures
  const EventItem: React.FC<{ event: Event }> = ({ event }) => {
    const [dragX, setDragX] = useState(0);
    const [showDelete, setShowDelete] = useState(false);
    const [isLongPressing, setIsLongPressing] = useState(false);
    const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

    const handleDragEnd = (eventData: MouseEvent | TouchEvent | PointerEvent, info: any) => {
      const threshold = 100;
      const isHorizontal = Math.abs(info.offset.x) > Math.abs(info.offset.y);
      
      if (isHorizontal && Math.abs(info.offset.x) > threshold) {
        if (info.offset.x > 0) {
          // 오른쪽으로 스와이프 - 삭제
          setShowDelete(true);
          setTimeout(() => {
            deleteEvent(event.id);
            setIsLongPressing(false);
          }, 200);
        } else {
          // 왼쪽으로 스와이프 - 편집
          // 반복 일정의 인스턴스인 경우 편집을 막거나 원본을 편집하도록 해야 함
          // 여기서는 간단하게 원본 ID로 편집 호출 (이미 event는 원본 객체임)
          handleEditEvent(event);
          setDragX(0);
          setIsLongPressing(false);
        }
      } else {
        // 원위치로 복귀
        setDragX(0);
      }
    };

    const handlePressStart = () => {
      const timer = setTimeout(() => {
        setIsLongPressing(true);
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, 500);
      setLongPressTimer(timer);
    };

    const handlePressEnd = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
      setTimeout(() => setIsLongPressing(false), 100);
    };

    return (
      <div className="relative overflow-hidden rounded-lg">
        {/* 삭제 배경 */}
        <div 
          className="absolute top-0 bottom-0 left-0 right-0 bg-red-500 flex items-center justify-end px-6"
          style={{ 
            opacity: Math.abs(dragX) > 50 ? 1 : 0,
            transition: 'opacity 0.2s'
          }}
        >
          <Trash2 className="w-5 h-5 text-white" />
        </div>

        {/* 편집 배경 */}
        <div 
          className="absolute top-0 bottom-0 left-0 right-0 bg-indigo-500 flex items-center justify-start px-6"
          style={{ 
            opacity: dragX < -50 ? 1 : 0,
            transition: 'opacity 0.2s'
          }}
        >
          <Edit2 className="w-5 h-5 text-white" />
        </div>

        {/* 메인 컨텐츠 */}
        <motion.div
          drag={isLongPressing ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          onDrag={(event, info) => setDragX(info.offset.x)}
          onPointerDown={handlePressStart}
          onPointerUp={handlePressEnd}
          onPointerCancel={handlePressEnd}
          animate={{ 
            opacity: showDelete ? 0 : 1, 
            x: showDelete ? (dragX > 0 ? 300 : -300) : 0,
            scale: isLongPressing ? 1.02 : 1,
          }}
          transition={{ scale: { duration: 0.2 } }}
          className={`p-4 bg-gray-50 rounded-lg transition-colors relative ${
            isLongPressing ? 'shadow-lg bg-white' : 'hover:bg-gray-100'
          }`}
          style={{
            touchAction: isLongPressing ? 'none' : 'pan-y',
          }}
        >
          {/* 수정/삭제 버튼 - 항상 표시 */}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditEvent(event);
              }}
              className="w-7 h-7 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-300 transition-all z-10"
            >
              <Edit2 className="w-3 h-3 text-indigo-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('이 일정을 삭제하시겠습니까?')) {
                  deleteEvent(event.id);
                }
              }}
              className="w-7 h-7 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-rose-50 hover:border-rose-300 transition-all z-10"
            >
              <Trash2 className="w-3 h-3 text-rose-600" />
            </button>
          </div>

          <div className="mb-2 pr-14">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-1">
                {event.recurrence && event.recurrence.type !== 'none' && (
                  <Repeat className="w-3 h-3 text-indigo-500" />
                )}
                {event.title}
              </h3>
              {/* 날짜/시간 정보 */}
              <div className="flex flex-col gap-0.5 mt-1">
                {/* 날짜 정보 */}
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">
                    {event.date}
                    {event.endDate && event.endDate !== event.date && ` ~ ${event.endDate}`}
                  </span>
                </div>
                {/* 시간 정보 */}
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">{formatTimeRange(event)}</span>
                </div>
              </div>
            </div>
          </div>
          {event.description && (
            <p className="text-sm text-gray-600 mt-2">{event.description}</p>
          )}
        </motion.div>

        {/* 롱프레스 가이드 */}
        {isLongPressing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-8 left-0 right-0 text-center z-10"
          >
            <div className="inline-block bg-gray-900 text-white text-xs px-3 py-1 rounded-full">
              ← 편집 | 삭제 →
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-3xl p-4 shadow-sm border hover:shadow-md transition-shadow bg-white"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100"
          >
            <Calendar className="w-4 h-4 text-gray-700" />
          </div>
          일정 📅
        </h2>
        <Button
          onClick={() => setShowEventForm(!showEventForm)}
          size="sm"
          className="rounded-full shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white h-8 px-3 text-sm"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          추가
        </Button>
      </div>

      <AnimatePresence>
        {showEventForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-gray-50 rounded-lg space-y-3"
          >
            <div className="space-y-2">
              <Label className="text-sm">제목</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="일정 제목"
                className="rounded-lg bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">시작 날짜</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">종료 날짜 (선택)</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="비워두면 하루 일정"
                className="rounded-lg bg-white"
              />
            </div>

            {/* 반복 설정 섹션 */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5" />
                반복
              </Label>
              <select
                value={repeatType}
                onChange={(e) => setRepeatType(e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="none">반복 안 함</option>
                <option value="weekly">1주 (요일 선택)</option>
                <option value="monthly">1달</option>
                <option value="yearly">1년</option>
                <option value="custom">반복주기 설정</option>
              </select>
            </div>

            {repeatType === 'weekly' && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">반복 요일 선택</Label>
                <div className="flex justify-between gap-1">
                  {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleWeekDay(day)}
                      type="button"
                      className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                        weekDays.includes(day)
                          ? 'bg-indigo-500 text-white'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {repeatType === 'custom' && (
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-gray-500">간격</Label>
                  <Input
                    type="number"
                    min="1"
                    value={customInterval}
                    onChange={(e) => setCustomInterval(parseInt(e.target.value) || 1)}
                    className="rounded-lg bg-white"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-gray-500">단위</Label>
                  <select
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value as any)}
                    className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="day">일 마다</option>
                    <option value="week">주 마다</option>
                    <option value="month">개월 마다</option>
                    <option value="year">년 마다</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllDay}
                onCheckedChange={(checked) => setIsAllDay(checked as boolean)}
              />
              <Label className="text-sm cursor-pointer">하루 종일</Label>
            </div>

            {!isAllDay && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">시작 시간</Label>
                  <TimePicker
                    value={startTime}
                    onChange={setStartTime}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">종료 시간</Label>
                  <TimePicker
                    value={endTime}
                    onChange={setEndTime}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm">설명</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="일정에 대한 설명"
                className="rounded-lg bg-white min-h-20"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddEvent}
                className="flex-1 rounded-lg text-white"
                style={{ background: 'linear-gradient(135deg, #6d8be7 0%, #a0d9ea 100%)' }}
              >
                {editingEventId ? '수정' : '추가'}
              </Button>
              {editingEventId && (
                <Button
                  onClick={() => {
                    setEditingEventId(null);
                    resetForm();
                  }}
                  variant="outline"
                  className="rounded-lg"
                >
                  취소
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {todayEvents.length > 0 ? (
        <div className="space-y-2">
          {todayEvents.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p>오늘 일정을 추가해보세요</p>
        </div>
      )}
    </motion.div>
  );
};