import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Plus, Trash2, Dumbbell, Cat, CheckCircle2, Waves, Activity, Check, AlertCircle, Minus, Edit2, Tag, Calendar as CalendarIcon, Clock, Camera, BookOpen, Pill, Languages, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BodyPartSelector } from '@/app/components/BodyPartSelector';
import { TodoSection } from '@/app/components/TodoSection';
import { EventSection } from '@/app/components/EventSection';
import { SupplementSection } from '@/app/components/SupplementSection';
import { LanguageStudySection } from '@/app/components/LanguageStudySection';

interface HomeProps {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

export const Home: React.FC<HomeProps> = ({ selectedDate, onDateChange }) => {
  const { 
    todos, addTodo, toggleTodo, deleteTodo, 
    todoCategories, addTodoCategory,
    exercises, addExercise, updateExercise, deleteExercise,
    catCares, addCatCare, updateCatCare,
    dayLogs, addDayLog, updateDayLog,
    supplements, addSupplement, updateSupplement,
    languageStudies, addLanguageStudy, updateLanguageStudy
  } = useApp();
  
  const [newTodoText, setNewTodoText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [exerciseType, setExerciseType] = useState<string>('pilates');
  const [customExercise, setCustomExercise] = useState('');
  const [duration, setDuration] = useState('60');
  const [intensity, setIntensity] = useState('중간');
  const [memo, setMemo] = useState('');
  const [showAbnormalityDetails, setShowAbnormalityDetails] = useState(false);
  
  // 수영 관련 상태
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
  
  // 필라테스 관련 상태
  const [pilatesEquipment, setPilatesEquipment] = useState<string[]>([]);
  
  // 신체 부위 상태
  const [bodyParts, setBodyParts] = useState<string[]>([]);

  // 일기 로컬 상태
  const [dayMemo, setDayMemo] = useState('');
  const [memoSaveTimer, setMemoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  const today = selectedDate || new Date().toISOString().split('T')[0];
  const todayTodos = todos.filter(todo => todo.date === today);
  const todayExercises = exercises.filter(ex => ex.date === today);
  const todayCatCare = catCares.find(care => care.date === today);
  const todayDayLog = dayLogs.find(log => log.date === today);
  const todaySupplement = supplements.find(s => s.date === today);
  const todayLanguageStudy = languageStudies.find(l => l.date === today);

  const [currentCare, setCurrentCare] = React.useState({
    stoolCount: todayCatCare?.stoolCount || 0,
    urineCount: todayCatCare?.urineCount || 0,
    foodRemaining: todayCatCare?.foodRemaining || 0,
    supplements: todayCatCare?.supplements || false,
    vomitTypes: todayCatCare?.vomitTypes || [],
    stoolConditions: todayCatCare?.stoolConditions || [],
    abnormalityMemo: todayCatCare?.abnormalityMemo || '',
  });

  // 일기 초기화 및 날짜 변경 시 업데이트
  React.useEffect(() => {
    setDayMemo(todayDayLog?.memo || '');
  }, [todayDayLog, today]);

  React.useEffect(() => {
    if (todayCatCare) {
      setCurrentCare({
        stoolCount: todayCatCare.stoolCount,
        urineCount: todayCatCare.urineCount,
        foodRemaining: todayCatCare.foodRemaining,
        supplements: todayCatCare.supplements,
        vomitTypes: todayCatCare.vomitTypes || [],
        stoolConditions: todayCatCare.stoolConditions || [],
        abnormalityMemo: todayCatCare.abnormalityMemo || '',
      });
    } else {
      setCurrentCare({
        stoolCount: 0,
        urineCount: 0,
        foodRemaining: 0,
        supplements: false,
        vomitTypes: [],
        stoolConditions: [],
        abnormalityMemo: '',
      });
    }
  }, [todayCatCare]);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText, today, selectedCategory);
      setNewTodoText('');
      setSelectedCategory('');
    }
  };

  const handleAddExercise = () => {
    let finalType = exerciseType;
    if (exerciseType === 'other') {
      finalType = customExercise || '기타 운동';
    }

    const exerciseData: any = {
      date: today,
      type: finalType,
      duration: parseInt(duration),
      intensity,
      memo,
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
    setCustomExercise('');
    setDuration('60');
    setIntensity('중간');
    setMemo('');
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

  const handleCareToggle = (field: keyof typeof currentCare) => {
    const newValue = !currentCare[field];
    setCurrentCare({ ...currentCare, [field]: newValue });

    if (todayCatCare) {
      updateCatCare(todayCatCare.id, { [field]: newValue });
    } else {
      addCatCare({
        date: today,
        ...currentCare,
        [field]: newValue,
      });
    }
  };

  const handleCareUpdate = (updates: Partial<typeof currentCare>) => {
    setCurrentCare({ ...currentCare, ...updates });

    if (todayCatCare) {
      updateCatCare(todayCatCare.id, updates);
    } else {
      addCatCare({
        date: today,
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

  const formatDate = () => {
    const date = new Date(today);
    return {
      title: 'Diary',
      subtitle: date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
    };
  };

  const dateInfo = formatDate();

  const completedCount = todayTodos.filter(t => t.completed).length;
  const totalCount = todayTodos.length;

  const vomitTypes = [
    { value: '투명', label: '투명', desc: '물, 위액 역류' },
    { value: '빽빽(거품)', label: '빽빽(거품)', desc: '공기 섞임' },
    { value: '사료토', label: '사료토', desc: '급하게 흡식' },
    { value: '헛구역질', label: '헛구역질', desc: '헤어볼' },
    { value: '노랑', label: '노랑', desc: '공복, 위액' },
    { value: '핑크', label: '핑크', desc: '소량 출혈' },
    { value: '짙은갈색', label: '짙은 갈색', desc: '출혈 의심' },
    { value: '녹색', label: '녹색', desc: '이물질/췌장' },
    { value: '이물질', label: '이물질', desc: '역류' },
    { value: '빨강', label: '빨강', desc: '심각한 출혈' },
  ];

  const stoolConditions = [
    { value: '변비', label: '변비', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: '무름', label: '무름', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: '설사', label: '설사', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { value: '혈변', label: '혈변', color: 'bg-red-100 text-red-800 border-red-200' },
  ];

  const careItems = [
    { key: 'litterBox' as const, label: '대소변' },
    { key: 'food' as const, label: '식사' },
    { key: 'vomit' as const, label: '구토 없음', reversed: true },
    { key: 'supplements' as const, label: '영양제' },
  ];

  const allCareChecked = currentCare.litterBox && currentCare.food && !currentCare.vomit && currentCare.supplements;

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

  const handleEditExercise = (ex: any) => {
    setEditingExerciseId(ex.id);
    if (ex.type === 'swimming' || ex.type === 'pilates') {
      setExerciseType(ex.type);
      setCustomExercise('');
    } else {
      setExerciseType('other');
      setCustomExercise(ex.type);
    }
    setDuration(ex.duration.toString());
    setIntensity(ex.intensity);
    setMemo(ex.memo || '');
    setBodyParts(ex.bodyParts || []);
    
    if (ex.type === 'swimming') {
      setSwimmingStyles(ex.swimmingStyles || {
        butterfly: 0,
        breaststroke: 0,
        freestyle: 0,
        backstroke: 0,
        kick: 0,
        kickboard: 0,
        turn: 0,
      });
      setTotalDistance(ex.totalDistance?.toString() || '');
    } else if (ex.type === 'pilates') {
      setPilatesEquipment(ex.pilatesEquipment || []);
    }
    
    setShowExerciseForm(true);
  };

  // 날짜 이동 함수
  const handlePrevDay = () => {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - 1);
    const newDate = currentDate.toISOString().split('T')[0];
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const handleNextDay = () => {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1);
    const newDate = currentDate.toISOString().split('T')[0];
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const handleToday = () => {
    const newDate = new Date().toISOString().split('T')[0];
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const isToday = today === new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen p-3 pb-20 pt-[24px]" style={{ background: '#FFF5F7' }}>
      <div className="max-w-2xl mx-auto space-y-3">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold" style={{ color: '#E63946' }}>
              {dateInfo.title}
            </h1>
            
            {/* 날짜 네비게이션 */}
            <div className="flex items-center justify-center gap-1">
              <Button
                onClick={handlePrevDay}
                size="sm"
                variant="ghost"
                className="rounded-full h-7 w-7 p-0 hover:bg-rose-100"
                style={{ color: '#E63946' }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {dateInfo.subtitle && <p className="text-xs text-gray-600 px-2">{dateInfo.subtitle}</p>}

              <Button
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  onDateChange?.(today);
                }}
                size="sm"
                variant="ghost"
                className="rounded-full h-7 w-7 p-0 text-lg hover:bg-rose-50"
              >
                🍒
              </Button>

              <Button
                onClick={handleNextDay}
                size="sm"
                variant="ghost"
                className="rounded-full h-7 w-7 p-0 hover:bg-rose-100"
                style={{ color: '#E63946' }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Today 버튼 - 오늘이 아닐 때만 표시 */}
            {!isToday && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center pt-1"
              >
                <Button
                  onClick={handleToday}
                  size="sm"
                  className="rounded-full h-6 px-3 text-[10px] shadow-sm"
                  style={{ 
                    backgroundColor: '#E63946',
                    color: 'white'
                  }}
                >
                  Today
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Todo List */}
        <TodoSection today={today} />

        {/* Event Section */}
        <EventSection today={today} />

        {/* Exercise Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl p-4 shadow-sm border hover:shadow-md transition-shadow bg-white"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                <Dumbbell className="w-4 h-4 text-gray-700" />
              </div>
              운동 ✨
            </h2>
            <Button
              onClick={() => setShowExerciseForm(!showExerciseForm)}
              size="sm"
              className="rounded-full shadow-sm bg-rose-500 hover:bg-rose-600 text-white h-8 px-3 text-sm"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              추가
            </Button>
          </div>

          <AnimatePresence>
            {showExerciseForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-gray-50 rounded-lg space-y-3"
              >
                <div className="space-y-2">
                  <Label className="text-xs">종류</Label>
                  <RadioGroup value={exerciseType} onValueChange={(v) => setExerciseType(v)}>
                    <div className="grid grid-cols-3 gap-2">
                      <label
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer transition-all border text-sm ${
                          exerciseType === 'pilates'
                            ? 'bg-rose-50 border-rose-500'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <RadioGroupItem value="pilates" className="sr-only" />
                        <Activity className={`w-4 h-4 ${exerciseType === 'pilates' ? 'text-rose-500' : 'text-gray-400'}`} />
                        <span className={exerciseType === 'pilates' ? 'font-semibold text-rose-900' : 'text-gray-600'}>
                          필라테스
                        </span>
                      </label>

                      <label
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer transition-all border text-sm ${
                          exerciseType === 'swimming'
                            ? 'bg-rose-50 border-rose-500'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <RadioGroupItem value="swimming" className="sr-only" />
                        <Waves className={`w-4 h-4 ${exerciseType === 'swimming' ? 'text-rose-500' : 'text-gray-400'}`} />
                        <span className={exerciseType === 'swimming' ? 'font-semibold text-rose-900' : 'text-gray-600'}>
                          수영
                        </span>
                      </label>

                      <label
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer transition-all border text-sm ${
                          exerciseType === 'other'
                            ? 'bg-rose-50 border-rose-500'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <RadioGroupItem value="other" className="sr-only" />
                        <Plus className={`w-4 h-4 ${exerciseType === 'other' ? 'text-rose-500' : 'text-gray-400'}`} />
                        <span className={exerciseType === 'other' ? 'font-semibold text-rose-900' : 'text-gray-600'}>
                          기타
                        </span>
                      </label>
                    </div>
                  </RadioGroup>

                  {exerciseType === 'other' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2"
                    >
                      <Label className="text-xs mb-1.5 block">운동 이름</Label>
                      <Input
                        value={customExercise}
                        onChange={(e) => setCustomExercise(e.target.value)}
                        placeholder="운동 이름을 입력하세요 (예: 헬스, 요가)"
                        className="bg-white"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">시간 (분)</Label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="rounded-lg bg-white"
                      placeholder="60"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">강도</Label>
                    <RadioGroup value={intensity} onValueChange={setIntensity}>
                      <div className="flex gap-1">
                        {['낮음', '중간', '높음'].map((level) => (
                          <label
                            key={level}
                            className={`flex-1 text-center p-2 rounded-lg cursor-pointer transition-all border text-xs ${
                              intensity === level
                                ? 'bg-rose-500 text-white border-rose-500'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <RadioGroupItem value={level} className="sr-only" />
                            {level}
                          </label>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">메모</Label>
                  <Textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="운동 관련 메모"
                    className="rounded-lg bg-white min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">운동 부위</Label>
                  <BodyPartSelector
                    selectedParts={bodyParts}
                    onToggle={toggleBodyPart}
                  />
                </div>

                {exerciseType === 'swimming' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">수 종목별 횟수</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'butterfly', label: '접영' },
                        { key: 'breaststroke', label: '평영' },
                        { key: 'freestyle', label: '자유형' },
                        { key: 'backstroke', label: '배영' },
                        { key: 'kick', label: '발차기' },
                        { key: 'kickboard', label: '킥판' },
                        { key: 'turn', label: '회전' },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                          <span className="text-sm text-gray-600 flex-1">{label}</span>
                          <Input
                            type="number"
                            value={swimmingStyles[key as keyof typeof swimmingStyles]}
                            onChange={(e) => updateSwimmingStyle(key as keyof typeof swimmingStyles, parseInt(e.target.value) || 0)}
                            className="w-16 rounded-lg text-center"
                            placeholder="0"
                            min="0"
                          />
                          <span className="text-xs text-gray-500">회</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">총 거리 (m)</Label>
                      <Input
                        type="number"
                        value={totalDistance}
                        onChange={(e) => setTotalDistance(e.target.value)}
                        className="rounded-lg bg-white"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                )}

                {exerciseType === 'pilates' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">사용 기구</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['바렐', '체어', '리포머', '캐딜락', '소도구', '매트'].map((equipment) => (
                        <button
                          key={equipment}
                          onClick={() => toggleEquipment(equipment)}
                          className={`p-2 text-sm rounded-lg border transition-all ${
                            pilatesEquipment.includes(equipment)
                              ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {equipment}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleAddExercise}
                  className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  저장
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {todayExercises.length > 0 ? (
            <div className="space-y-2">
              {todayExercises.map((ex) => (
                <motion.div 
                  key={ex.id} 
                  className="p-4 bg-gray-50 rounded-lg relative group"
                  whileTap={{ scale: 0.98 }}
                >
                  {/* 수정/삭제 버튼 */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => {
                        setEditingExerciseId(ex.id);
                        setExerciseType(ex.type);
                        setDuration(ex.duration.toString());
                        setIntensity(ex.intensity);
                        setMemo(ex.memo);
                        setBodyParts(ex.bodyParts || []);
                        if (ex.type === 'swimming') {
                          setSwimmingStyles(ex.swimmingStyles || {
                            butterfly: 0,
                            breaststroke: 0,
                            freestyle: 0,
                            backstroke: 0,
                            kick: 0,
                            kickboard: 0,
                            turn: 0,
                          });
                          setTotalDistance(ex.totalDistance?.toString() || '');
                        }
                        if (ex.type === 'pilates') {
                          setPilatesEquipment(ex.pilatesEquipment || []);
                        }
                        setShowExerciseForm(true);
                      }}
                      className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('이 운동 기록을 삭제하시겠습니까?')) {
                          deleteExercise(ex.id);
                        }
                      }}
                      className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-rose-50 hover:border-rose-300 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    </button>
                  </div>

                  <div className="flex items-start justify-between mb-2 pr-16">
                    <div className="flex items-center gap-3">
                      {ex.type === 'swimming' ? (
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <Waves className="w-5 h-5 text-indigo-600" />
                        </div>
                      ) : ex.type === 'pilates' ? (
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-indigo-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <Dumbbell className="w-5 h-5 text-indigo-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {ex.type === 'swimming' ? '수영' : ex.type === 'pilates' ? '필라테스' : ex.type}
                        </h3>
                        <p className="text-sm text-gray-600">{ex.duration}분 · {ex.intensity}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 수영 상세 정보 */}
                  {ex.type === 'swimming' && ex.swimmingStyles && (
                    <div className="mb-2 p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-2 font-semibold">수영 종목</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {ex.swimmingStyles.butterfly > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">접영</span>
                            <span className="font-semibold text-gray-900">{ex.swimmingStyles.butterfly}회</span>
                          </div>
                        )}
                        {ex.swimmingStyles.breaststroke > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">평영</span>
                            <span className="font-semibold text-gray-900">{ex.swimmingStyles.breaststroke}회</span>
                          </div>
                        )}
                        {ex.swimmingStyles.freestyle > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">자유형</span>
                            <span className="font-semibold text-gray-900">{ex.swimmingStyles.freestyle}회</span>
                          </div>
                        )}
                        {ex.swimmingStyles.backstroke > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">배영</span>
                            <span className="font-semibold text-gray-900">{ex.swimmingStyles.backstroke}회</span>
                          </div>
                        )}
                        {ex.swimmingStyles.kick > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">발차기</span>
                            <span className="font-semibold text-gray-900">{ex.swimmingStyles.kick}회</span>
                          </div>
                        )}
                        {ex.swimmingStyles.kickboard > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">킥판</span>
                            <span className="font-semibold text-gray-900">{ex.swimmingStyles.kickboard}회</span>
                          </div>
                        )}
                        {ex.swimmingStyles.turn > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">회전</span>
                            <span className="font-semibold text-gray-900">{ex.swimmingStyles.turn}회</span>
                          </div>
                        )}
                      </div>
                      {ex.totalDistance && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">총 거리</span>
                            <span className="text-sm font-bold text-indigo-600">{ex.totalDistance}m</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 필라테스 상세 정보 */}
                  {ex.type === 'pilates' && ex.pilatesEquipment && ex.pilatesEquipment.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1.5">사용 기구</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ex.pilatesEquipment.map((equipment) => (
                          <span
                            key={equipment}
                            className="inline-flex items-center px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-md font-medium"
                          >
                            {equipment}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {ex.bodyParts && ex.bodyParts.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1.5">운동 부위</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ex.bodyParts.map((part) => (
                          <span
                            key={part}
                            className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-md font-medium"
                          >
                            {part}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {ex.memo && (
                    <p className="text-sm text-gray-700 bg-white p-2 rounded">
                      {ex.memo}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>오늘 운동을 추가해보세요</p>
            </div>
          )}
        </motion.div>

        {/* Supplement Section */}
        <SupplementSection today={today} />

        {/* Language Study Section */}
        <LanguageStudySection today={today} />

        {/* Cat Care Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl p-4 shadow-sm border hover:shadow-md transition-shadow bg-white"
        >
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
              <Cat className="w-4 h-4 text-gray-700" />
            </div>
            고양이 케어 🐱
          </h2>

          <div className="space-y-4">
            {/* 대소변 + 식사량 + 양제 */}
            <div className="grid grid-cols-4 gap-2">
              {/* 대변 */}
              <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/60">
                <p className="text-[10px] text-amber-700 mb-1.5 font-medium">대변</p>
                <div className="flex items-center justify-between gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => decrementCount('stoolCount')}
                    className="h-6 w-6 p-0 rounded-lg border-amber-300/60 hover:bg-amber-100/60"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </Button>
                  <span className="text-lg font-bold text-amber-900">{currentCare.stoolCount}</span>
                  <Button
                    size="sm"
                    onClick={() => incrementCount('stoolCount')}
                    className="h-6 w-6 p-0 rounded-lg bg-amber-500/60 hover:bg-amber-600/60"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </Button>
                </div>
              </div>

              {/* 소변 */}
              <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-200/60">
                <p className="text-[10px] text-blue-700 mb-1.5 font-medium">소변</p>
                <div className="flex items-center justify-between gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => decrementCount('urineCount')}
                    className="h-6 w-6 p-0 rounded-lg border-blue-300/60 hover:bg-blue-100/60"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </Button>
                  <span className="text-lg font-bold text-blue-900">{currentCare.urineCount}</span>
                  <Button
                    size="sm"
                    onClick={() => incrementCount('urineCount')}
                    className="h-6 w-6 p-0 rounded-lg bg-blue-500/60 hover:bg-blue-600/60"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </Button>
                </div>
              </div>

              {/* 식사량 */}
              <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-200/60">
                <p className="text-[10px] text-rose-700 mb-1.5 font-medium">식사량</p>
                <div className="flex items-center gap-1 relative">
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={currentCare.foodRemaining === 0 ? '' : currentCare.foodRemaining}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      handleCareUpdate({ foodRemaining: value === '' ? 0 : parseInt(value) });
                    }}
                    className="h-6 rounded-lg bg-white text-xs px-1.5 pr-5 border-rose-200/60"
                    placeholder="0"
                  />
                  <span className="absolute right-2 text-[10px] text-gray-400 pointer-events-none">g</span>
                </div>
              </div>

              {/* 영양제 */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCareUpdate({ supplements: !currentCare.supplements })}
                className={`p-2.5 rounded-xl transition-all border ${
                  currentCare.supplements
                    ? 'bg-emerald-500/60 border-emerald-500/60 shadow-sm'
                    : 'bg-gray-50/60 border-gray-200/60 hover:bg-gray-100/60'
                }`}
              >
                <p className={`text-[10px] mb-1.5 font-medium ${currentCare.supplements ? 'text-emerald-100' : 'text-gray-600'}`}>영양제</p>
                <div className="flex items-center justify-center gap-1">
                  <span className={`font-bold text-xs ${currentCare.supplements ? 'text-white' : 'text-gray-900'}`}>
                    {currentCare.supplements ? '완료' : '섭취 전'}
                  </span>
                  {currentCare.supplements && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </motion.button>
            </div>

            {/* 특이사항 */}
            <div className="space-y-2">
              <button
                onClick={() => setShowAbnormalityDetails(!showAbnormalityDetails)}
                className="w-full flex items-center justify-between p-2.5 bg-orange-50/60 rounded-xl hover:bg-orange-100/60 transition-colors border border-orange-200/60"
              >
                <Label className="text-xs font-semibold text-orange-900 flex items-center gap-2 cursor-pointer">
                  <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                  특이사항
                </Label>
                <motion.div
                  animate={{ rotate: showAbnormalityDetails ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence>
                {showAbnormalityDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 overflow-hidden"
                  >
                    {/* 구토 종류 */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-gray-600">구토</p>
                      
                      {/* 선택된 구토 타입들 표시 */}
                      {currentCare.vomitTypes && currentCare.vomitTypes.length > 0 && (
                        <div className="space-y-1 mb-2">
                          {currentCare.vomitTypes.map((vomit, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-orange-50/60 rounded-lg border border-orange-200/60">
                              <span className="flex-1 text-xs font-semibold text-orange-900">
                                {vomitTypes.find(v => v.value === vomit.type)?.label}
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const updated = currentCare.vomitTypes.map((v, i) => 
                                      i === idx ? { ...v, count: Math.max(1, v.count - 1) } : v
                                    );
                                    handleCareUpdate({ vomitTypes: updated });
                                  }}
                                  className="h-5 w-5 p-0 rounded border-orange-300/60"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </Button>
                                <span className="text-xs font-bold text-orange-900 w-6 text-center">{vomit.count}</span>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const updated = currentCare.vomitTypes.map((v, i) => 
                                      i === idx ? { ...v, count: v.count + 1 } : v
                                    );
                                    handleCareUpdate({ vomitTypes: updated });
                                  }}
                                  className="h-5 w-5 p-0 rounded bg-orange-500/60 hover:bg-orange-600/60"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    const updated = currentCare.vomitTypes.filter((_, i) => i !== idx);
                                    handleCareUpdate({ vomitTypes: updated });
                                  }}
                                  className="h-5 w-5 p-0 rounded hover:bg-red-100"
                                >
                                  <Trash2 className="w-2.5 h-2.5 text-red-600" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-1.5">
                        {vomitTypes.slice(0, 5).map((type) => {
                          const isSelected = currentCare.vomitTypes?.some(v => v.type === type.value);
                          return (
                            <button
                              key={type.value}
                              onClick={() => {
                                if (isSelected) {
                                  // 이미 선택된 경우 제거
                                  const updated = currentCare.vomitTypes?.filter(v => v.type !== type.value) || [];
                                  handleCareUpdate({ vomitTypes: updated });
                                } else {
                                  // 새로 추가
                                  const updated = [...(currentCare.vomitTypes || []), { type: type.value, count: 1 }];
                                  handleCareUpdate({ vomitTypes: updated });
                                }
                              }}
                              className={`p-2 text-xs rounded-lg border transition-all text-left ${
                                isSelected
                                  ? 'bg-orange-100/60 text-orange-800 border-orange-200/60 font-semibold'
                                  : 'bg-gray-50/60 text-gray-600 border-gray-200/60 hover:bg-gray-100/60'
                              }`}
                            >
                              <div className="font-semibold">{type.label}</div>
                              <div className="text-[8px] opacity-70">{type.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                      {vomitTypes.length > 5 && (
                        <details className="mt-1.5">
                          <summary className="text-[10px] text-indigo-600 cursor-pointer hover:underline">
                            더 보기
                          </summary>
                          <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                            {vomitTypes.slice(5).map((type) => {
                              const isSelected = currentCare.vomitTypes?.some(v => v.type === type.value);
                              return (
                                <button
                                  key={type.value}
                                  onClick={() => {
                                    if (isSelected) {
                                      const updated = currentCare.vomitTypes?.filter(v => v.type !== type.value) || [];
                                      handleCareUpdate({ vomitTypes: updated });
                                    } else {
                                      const updated = [...(currentCare.vomitTypes || []), { type: type.value, count: 1 }];
                                      handleCareUpdate({ vomitTypes: updated });
                                    }
                                  }}
                                  className={`p-1.5 text-[10px] rounded-lg border transition-all text-left ${
                                    isSelected
                                      ? 'bg-red-100/60 text-red-800 border-red-200/60 font-semibold'
                                      : 'bg-gray-50/60 text-gray-600 border-gray-200/60 hover:bg-gray-100/60'
                                  }`}
                                >
                                  <div className="font-semibold">{type.label}</div>
                                  <div className="text-[8px] opacity-70">{type.desc}</div>
                                </button>
                              );
                            })}
                          </div>
                        </details>
                      )}
                    </div>

                    {/* 변 상태 */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-gray-600">변 상태</p>
                      
                      {/* 선택된 변 상태들 표시 */}
                      {currentCare.stoolConditions && currentCare.stoolConditions.length > 0 && (
                        <div className="space-y-1 mb-2">
                          {currentCare.stoolConditions.map((stool, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-amber-50/60 rounded-lg border border-amber-200/60">
                              <span className="flex-1 text-xs font-semibold text-amber-900">
                                {stoolConditions.find(s => s.value === stool.type)?.label}
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const updated = currentCare.stoolConditions.map((s, i) => 
                                      i === idx ? { ...s, count: Math.max(1, s.count - 1) } : s
                                    );
                                    handleCareUpdate({ stoolConditions: updated });
                                  }}
                                  className="h-5 w-5 p-0 rounded border-amber-300/60"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </Button>
                                <span className="text-xs font-bold text-amber-900 w-6 text-center">{stool.count}</span>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const updated = currentCare.stoolConditions.map((s, i) => 
                                      i === idx ? { ...s, count: s.count + 1 } : s
                                    );
                                    handleCareUpdate({ stoolConditions: updated });
                                  }}
                                  className="h-5 w-5 p-0 rounded bg-amber-500/60 hover:bg-amber-600/60"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    const updated = currentCare.stoolConditions.filter((_, i) => i !== idx);
                                    handleCareUpdate({ stoolConditions: updated });
                                  }}
                                  className="h-5 w-5 p-0 rounded hover:bg-red-100"
                                >
                                  <Trash2 className="w-2.5 h-2.5 text-red-600" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-4 gap-1.5">
                        {stoolConditions.map((condition) => {
                          const isSelected = currentCare.stoolConditions?.some(s => s.type === condition.value);
                          return (
                            <button
                              key={condition.value}
                              onClick={() => {
                                if (isSelected) {
                                  const updated = currentCare.stoolConditions?.filter(s => s.type !== condition.value) || [];
                                  handleCareUpdate({ stoolConditions: updated });
                                } else {
                                  const updated = [...(currentCare.stoolConditions || []), { type: condition.value, count: 1 }];
                                  handleCareUpdate({ stoolConditions: updated });
                                }
                              }}
                              className={`p-1.5 text-[10px] rounded-lg border transition-all font-semibold ${
                                isSelected
                                  ? condition.color
                                  : 'bg-gray-50/60 text-gray-600 border-gray-200/60 hover:bg-gray-100/60'
                              }`}
                            >
                              {condition.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 메모 */}
                    <div className="space-y-1.5">
                      <Textarea
                        value={currentCare.abnormalityMemo}
                        onChange={(e) => handleCareUpdate({ abnormalityMemo: e.target.value })}
                        placeholder="기타 특이사항을 기록하세요"
                        className="rounded-lg bg-gray-50 min-h-16 text-xs"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Day Log Section - 일기 & 사진 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl p-4 shadow-sm border hover:shadow-md transition-shadow bg-white"
        >
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
              <BookOpen className="w-4 h-4 text-gray-700" />
            </div>
            하루 기록 📝
          </h2>

          <div className="space-y-3">
            {/* 사진 업로드 */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-rose-500" />
                오늘의 사진
              </Label>
              <div className="relative">
                {todayDayLog?.photo ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img 
                      src={todayDayLog.photo} 
                      alt="오늘의 사진" 
                      className="w-full h-40 object-cover"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (todayDayLog) {
                          updateDayLog(todayDayLog.id, { photo: '' });
                        }
                      }}
                      className="absolute top-2 right-2 rounded-lg h-7 w-7 p-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <Camera className="w-7 h-7 text-gray-400 mb-1.5" />
                    <span className="text-xs text-gray-500">사진을 업로드하세요</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64String = reader.result as string;
                            if (todayDayLog) {
                              updateDayLog(todayDayLog.id, { photo: base64String });
                            } else {
                              addDayLog({
                                date: today,
                                memo: '',
                                photo: base64String,
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* 일기 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  오늘의 일기
                </Label>
                <button
                  onClick={() => {
                    const newValue = !todayDayLog?.showInCalendar;
                    if (todayDayLog) {
                      updateDayLog(todayDayLog.id, { showInCalendar: newValue });
                    } else {
                      addDayLog({
                        date: today,
                        memo: dayMemo,
                        photo: '',
                        showInCalendar: newValue,
                      });
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all border ${
                    todayDayLog?.showInCalendar
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <CalendarIcon className="w-3 h-3" />
                  {todayDayLog?.showInCalendar ? '캘린더 표시 ' : '캘린더 숨김'}
                </button>
              </div>
              <Textarea
                value={dayMemo}
                onChange={(e) => {
                  const newNote = e.target.value;
                  setDayMemo(newNote);
                  if (memoSaveTimer) {
                    clearTimeout(memoSaveTimer);
                  }
                  const timer = setTimeout(() => {
                    if (todayDayLog) {
                      updateDayLog(todayDayLog.id, { memo: newNote });
                    } else {
                      addDayLog({
                        date: today,
                        memo: newNote,
                        photo: '',
                        showInCalendar: false,
                      });
                    }
                  }, 1000);
                  setMemoSaveTimer(timer);
                }}
                placeholder="오늘 하루를 기록해보세요..."
                className="rounded-lg bg-gray-50 min-h-24 text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Completion Message */}
        {completedCount === totalCount && totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center"
          >
            <p className="text-sm text-indigo-900 font-semibold">오늘 할 일을 모두 완료했습니다</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};