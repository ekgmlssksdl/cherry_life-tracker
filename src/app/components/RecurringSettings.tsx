import React from 'react';
import { RecurringSettings as RecurringSettingsType } from '@/app/context/AppContext';

interface RecurringSettingsProps {
  value: RecurringSettingsType;
  onChange: (settings: RecurringSettingsType) => void;
}

export const RecurringSettings: React.FC<RecurringSettingsProps> = ({ value, onChange }) => {
  const weekDays = [
    { label: '일', value: 0 },
    { label: '월', value: 1 },
    { label: '화', value: 2 },
    { label: '수', value: 3 },
    { label: '목', value: 4 },
    { label: '금', value: 5 },
    { label: '토', value: 6 },
  ];

  const handleTypeChange = (type: RecurringSettingsType['type']) => {
    onChange({
      ...value,
      type,
      interval: type === 'none' ? 1 : value.interval || 1,
      days: type === 'weekly' ? (value.days || []) : undefined,
    });
  };

  const handleIntervalChange = (interval: number) => {
    onChange({ ...value, interval: Math.max(1, interval) });
  };

  const toggleDay = (day: number) => {
    const currentDays = value.days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort((a, b) => a - b);
    
    onChange({ ...value, days: newDays });
  };

  const handleEndDateChange = (endDate: string) => {
    onChange({ ...value, endDate: endDate || undefined });
  };

  return (
    <div className="space-y-3" style={{ fontFamily: 'OngleipParkDahyeon, sans-serif' }}>
      {/* 반복 유형 선택 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">반복 설정</label>
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('none')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              value.type === 'none'
                ? 'bg-rose-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            없음
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('daily')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              value.type === 'daily'
                ? 'bg-rose-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            매일
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('weekly')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              value.type === 'weekly'
                ? 'bg-rose-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            매주
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('monthly')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              value.type === 'monthly'
                ? 'bg-rose-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            매월
          </button>
        </div>
      </div>

      {/* 간격 설정 */}
      {value.type !== 'none' && (
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            {value.type === 'daily' && '매일마다'}
            {value.type === 'weekly' && '매주마다'}
            {value.type === 'monthly' && '매월마다'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="99"
              value={value.interval || 1}
              onChange={(e) => handleIntervalChange(parseInt(e.target.value) || 1)}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <span className="text-sm text-gray-600">
              {value.type === 'daily' && '일'}
              {value.type === 'weekly' && '주'}
              {value.type === 'monthly' && '개월'}
            </span>
          </div>
        </div>
      )}

      {/* 요일 선택 (주간 반복) */}
      {value.type === 'weekly' && (
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">반복 요일</label>
          <div className="flex gap-2">
            {weekDays.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  value.days?.includes(day.value)
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 종료일 설정 */}
      {value.type !== 'none' && (
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            반복 종료일 (선택)
          </label>
          <input
            type="date"
            value={value.endDate || ''}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      )}
    </div>
  );
};
