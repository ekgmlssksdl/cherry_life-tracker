import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Checkbox } from '@/app/components/ui/checkbox';
import { ArrowLeft, CheckCircle2, Dumbbell, Cat, Camera, Save, Plus, Trash2, Waves, Activity, Minus, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BodyPartSelector } from '@/app/components/BodyPartSelector';
import { TimePicker, formatTime12Hour } from '@/app/components/TimePicker';
import { ColorBox } from '@/app/components/ColorBox';

interface DayDetailProps {
  date: string;
  onBack?: () => void;
  isModal?: boolean; // 모달에서 사용되는지 여부
}

export const DayDetail: React.FC<DayDetailProps> = ({ date, onBack, isModal }) => {
  const { 
    todos, addTodo, toggleTodo, deleteTodo, updateTodo,
    exercises, addExercise, updateExercise, deleteExercise,
    catCares, addCatCare, updateCatCare,
    dayLogs, updateDayLog, addDayLog,
    todoCategories 
  } = useApp();
  
  const [memo, setMemo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Todo 상태
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoTime, setNewTodoTime] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showTodoForm, setShowTodoForm] = useState(false);
  
  // Exercise 상태
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [exerciseType, setExerciseType] = useState<'swimming' | 'pilates'>('swimming');
  const [duration, setDuration] = useState('60');
  const [intensity, setIntensity] = useState('중간');
  const [exerciseMemo, setExerciseMemo] = useState('');
  const [swimmingStyles, setSwimmingStyles] = useState({
    butterfly: 0,
    breaststroke: 0,
    freestyle: 0,
    backstroke: 0,
    kick: 0,
    kickboard: 0,
    turn: 0,
  });
  const [totalDistance, setTotalDistance] = useState('');
  const [pilatesEquipment, setPilatesEquipment] = useState<string[]>([]);
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  
  // Cat Care 상태
  const [showCatCareForm, setShowCatCareForm] = useState(false);

  const dayTodos = todos.filter(t => t.date === date);
  const dayExercise = exercises.filter(e => e.date === date);
  const dayCatCare = catCares.find(c => c.date === date);
  const dayLog = dayLogs.find(log => log.date === date);

  const [currentCare, setCurrentCare] = React.useState({
    stoolCount: dayCatCare?.stoolCount || 0,
    urineCount: dayCatCare?.urineCount || 0,
    foodRemaining: dayCatCare?.foodRemaining || 500,
    supplements: dayCatCare?.supplements || false,
    vomitType: dayCatCare?.vomitType || '',
    stoolCondition: dayCatCare?.stoolCondition || '',
    abnormalityMemo: dayCatCare?.abnormalityMemo || '',
  });

  // dayLog가 변경될 때 memo 상태 업데이트
  React.useEffect(() => {
    if (dayLog?.memo) {
      setMemo(dayLog.memo);
    }
  }, [dayLog]);

  React.useEffect(() => {
    if (dayCatCare) {
      setCurrentCare({
        stoolCount: dayCatCare.stoolCount,
        urineCount: dayCatCare.urineCount,
        foodRemaining: dayCatCare.foodRemaining,
        supplements: dayCatCare.supplements,
        vomitType: dayCatCare.vomitType || '',
        stoolCondition: dayCatCare.stoolCondition || '',
        abnormalityMemo: dayCatCare.abnormalityMemo || '',
      });
    }
  }, [dayCatCare]);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return d.toLocaleDateString('ko-KR', options);
  };

  const handleSaveMemo = () => {
    setIsSaving(true);
    
    // dayLog가 없으면 새로 생성
    if (!dayLog) {
      addDayLog({ date, memo, photo: '' });
    } else {
      updateDayLog(dayLog.id, { memo });
    }
    
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // dayLog가 없으면 새로 생성
        if (!dayLog) {
          addDayLog({ date, memo: '', photo: reader.result as string });
        } else {
          updateDayLog(dayLog.id, { photo: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText, date, selectedCategory, newTodoTime);
      setNewTodoText('');
      setNewTodoTime('');
      setSelectedCategory('');
      setShowTodoForm(false);
    }
  };

  const handleTimeChange = (todoId: string, time: string) => {
    updateTodo(todoId, { time });
  };

  const handleAddExercise = () => {
    const exerciseData: any = {
      date,
      type: exerciseType,
      duration: parseInt(duration),
      intensity,
      memo: exerciseMemo,
      bodyParts: bodyParts.length > 0 ? bodyParts : undefined,
    };

    if (exerciseType === 'swimming') {
      exerciseData.swimmingStyles = swimmingStyles;
      exerciseData.totalDistance = parseInt(totalDistance) || undefined;
    } else if (exerciseType === 'pilates') {
      exerciseData.pilatesEquipment = pilatesEquipment.length > 0 ? pilatesEquipment : undefined;
    }

    if (editingExerciseId) {
      updateExercise(editingExerciseId, exerciseData);
      setEditingExerciseId(null);
    } else {
      addExercise(exerciseData);
    }
    
    // Reset form
    setDuration('60');
    setIntensity('중간');
    setExerciseMemo('');
    setSwimmingStyles({
      butterfly: 0,
      breaststroke: 0,
      freestyle: 0,
      backstroke: 0,
      kick: 0,
      kickboard: 0,
      turn: 0,
    });
    setTotalDistance('');
    setPilatesEquipment([]);
    setBodyParts([]);
    setShowExerciseForm(false);
  };

  const handleCareUpdate = (updates: Partial<typeof currentCare>) => {
    setCurrentCare({ ...currentCare, ...updates });

    if (dayCatCare) {
      updateCatCare(dayCatCare.id, updates);
    } else {
      addCatCare({
        date,
        ...currentCare,
        ...updates,
      });
    }
  };

  const incrementCount = (field: 'stoolCount' | 'urineCount') => {
    const newValue = currentCare[field] + 1;
    handleCareUpdate({ [field]: newValue });
  };

  const decrementCount = (field: 'stoolCount' | 'urineCount') => {
    const newValue = Math.max(0, currentCare[field] - 1);
    handleCareUpdate({ [field]: newValue });
  };

  const toggleBodyPart = (part: string) => {
    setBodyParts(prev => 
      prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
    );
  };

  const toggleEquipment = (equipment: string) => {
    setPilatesEquipment(prev => 
      prev.includes(equipment) ? prev.filter(e => e !== equipment) : [...prev, equipment]
    );
  };

  const updateSwimmingStyle = (style: keyof typeof swimmingStyles, value: number) => {
    setSwimmingStyles(prev => ({ ...prev, [style]: value }));
  };

  const vomitTypes = [
    { value: '투명', label: '투명' },
    { value: '빽빽(거품)', label: '빽빽(거품)' },
    { value: '사료토', label: '사료토' },
    { value: '헛구역질', label: '헛구역질' },
    { value: '노랑', label: '노랑' },
    { value: '핑크', label: '핑크' },
    { value: '짙은갈색', label: '짙은 갈색' },
    { value: '녹색', label: '녹색' },
    { value: '이물질', label: '이물질' },
    { value: '빨강', label: '빨강' },
  ];

  const stoolConditions = [
    { value: '변비', label: '변비', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: '름', label: '무름', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: '설사', label: '설사', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { value: '혈변', label: '혈변', color: 'bg-red-100 text-red-800 border-red-200' },
  ];

  return (
    <div className={isModal ? "" : "min-h-screen bg-gray-50 p-6"}>
      <div className={isModal ? "space-y-4" : "max-w-3xl mx-auto space-y-6"}>
        {/* Header - 모달에서는 숨김 */}
        {!isModal && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                className="mb-4 rounded-lg hover:bg-white"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                돌아가기
              </Button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{formatDate(date)}</h1>
          </motion.div>
        )}

        {/* Todos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              할 일
            </h2>
            <Button
              onClick={() => setShowTodoForm(!showTodoForm)}
              size="sm"
              variant="ghost"
              className="rounded-lg"
            >
              <Plus className="w-4 h-4 mr-1" />
              추가
            </Button>
          </div>

          {/* Todo Add Form */}
          <AnimatePresence>
            {showTodoForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 space-y-2 pb-4 border-b"
              >
                <div className="flex gap-2">
                  <Input
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                    placeholder="새로운 할 일"
                    className="flex-1 rounded-lg bg-gray-50 border-gray-200"
                  />
                  <TimePicker
                    value={newTodoTime}
                    onChange={(time) => setNewTodoTime(time)}
                    className="w-28 rounded-lg bg-gray-50 border-gray-200"
                  />
                  <Button
                    onClick={handleAddTodo}
                    size="sm"
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {newTodoText && (
                  <div className="flex gap-2 flex-wrap">
                    {todoCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                        className={`px-2.5 py-1 rounded-md text-xs transition-all border ${
                          selectedCategory === category
                            ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Todo List */}
          {dayTodos.length > 0 ? (
            <div className="space-y-2">
              {dayTodos.map(todo => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5"
                  />
                  <div className="flex-1">
                    <span className={todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}>
                      {todo.text}
                    </span>
                    {todo.category && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        {todo.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <TimePicker
                      value={todo.time || ''}
                      onChange={(time) => handleTimeChange(todo.id, time)}
                      className="w-24 h-8 text-sm rounded-lg bg-white border-gray-200"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !showTodoForm && (
              <p className="text-center py-4 text-gray-400 text-sm">할 일이 없습니다</p>
            )
          )}
        </motion.div>

        {/* Exercise Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
              <Dumbbell className="w-5 h-5 text-indigo-600" />
              운동
            </h2>
            <Button
              onClick={() => setShowExerciseForm(!showExerciseForm)}
              size="sm"
              variant="ghost"
              className="rounded-lg"
            >
              <Plus className="w-4 h-4 mr-1" />
              추가
            </Button>
          </div>

          {/* Exercise Add Form */}
          <AnimatePresence>
            {showExerciseForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 space-y-4 pb-4 border-b"
              >
                {/* Exercise Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">운동 종류</Label>
                  <RadioGroup value={exerciseType} onValueChange={(v) => setExerciseType(v as 'swimming' | 'pilates')}>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`flex items-center justify-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                        exerciseType === 'swimming' ? 'bg-indigo-50 border-indigo-600' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <RadioGroupItem value="swimming" id="swimming" className="sr-only" />
                        <Waves className={`w-5 h-5 ${exerciseType === 'swimming' ? 'text-indigo-600' : 'text-gray-400'}`} />
                        <span className={exerciseType === 'swimming' ? 'font-semibold text-indigo-900' : 'text-gray-600'}>수</span>
                      </label>
                      <label className={`flex items-center justify-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                        exerciseType === 'pilates' ? 'bg-indigo-50 border-indigo-600' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <RadioGroupItem value="pilates" id="pilates" className="sr-only" />
                        <Activity className={`w-5 h-5 ${exerciseType === 'pilates' ? 'text-indigo-600' : 'text-gray-400'}`} />
                        <span className={exerciseType === 'pilates' ? 'font-semibold text-indigo-900' : 'text-gray-600'}>필라테스</span>
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Duration & Intensity */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">운동 시간 (분)</Label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="rounded-lg bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">강도</Label>
                    <select
                      value={intensity}
                      onChange={(e) => setIntensity(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <option value="낮음">낮음</option>
                      <option value="중간">중간</option>
                      <option value="높음">높음</option>
                    </select>
                  </div>
                </div>

                {/* Swimming specific */}
                {exerciseType === 'swimming' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">수영 종목 (횟수)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'butterfly', label: '접영' },
                        { key: 'breaststroke', label: '평영' },
                        { key: 'freestyle', label: '자유형' },
                        { key: 'backstroke', label: '배영' },
                        { key: 'kick', label: '발차기' },
                        { key: 'kickboard', label: '킥판' },
                        { key: 'turn', label: '회전' },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-2">
                          <Label className="text-sm flex-1">{label}</Label>
                          <Input
                            type="number"
                            min="0"
                            value={swimmingStyles[key as keyof typeof swimmingStyles]}
                            onChange={(e) => updateSwimmingStyle(key as keyof typeof swimmingStyles, parseInt(e.target.value) || 0)}
                            className="w-20 h-8 text-sm rounded-lg bg-gray-50"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">총 거리 (m)</Label>
                      <Input
                        type="number"
                        value={totalDistance}
                        onChange={(e) => setTotalDistance(e.target.value)}
                        className="rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                )}

                {/* Pilates specific */}
                {exerciseType === 'pilates' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">사용 기구</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['리포머', '캐딜락', '체어', '바렐', '소도구', '매트'].map(eq => (
                        <button
                          key={eq}
                          onClick={() => toggleEquipment(eq)}
                          className={`px-3 py-2 rounded-lg text-sm transition-all border ${
                            pilatesEquipment.includes(eq)
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {eq}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Body Parts */}
                <BodyPartSelector
                  selectedParts={bodyParts}
                  onToggle={toggleBodyPart}
                />

                {/* Memo */}
                <div className="space-y-2">
                  <Label className="text-sm">메모</Label>
                  <Textarea
                    value={exerciseMemo}
                    onChange={(e) => setExerciseMemo(e.target.value)}
                    placeholder="운동에 대한 메모"
                    className="rounded-lg bg-gray-50 min-h-20"
                  />
                </div>

                <Button
                  onClick={handleAddExercise}
                  className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {editingExerciseId ? '수정' : '추가'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exercise List */}
          {dayExercise.length > 0 ? (
            <div className="space-y-3">
              {dayExercise.map(ex => (
                <div key={ex.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      {ex.type === 'swimming' ? '수영' : '필라테스'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-sm">{ex.duration}분</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteExercise(ex.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">강도: {ex.intensity}</p>
                  {ex.memo && (
                    <p className="text-sm text-gray-700 mt-2 bg-white p-2 rounded">"{ex.memo}"</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !showExerciseForm && (
              <p className="text-center py-4 text-gray-400 text-sm">운동 기록이 없습니다</p>
            )
          )}
        </motion.div>

        {/* Cat Care Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          {showCatCareForm && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                <Cat className="w-5 h-5 text-indigo-600" />
                고양이 케어
              </h2>
              <Button
                onClick={() => setShowCatCareForm(!showCatCareForm)}
                size="sm"
                variant="ghost"
                className="rounded-lg p-0"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          {showCatCareForm ? (
            <div className="space-y-4">
              {/* Counts */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">대변 횟수</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => decrementCount('stoolCount')}
                      size="sm"
                      variant="outline"
                      className="rounded-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="flex-1 text-center font-semibold">{currentCare.stoolCount}</span>
                    <Button
                      onClick={() => incrementCount('stoolCount')}
                      size="sm"
                      variant="outline"
                      className="rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">소변 횟수</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => decrementCount('urineCount')}
                      size="sm"
                      variant="outline"
                      className="rounded-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="flex-1 text-center font-semibold">{currentCare.urineCount}</span>
                    <Button
                      onClick={() => incrementCount('urineCount')}
                      size="sm"
                      variant="outline"
                      className="rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Food */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">식사량 (g)</Label>
                  {(500 - currentCare.foodRemaining) > 0 && (
                    <span className="text-sm text-gray-600">
                      먹은 양: <span className="font-bold text-indigo-600">{500 - currentCare.foodRemaining}g</span>
                    </span>
                  )}
                </div>
                <Input
                  type="number"
                  value={currentCare.foodRemaining}
                  onChange={(e) => handleCareUpdate({ foodRemaining: parseInt(e.target.value) || 0 })}
                  className="rounded-lg bg-gray-50"
                />
              </div>

              {/* Supplements */}
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={currentCare.supplements}
                  onCheckedChange={(checked) => handleCareUpdate({ supplements: checked as boolean })}
                  className="w-5 h-5"
                />
                <Label className="text-sm">영양제 섭취</Label>
              </div>

              {/* Vomit Type */}
              <div className="space-y-2">
                <Label className="text-sm">구토 종류</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCareUpdate({ vomitType: '' })}
                    className={`px-3 py-2 rounded-lg text-sm border ${
                      !currentCare.vomitType
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    없음
                  </button>
                  {vomitTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => handleCareUpdate({ vomitType: currentCare.vomitType === type.value ? '' : type.value })}
                      className={`px-3 py-2 rounded-lg text-sm border ${
                        currentCare.vomitType === type.value
                          ? 'bg-red-100 text-red-800 border-red-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stool Condition */}
              <div className="space-y-2">
                <Label className="text-sm">변 상태</Label>
                <div className="grid grid-cols-2 gap-2">
                  {stoolConditions.map(condition => (
                    <button
                      key={condition.value}
                      onClick={() => handleCareUpdate({ stoolCondition: currentCare.stoolCondition === condition.value ? '' : condition.value })}
                      className={`px-3 py-2 rounded-lg text-sm border ${
                        currentCare.stoolCondition === condition.value
                          ? condition.color
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {condition.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Abnormality Memo */}
              <div className="space-y-2">
                <Label className="text-sm">특이사항</Label>
                <Textarea
                  value={currentCare.abnormalityMemo}
                  onChange={(e) => handleCareUpdate({ abnormalityMemo: e.target.value })}
                  placeholder="특이사항을 기록하세요"
                  className="rounded-lg bg-gray-50 min-h-20"
                />
              </div>
            </div>
          ) : (
            <div>
              {dayCatCare ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                        <Cat className="w-5 h-5 text-indigo-600" />
                        고양이 케어
                      </h2>
                      <Button
                        onClick={() => setShowCatCareForm(!showCatCareForm)}
                        size="sm"
                        variant="ghost"
                        className="rounded-lg text-[11px] px-[2px] py-[0px]"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* 대변 아이콘 */}
                      <div className="relative">
                        <ColorBox color="brown" size="10" />
                        {dayCatCare.stoolCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{dayCatCare.stoolCount}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* 소변 아이콘 */}
                      <div className="relative">
                        <ColorBox color="blue" size="10" />
                        {dayCatCare.urineCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{dayCatCare.urineCount}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* 사료 아이콘 */}
                      <div className="relative">
                        <ColorBox color="orange" size="10" />
                        {(500 - dayCatCare.foodRemaining) > 0 && (
                          <div className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{500 - dayCatCare.foodRemaining}g</span>
                          </div>
                        )}
                      </div>
                      
                      {/* 영양제 아이콘 (섭취했을 때만 표시) */}
                      {dayCatCare.supplements && (
                        <div className="relative">
                          <ColorBox color="green" size="10" />
                        </div>
                      )}
                      
                      {/* 구토/설사 아이콘 (해당사항 있을 때만 표시) */}
                      {(dayCatCare.vomitType || dayCatCare.stoolCondition === '설사') && (
                        <div className="relative">
                          <ColorBox color="red" size="10" />
                        </div>
                      )}
                    </div>
                  </div>
                  {dayCatCare.stoolCondition && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">변 상태: {dayCatCare.stoolCondition}</p>
                    </div>
                  )}
                  {dayCatCare.abnormalityMemo && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm font-semibold text-gray-700 mb-1">특이사항</p>
                      <p className="text-sm text-gray-600">{dayCatCare.abnormalityMemo}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-400 text-sm">케어 기록이 없습니다</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Photo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <Camera className="w-5 h-5 text-indigo-600" />
            사진
          </h2>
          
          {dayLog?.photo ? (
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={dayLog.photo} 
                alt="Day photo" 
                className="w-full h-64 object-cover"
              />
              <label className="absolute bottom-4 right-4 cursor-pointer">
                <div className="bg-white/90 hover:bg-white rounded-lg p-3 shadow-lg transition-colors">
                  <Camera className="w-5 h-5 text-indigo-600" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors">
              <Camera className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-gray-500">사진 추가</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </motion.div>

        {/* Diary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-bold mb-4 text-gray-900">일기</h2>
          <Textarea
            value={memo || dayLog?.memo || ''}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="오늘 하루를 기록해보세요"
            className="min-h-32 rounded-lg bg-gray-50 border-gray-200"
          />
          <Button
            onClick={handleSaveMemo}
            disabled={isSaving}
            className="mt-4 w-full rounded-lg bg-rose-500 hover:bg-rose-600 text-white"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};