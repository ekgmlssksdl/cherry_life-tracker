import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimePickerProps {
  value: string; // 24-hour format "HH:mm"
  onChange: (value: string) => void;
  className?: string;
  iconOnly?: boolean; // 아이콘만 표시할지 여부
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, className = '', iconOnly = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  // Convert 24-hour format to 12-hour format for display
  const formatTimeDisplay = (time24: string) => {
    if (!time24) return '';
    const [h, m] = time24.split(':');
    const hour24 = parseInt(h);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${ampm} ${hour12.toString().padStart(2, '0')}:${m}`;
  };

  // Initialize picker values when opened
  const handleOpen = () => {
    if (value) {
      const [h, m] = value.split(':');
      const hour24 = parseInt(h);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const ampm = hour24 >= 12 ? 'PM' : 'AM';
      setHour(hour12.toString());
      setMinute(m);
      setPeriod(ampm);
    }
    setIsOpen(true);
  };

  const handleConfirm = () => {
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    const time24 = `${hour24.toString().padStart(2, '0')}:${minute}`;
    onChange(time24);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (iconOnly) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={handleOpen}
          className="p-0 hover:bg-transparent transition-colors flex items-center justify-center"
        >
          <Clock className={`w-3.5 h-3.5 ${value ? 'text-gray-600' : 'text-gray-400'}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 z-40"
                onClick={handleCancel}
              />

              {/* Picker Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 z-50 w-80"
              >
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                  Enter Time
                </h3>

                <div className="flex items-center justify-center gap-3 mb-6">
                  {/* Hour Input */}
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={hour}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        const currentHour = parseInt(hour) || 12;
                        
                        // Handle arrow key changes
                        if (val > 12) {
                          setHour('1');
                          setPeriod(period === 'AM' ? 'PM' : 'AM');
                        } else if (val < 1 && e.target.value !== '') {
                          setHour('12');
                          setPeriod(period === 'AM' ? 'PM' : 'AM');
                        } else if (val >= 1 && val <= 12) {
                          setHour(val.toString());
                        } else if (e.target.value === '') {
                          setHour('');
                        }
                      }}
                      onBlur={() => {
                        if (hour === '' || parseInt(hour) < 1) setHour('12');
                      }}
                      className="w-24 h-20 text-3xl text-center border-2 border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <span className="text-xs text-gray-500 mt-2">Hour</span>
                  </div>

                  <span className="text-3xl font-bold text-gray-400 mb-6">:</span>

                  {/* Minute Input */}
                  <div className="flex flex-col items-center">
                    <select
                      value={minute}
                      onChange={(e) => setMinute(e.target.value)}
                      className="w-24 h-20 text-3xl text-center border-2 border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
                    >
                      {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                        <option key={m} value={m.toString().padStart(2, '0')}>
                          {m.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-500 mt-2">Minute</span>
                  </div>

                  {/* AM/PM Toggle */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setPeriod('AM')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        period === 'AM'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      AM
                    </button>
                    <button
                      onClick={() => setPeriod('PM')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        period === 'PM'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      PM
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3">
                  <Button
                    onClick={handleCancel}
                    variant="ghost"
                    className="text-indigo-600 hover:bg-indigo-50"
                  >
                    CANCEL
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    OK
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleOpen}
        className={`p-2 rounded-lg flex items-center justify-center border transition-all ${
          value
            ? 'bg-rose-500 text-white border-rose-500'
            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
        }`}
      >
        <Clock className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={handleCancel}
            />

            {/* Picker Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 z-50 w-80"
            >
              <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                Enter Time
              </h3>

              <div className="flex items-center justify-center gap-3 mb-6">
                {/* Hour Input */}
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={hour}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const currentHour = parseInt(hour) || 12;
                      
                      // Handle arrow key changes
                      if (val > 12) {
                        setHour('1');
                        setPeriod(period === 'AM' ? 'PM' : 'AM');
                      } else if (val < 1 && e.target.value !== '') {
                        setHour('12');
                        setPeriod(period === 'AM' ? 'PM' : 'AM');
                      } else if (val >= 1 && val <= 12) {
                        setHour(val.toString());
                      } else if (e.target.value === '') {
                        setHour('');
                      }
                    }}
                    onBlur={() => {
                      if (hour === '' || parseInt(hour) < 1) setHour('12');
                    }}
                    className="w-24 h-20 text-3xl text-center border-2 border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <span className="text-xs text-gray-500 mt-2">Hour</span>
                </div>

                <span className="text-3xl font-bold text-gray-400 mb-6">:</span>

                {/* Minute Input */}
                <div className="flex flex-col items-center">
                  <select
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    className="w-24 h-20 text-3xl text-center border-2 border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
                  >
                    {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                      <option key={m} value={m.toString().padStart(2, '0')}>
                        {m.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-gray-500 mt-2">Minute</span>
                </div>

                {/* AM/PM Toggle */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setPeriod('AM')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      period === 'AM'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => setPeriod('PM')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      period === 'PM'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3">
                <Button
                  onClick={handleCancel}
                  variant="ghost"
                  className="text-indigo-600 hover:bg-indigo-50"
                >
                  CANCEL
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  OK
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Utility function to format time for display
export const formatTime12Hour = (time24: string): string => {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  const hour24 = parseInt(h);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  return `${ampm} ${hour12.toString().padStart(2, '0')}:${m}`;
};