import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Waves, Activity, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Exercise: React.FC = () => {
  const { exercises, addExercise, deleteExercise } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'swimming' | 'pilates'>('swimming');
  const [duration, setDuration] = useState('60');
  const [intensity, setIntensity] = useState('중간');
  const [memo, setMemo] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = () => {
    addExercise({
      date: today,
      type,
      duration: parseInt(duration),
      intensity,
      memo,
    });
    
    // Reset form
    setDuration('60');
    setIntensity('중간');
    setMemo('');
    setShowForm(false);
  };

  const todayExercises = exercises.filter(ex => ex.date === today);
  const pastExercises = exercises.filter(ex => ex.date !== today).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            운동
          </h1>
          <p className="text-gray-500">운동 기록 관리</p>
        </motion.div>

        {/* Add Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={() => setShowForm(!showForm)}
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            운동 추가
          </Button>
        </motion.div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6"
            >
              {/* Exercise Type */}
              <div className="space-y-3">
                <Label>운동 종류</Label>
                <RadioGroup value={type} onValueChange={(v) => setType(v as 'swimming' | 'pilates')}>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center justify-center gap-3 p-4 rounded-lg cursor-pointer transition-all border ${
                        type === 'swimming'
                          ? 'bg-indigo-50 border-indigo-600'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <RadioGroupItem value="swimming" id="swimming" className="sr-only" />
                      <Waves className={`w-5 h-5 ${type === 'swimming' ? 'text-indigo-600' : 'text-gray-400'}`} />
                      <span className={type === 'swimming' ? 'font-semibold text-indigo-900' : 'text-gray-600'}>
                        수영
                      </span>
                    </label>
                    
                    <label
                      className={`flex items-center justify-center gap-3 p-4 rounded-lg cursor-pointer transition-all border ${
                        type === 'pilates'
                          ? 'bg-indigo-50 border-indigo-600'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <RadioGroupItem value="pilates" id="pilates" className="sr-only" />
                      <Activity className={`w-5 h-5 ${type === 'pilates' ? 'text-indigo-600' : 'text-gray-400'}`} />
                      <span className={type === 'pilates' ? 'font-semibold text-indigo-900' : 'text-gray-600'}>
                        필라테스
                      </span>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>시간 (분)</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="rounded-lg bg-gray-50"
                  placeholder="60"
                />
              </div>

              {/* Intensity */}
              <div className="space-y-2">
                <Label>강도</Label>
                <RadioGroup value={intensity} onValueChange={setIntensity}>
                  <div className="flex gap-2">
                    {['낮음', '중간', '높음'].map((level) => (
                      <label
                        key={level}
                        className={`flex-1 text-center p-3 rounded-lg cursor-pointer transition-all border ${
                          intensity === level
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <RadioGroupItem value={level} id={level} className="sr-only" />
                        {level}
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Memo */}
              <div className="space-y-2">
                <Label>메모</Label>
                <Textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="운동 관련 메모"
                  className="rounded-lg bg-gray-50 min-h-24"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                저장
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Today's Exercises */}
        {todayExercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-gray-900">오늘</h2>
            {todayExercises.map((ex) => (
              <div
                key={ex.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {ex.type === 'swimming' ? (
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Waves className="w-5 h-5 text-indigo-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-indigo-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {ex.type === 'swimming' ? '수영' : '필라테스'}
                      </h3>
                      <p className="text-sm text-gray-600">{ex.duration}분 · {ex.intensity}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteExercise(ex.id)}
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {ex.memo && (
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                    {ex.memo}
                  </p>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Past Exercises */}
        {pastExercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-gray-900">이전 기록</h2>
            <div className="space-y-2">
              {pastExercises.slice(0, 10).map((ex) => (
                <div
                  key={ex.id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    {ex.type === 'swimming' ? (
                      <Waves className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Activity className="w-5 h-5 text-indigo-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {ex.type === 'swimming' ? '수영' : '필라테스'} · {ex.duration}분
                      </p>
                      <p className="text-sm text-gray-500">{ex.date}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteExercise(ex.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {exercises.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>운동 기록이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};