import React, { useState, useEffect } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Check, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CatCare: React.FC = () => {
  const { catCares, addCatCare, updateCatCare } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const todayCare = catCares.find(care => care.date === today);

  const [currentCare, setCurrentCare] = useState({
    stoolCount: 0,
    urineCount: 0,
    foodRemaining: 100,
    supplements: false,
    vomitType: '',
    stoolCondition: '정상',
    abnormalityMemo: '',
  });

  useEffect(() => {
    if (todayCare) {
      setCurrentCare({
        stoolCount: todayCare.stoolCount || 0,
        urineCount: todayCare.urineCount || 0,
        foodRemaining: todayCare.foodRemaining || 100,
        supplements: todayCare.supplements || false,
        vomitType: todayCare.vomitType || '',
        stoolCondition: todayCare.stoolCondition || '정상',
        abnormalityMemo: todayCare.abnormalityMemo || '',
      });
    }
  }, [todayCare]);

  const handleUpdate = (updates: Partial<typeof currentCare>) => {
    const newCare = { ...currentCare, ...updates };
    setCurrentCare(newCare);

    if (todayCare) {
      updateCatCare(todayCare.id, updates);
    } else {
      addCatCare({
        date: today,
        ...newCare,
      });
    }
  };

  const increment = (field: 'stoolCount' | 'urineCount') => {
    handleUpdate({ [field]: currentCare[field] + 1 });
  };

  const decrement = (field: 'stoolCount' | 'urineCount') => {
    if (currentCare[field] > 0) {
      handleUpdate({ [field]: currentCare[field] - 1 });
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#FFF5F7' }}>
      <div className="max-w-3xl mx-auto space-y-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold" style={{ color: '#E63946' }}>
              고양이 케어
            </h1>
          </div>
          <p className="text-gray-600">오늘의 고양이 케어 체크</p>
        </motion.div>

        {/* 대소변 카운터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
          style={{ borderLeft: '4px solid #E63946' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold" style={{ color: '#E63946' }}>대소변 체크</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* 대변 */}
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-sm font-semibold mb-3" style={{ color: '#E63946' }}>대변 (💩)</p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => decrement('stoolCount')}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: '#FFE5E9' }}
                >
                  <Minus className="w-5 h-5" style={{ color: '#E63946' }} />
                </button>
                <span className="text-3xl font-bold" style={{ color: '#E63946' }}>
                  {currentCare.stoolCount}
                </span>
                <button
                  onClick={() => increment('stoolCount')}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: '#E63946' }}
                >
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* 소변 */}
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-sm font-semibold mb-3" style={{ color: '#E63946' }}>소변 (💦)</p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => decrement('urineCount')}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: '#FFE5E9' }}
                >
                  <Minus className="w-5 h-5" style={{ color: '#E63946' }} />
                </button>
                <span className="text-3xl font-bold" style={{ color: '#E63946' }}>
                  {currentCare.urineCount}
                </span>
                <button
                  onClick={() => increment('urineCount')}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: '#E63946' }}
                >
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* 대변 상태 */}
          <div className="mt-4">
            <p className="text-sm font-semibold mb-2" style={{ color: '#E63946' }}>대변 상태</p>
            <div className="grid grid-cols-3 gap-2">
              {['정상', '묽음', '설사', '변비', '혈변'].map((condition) => (
                <button
                  key={condition}
                  onClick={() => handleUpdate({ stoolCondition: condition })}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    currentCare.stoolCondition === condition
                      ? 'text-white shadow-md'
                      : 'bg-red-50 text-gray-700'
                  }`}
                  style={currentCare.stoolCondition === condition ? { backgroundColor: '#E63946' } : {}}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 식사량 체크 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
          style={{ borderLeft: '4px solid #E63946' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold" style={{ color: '#E63946' }}>식사량</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">남은 사료량</span>
              <span className="text-2xl font-bold" style={{ color: '#E63946' }}>
                {currentCare.foodRemaining}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentCare.foodRemaining}
              onChange={(e) => handleUpdate({ foodRemaining: parseInt(e.target.value) })}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #E63946 0%, #E63946 ${currentCare.foodRemaining}%, #FFE5E9 ${currentCare.foodRemaining}%, #FFE5E9 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>다 먹음</span>
              <span>가득</span>
            </div>
          </div>
        </motion.div>

        {/* 영양제 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
          style={{ borderLeft: '4px solid #E63946' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold" style={{ color: '#E63946' }}>영양제</h2>
          </div>
          
          <button
            onClick={() => handleUpdate({ supplements: !currentCare.supplements })}
            className={`w-full p-4 rounded-xl transition-all flex items-center justify-between ${
              currentCare.supplements
                ? 'shadow-md'
                : 'bg-red-50'
            }`}
            style={currentCare.supplements ? { backgroundColor: '#E63946' } : {}}
          >
            <span className={`font-semibold ${currentCare.supplements ? 'text-white' : 'text-gray-700'}`}>
              영양제 급여 완료
            </span>
            <AnimatePresence>
              {currentCare.supplements && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4" style={{ color: '#E63946' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>

        {/* 구토 체크 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
          style={{ borderLeft: '4px solid #E63946' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold" style={{ color: '#E63946' }}>구토 여부</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {['없음', '털 구토', '사료 구토', '물 구토'].map((type) => (
              <button
                key={type}
                onClick={() => handleUpdate({ vomitType: type === '없음' ? '' : type })}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  (type === '없음' && !currentCare.vomitType) || currentCare.vomitType === type
                    ? 'text-white shadow-md'
                    : 'bg-red-50 text-gray-700'
                }`}
                style={(type === '없음' && !currentCare.vomitType) || currentCare.vomitType === type ? { backgroundColor: '#E63946' } : {}}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 특이사항 메모 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
          style={{ borderLeft: '4px solid #E63946' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold" style={{ color: '#E63946' }}>특이사항 메모</h2>
          </div>
          
          <textarea
            value={currentCare.abnormalityMemo}
            onChange={(e) => handleUpdate({ abnormalityMemo: e.target.value })}
            placeholder="특이사항이나 건강 상태를 메모하세요..."
            className="w-full p-4 rounded-xl border-2 resize-none focus:outline-none transition-colors"
            style={{ 
              borderColor: '#FFE5E9',
              minHeight: '120px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#E63946'}
            onBlur={(e) => e.target.style.borderColor = '#FFE5E9'}
          />
        </motion.div>
      </div>
    </div>
  );
};