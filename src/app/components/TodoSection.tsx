import React, { useCallback, useState, useRef } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Plus, Trash2, Tag, Clock, GripVertical, CheckCircle2, Edit2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TimePicker, formatTime12Hour } from '@/app/components/TimePicker';
import type { Todo } from '@/app/context/AppContext';

interface TodoSectionProps {
  today: string;
}

type SortMode = 'category' | 'time';

interface DraggableTodoItemProps {
  todo: Todo;
  index: number;
  category: string; // 현재 카테고리
  moveTodo: (dragIndex: number, hoverIndex: number) => void;
  onToggle: () => void;
  onDelete: () => void;
  onTimeChange: (time: string) => void;
  sortMode: SortMode;
  isDraggable: boolean;
}

interface DraggableCategoryHeaderProps {
  category: string;
  index: number;
  moveCategory: (dragIndex: number, hoverIndex: number) => void;
}

interface CategorySectionProps {
  category: string;
  index: number;
  categoryTodos: Todo[];
  onTodoDropped: (todoId: string, newCategory: string) => void;
  moveTodoInCategory: (category: string, dragIndex: number, hoverIndex: number, categoryTodos: Todo[]) => void;
  moveCategory: (dragIndex: number, hoverIndex: number) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  handleTimeChange: (id: string, time: string) => void;
  sortMode: SortMode;
}

const DraggableTodoItem: React.FC<DraggableTodoItemProps> = ({
  todo,
  index,
  category,
  moveTodo,
  onToggle,
  onDelete,
  onTimeChange,
  sortMode,
  isDraggable,
}) => {
  const [dragX, setDragX] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editTime, setEditTime] = useState(todo.time || '');
  const containerRef = useRef<HTMLDivElement>(null);

  const { updateTodo } = useApp();

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'TODO',
    item: { index, todoId: todo.id, category },
    canDrag: isDraggable && isLongPressing && !isEditing, // 편집 중에는 드래그 불가
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TODO',
    hover: (item: { index: number; todoId: string; category: string }) => {
      if (!isDraggable || !isLongPressing || isEditing) return;
      // 같은 카테고리 내에서만 순서 변경
      if (item.category === category && item.index !== index) {
        moveTodo(item.index, index);
        item.index = index;
      }
    },
  });

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const isHorizontal = Math.abs(info.offset.x) > Math.abs(info.offset.y);
    
    if (isHorizontal && Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // 오른쪽으로 스와이프 - 삭제
        setShowDelete(true);
        setTimeout(() => {
          onDelete();
          setIsLongPressing(false);
        }, 200);
      } else {
        // 왼쪽으로 스와이프 - 편집
        setIsEditing(true);
        setEditText(todo.text);
        setEditTime(todo.time || '');
        setDragX(0);
        setIsLongPressing(false);
      }
    } else {
      // 원위치로 복귀
      setDragX(0);
    }
  };

  const handlePressStart = () => {
    if (isEditing) return; // 편집 중에는 롱프레스 비활성화
    const timer = setTimeout(() => {
      setIsLongPressing(true);
      // 진동 피드백 (모바일에서만 작동)
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms 롱프레스
    setLongPressTimer(timer);
  };

  const handlePressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    // 드래그 중이 아니면 롱프레스 해제
    if (!isDragging) {
      setTimeout(() => setIsLongPressing(false), 100);
    }
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      updateTodo(todo.id, { 
        text: editText.trim(),
        time: editTime || undefined 
      });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(todo.text);
    setEditTime(todo.time || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 bg-indigo-50 rounded-lg border-2 border-indigo-500 space-y-2"
      >
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
          className="rounded-lg bg-white"
          placeholder="할 일 수정"
          autoFocus
        />
        <div className="flex items-center gap-2">
          <TimePicker
            value={editTime}
            onChange={setEditTime}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={handleSaveEdit}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            저장
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancelEdit}
            className="rounded-lg"
          >
            취소
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div 
      ref={(node) => {
        containerRef.current = node;
        if (isDraggable && isLongPressing) {
          drop(node);
        }
      }}
      className="relative overflow-hidden rounded-lg"
    >
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

      {/* 편집 배경 (왼쪽) */}
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
        initial={{ opacity: 0, x: -20 }}
        animate={{ 
          opacity: showDelete ? 0 : 1, 
          x: showDelete ? (dragX > 0 ? 300 : -300) : 0,
          scale: isLongPressing ? 1.02 : 1,
        }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ scale: { duration: 0.2 } }}
        className={`flex items-center gap-3 p-3 rounded-lg bg-gray-50 transition-colors relative z-0 border-l-4 ${ 
          isDragging ? 'opacity-50' : ''
        } ${
          isLongPressing ? 'shadow-lg bg-white' : 'hover:bg-gray-100'
        } ${
          todo.category === '운동' ? 'border-l-indigo-500' :
          todo.category === '공부' ? 'border-l-blue-500' :
          todo.category === '일' ? 'border-l-amber-500' :
          todo.category === '개인' ? 'border-l-rose-500' :
          'border-l-gray-300'
        }`}
        style={{
          touchAction: isLongPressing ? 'none' : 'pan-y',
        }}
      >
        {isLongPressing && isDraggable && (
          <div 
            ref={(node) => {
              if (isLongPressing && isDraggable) {
                drag(preview(node));
              }
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4 text-indigo-600" />
          </div>
        )}
        
        <Checkbox
          checked={todo.completed}
          onCheckedChange={onToggle}
          className="flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {todo.text}
          </p>
          {todo.category && (
            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium mt-1 ${
              todo.category === '운동' ? 'bg-indigo-100 text-indigo-700' :
              todo.category === '공부' ? 'bg-blue-100 text-blue-700' :
              todo.category === '일' ? 'bg-amber-100 text-amber-700' :
              todo.category === '개인' ? 'bg-rose-100 text-rose-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {todo.category}
            </span>
          )}
          {todo.time && (
            <span className="inline-block ml-1 px-2 py-0.5 rounded-md text-[10px] font-medium mt-1 bg-purple-100 text-purple-700">
              <Clock className="w-3 h-3 inline mr-0.5" />
              {formatTime12Hour(todo.time)}
            </span>
          )}
        </div>

        {/* 수정/삭제 버튼 - 항상 표시 */}
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
              setEditText(todo.text);
              setEditTime(todo.time || '');
            }}
            className="w-7 h-7 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-300 transition-all"
          >
            <Edit2 className="w-3 h-3 text-indigo-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('이 할 일을 삭제하시겠습니까?')) {
                onDelete();
              }
            }}
            className="w-7 h-7 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-rose-50 hover:border-rose-300 transition-all"
          >
            <Trash2 className="w-3 h-3 text-rose-600" />
          </button>
        </div>
      </motion.div>
      
      {/* 롱프레스 가이드 */}
      {isLongPressing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-0 right-0 text-center"
        >
          <div className="inline-block bg-gray-900 text-white text-xs px-3 py-1 rounded-full">
            ← 편집 | 삭제 → | ↕ 이동
          </div>
        </motion.div>
      )}
    </div>
  );
};

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  index,
  categoryTodos,
  onTodoDropped,
  moveTodoInCategory,
  moveCategory,
  toggleTodo,
  deleteTodo,
  handleTimeChange,
  sortMode,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CATEGORY',
    item: { index, category },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ['TODO', 'CATEGORY'],
    drop: (item: any) => {
      if (item.todoId) {
        // TODO 아이템이 드롭됨 - 카테고리 변경
        onTodoDropped(item.todoId, category);
      }
    },
    hover: (item: any) => {
      if (item.category && !item.todoId) {
        // 카테고리가 호버됨 - 순서 변경
        if (item.index !== index) {
          moveCategory(item.index, index);
          item.index = index;
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop}
      className={`space-y-2 p-3 rounded-lg transition-all ${
        isOver ? 'bg-rose-50' : 'bg-transparent'
      }`}
    >
      <div 
        ref={drag}
        className={`flex items-center gap-2 px-2 cursor-grab active:cursor-grabbing ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <GripVertical className="w-3.5 h-3.5 text-gray-400" />
        <Tag className="w-3.5 h-3.5 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700">{category}</h3>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {categoryTodos.map((todo, todoIndex) => (
            <DraggableTodoItem
              key={todo.id}
              todo={todo}
              index={todoIndex}
              category={category}
              moveTodo={(dragIndex, hoverIndex) => 
                moveTodoInCategory(category, dragIndex, hoverIndex, categoryTodos)
              }
              onToggle={() => toggleTodo(todo.id)}
              onDelete={() => deleteTodo(todo.id)}
              onTimeChange={(time) => handleTimeChange(todo.id, time)}
              sortMode={sortMode}
              isDraggable={true}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const TodoSection: React.FC<TodoSectionProps> = ({ today }) => {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo, reorderTodos, todoCategories, addTodoCategory, reorderCategories } = useApp();
  
  const [newTodoText, setNewTodoText] = React.useState('');
  const [newTodoTime, setNewTodoTime] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [showCategoryInput, setShowCategoryInput] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('전체');
  const [sortMode, setSortMode] = React.useState<SortMode>('category');
  const [showCategoryDropdown, setShowCategoryDropdown] = React.useState(false);
  const [showAddCategoryInDropdown, setShowAddCategoryInDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // 고정된 카테고리 목록
  const fixedCategories = ['개인', '업무', '운동', '고양이', '쇼핑', '기타'];

  // 드롭다운 외부 클릭 처리
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
        setShowAddCategoryInDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const todayTodos = todos.filter(todo => todo.date === today);

  const handleAddTodo = () => {
    console.log('=== handleAddTodo called ===');
    console.log('newTodoText:', newTodoText);
    console.log('selectedCategory:', selectedCategory);
    console.log('newTodoTime:', newTodoTime);
    console.log('newTodoText.trim():', newTodoText.trim());
    console.log('newTodoText.trim() length:', newTodoText.trim().length);
    
    if (newTodoText.trim()) {
      console.log('✅ Validation passed, adding todo...');
      const categoryToSend = selectedCategory || undefined;
      const timeToSend = newTodoTime || undefined;
      console.log('Sending category:', categoryToSend);
      console.log('Sending time:', timeToSend);
      
      addTodo(newTodoText.trim(), today, categoryToSend, timeToSend);
      
      setNewTodoText('');
      setNewTodoTime('');
      setSelectedCategory('');
      console.log('✅ Todo added, fields cleared');
    } else {
      console.log('❌ Todo text is empty, not adding');
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addTodoCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowCategoryInput(false);
    }
  };

  const handleTimeChange = (todoId: string, time: string) => {
    updateTodo(todoId, { time });
  };

  // Sort todos based on selected sort mode
  const getSortedTodos = (todosToSort: typeof todayTodos) => {
    switch (sortMode) {
      case 'time':
        return [...todosToSort].sort((a, b) => {
          const aTime = a.time || '';
          const bTime = b.time || '';
          
          // Items without time go to the end
          if (!aTime && !bTime) return 0;
          if (!aTime) return 1;
          if (!bTime) return -1;
          
          // Compare times in 24-hour format
          const timeCompare = aTime.localeCompare(bTime);
          if (timeCompare !== 0) {
            return timeCompare;
          }
          
          // If times are exactly equal, use timeOrder for manual sorting
          if (a.timeOrder !== undefined && b.timeOrder !== undefined) {
            return a.timeOrder - b.timeOrder;
          }
          
          return 0;
        });
      case 'category':
      default:
        return [...todosToSort].sort((a, b) => {
          // Sort by categoryOrder if exists
          if (a.categoryOrder !== undefined && b.categoryOrder !== undefined) {
            return a.categoryOrder - b.categoryOrder;
          }
          if (a.categoryOrder !== undefined) return -1;
          if (b.categoryOrder !== undefined) return 1;
          return 0;
        });
    }
  };

  const filteredTodos = categoryFilter === '전체' 
    ? todayTodos 
    : todayTodos.filter(todo => todo.category === categoryFilter);

  const sortedTodos = getSortedTodos(filteredTodos);

  const moveTodo = useCallback((dragIndex: number, hoverIndex: number) => {
    const dragTodo = sortedTodos[dragIndex];
    const newTodos = [...sortedTodos];
    newTodos.splice(dragIndex, 1);
    newTodos.splice(hoverIndex, 0, dragTodo);
    
    // Update order based on sort mode
    const orderField = sortMode === 'time' ? 'timeOrder' : 'categoryOrder';
    const updatedTodos = newTodos.map((todo, idx) => ({
      ...todo,
      [orderField]: idx,
    }));
    
    // Update the todos in context
    const allTodos = todos.map(t => {
      const updated = updatedTodos.find(ut => ut.id === t.id);
      return updated || t;
    });
    
    reorderTodos(allTodos);
  }, [todos, sortMode, sortedTodos, reorderTodos]);

  // 각 카테고리 그룹 내에서 드래그 앤 드롭
  const moveTodoInCategory = useCallback((category: string, dragIndex: number, hoverIndex: number, categoryTodos: Todo[]) => {
    const dragTodo = categoryTodos[dragIndex];
    const newTodos = [...categoryTodos];
    newTodos.splice(dragIndex, 1);
    newTodos.splice(hoverIndex, 0, dragTodo);
    
    // Update categoryOrder for this group
    const updatedTodos = newTodos.map((todo, idx) => ({
      ...todo,
      categoryOrder: idx,
    }));
    
    // Update the todos in context
    const allTodos = todos.map(t => {
      const updated = updatedTodos.find(ut => ut.id === t.id);
      return updated || t;
    });
    
    reorderTodos(allTodos);
  }, [todos, reorderTodos]);

  // 할 일을 다른 카테고리로 이동
  const handleTodoDropped = useCallback((todoId: string, newCategory: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (todo && todo.category !== newCategory) {
      updateTodo(todoId, { category: newCategory });
    }
  }, [todos, updateTodo]);

  // 카테고리 순서 변경
  const moveCategory = useCallback((dragIndex: number, hoverIndex: number) => {
    const newCategories = [...todoCategories];
    const [draggedCategory] = newCategories.splice(dragIndex, 1);
    newCategories.splice(hoverIndex, 0, draggedCategory);
    reorderCategories(newCategories);
  }, [todoCategories, reorderCategories]);

  return (
    <DndProvider backend={HTML5Backend}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl p-4 shadow-sm border hover:shadow-md transition-shadow bg-white"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
              <CheckCircle2 className="w-4 h-4 text-gray-700" />
            </div>
            할 일 ✓
          </h2>
          
          {/* Sort Mode Selector */}
          <div className="flex gap-1">
            <button
              onClick={() => setSortMode('category')}
              className={`p-1 flex items-center justify-center transition-colors ${
                sortMode === 'category'
                  ? 'text-rose-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Tag className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSortMode('time')}
              className={`p-1 flex items-center justify-center transition-colors ${
                sortMode === 'time'
                  ? 'text-rose-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Clock className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* 카테고리 필터 */}
        {sortMode === 'category' && (
          <div className="mb-3">
          </div>
        )}
        
        {/* 할 일 추가 */}
        <div className="mb-5 space-y-2">
          <div className="flex gap-2">
            <Input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              placeholder="새로운 할 일"
              className="flex-1 rounded-lg bg-gray-50 border-gray-200"
            />
            
            {/* 카테고리 드롭다운 */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className={`p-2 rounded-lg flex items-center justify-center border transition-all ${
                  selectedCategory
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Tag className="w-5 h-5" />
              </button>
              
              {/* 드롭다운 메뉴 */}
              <AnimatePresence>
                {showCategoryDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-auto max-h-60 overflow-y-auto"
                  >
                    <div className="p-1">
                      {/* 고정된 카테고리 목록 (기타 제외) */}
                      {fixedCategories.filter(cat => cat !== '기타').map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowCategoryDropdown(false);
                            setShowAddCategoryInDropdown(false);
                            setNewCategoryName('');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                            selectedCategory === category
                              ? 'bg-rose-50 text-rose-600 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                      
                      {/* 사용자 정의 카테고리 */}
                      {todoCategories.filter(cat => !fixedCategories.includes(cat)).map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowCategoryDropdown(false);
                            setShowAddCategoryInDropdown(false);
                            setNewCategoryName('');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                            selectedCategory === category
                              ? 'bg-rose-50 text-rose-600 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                      
                      {/* 기타 */}
                      <button
                        onClick={() => {
                          setSelectedCategory('기타');
                          setShowCategoryDropdown(false);
                          setShowAddCategoryInDropdown(false);
                          setNewCategoryName('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                          selectedCategory === '기타'
                            ? 'bg-rose-50 text-rose-600 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        기타
                      </button>
                      
                      <div className="h-px bg-gray-200 my-1" />
                      
                      {/* + 버튼 */}
                      {!showAddCategoryInDropdown ? (
                        <button
                          onClick={() => setShowAddCategoryInDropdown(true)}
                          className="w-full text-left px-3 py-2 rounded-md text-sm text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center font-semibold"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      ) : (
                        // 새 카테고리 입력창
                        <div className="relative w-20">
                          <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                if (newCategoryName.trim()) {
                                  addTodoCategory(newCategoryName.trim());
                                  setSelectedCategory(newCategoryName.trim());
                                  setNewCategoryName('');
                                  setShowAddCategoryInDropdown(false);
                                  setShowCategoryDropdown(false);
                                }
                              }
                            }}
                            placeholder="카테고리"
                            className="rounded-md bg-gray-50 border-gray-200 text-sm pr-8 w-full"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              if (newCategoryName.trim()) {
                                addTodoCategory(newCategoryName.trim());
                                setSelectedCategory(newCategoryName.trim());
                                setNewCategoryName('');
                                setShowAddCategoryInDropdown(false);
                                setShowCategoryDropdown(false);
                              }
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-600 hover:text-rose-700"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <TimePicker
              value={newTodoTime}
              onChange={(time) => setNewTodoTime(time)}
              className="flex-shrink-0"
            />
            <Button
              onClick={handleAddTodo}
              className="rounded-lg bg-rose-500 hover:bg-rose-600 text-white"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* 할 일 목록 */}
        <div className="space-y-4">
          {sortMode === 'category' && categoryFilter === '전체' ? (
            // 카테고리별 그룹화 with 드래그 앤 드롭
            <>
              {todoCategories.map((category, index) => {
                const categoryTodos = getSortedTodos(todayTodos.filter(todo => todo.category === category));
                if (categoryTodos.length === 0) return null;
                
                return (
                  <CategorySection
                    key={category}
                    category={category}
                    index={index}
                    categoryTodos={categoryTodos}
                    onTodoDropped={handleTodoDropped}
                    moveTodoInCategory={moveTodoInCategory}
                    moveCategory={moveCategory}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                    handleTimeChange={handleTimeChange}
                    sortMode={sortMode}
                  />
                );
              })}
              
              {/* 카테고리 없는 할 일 */}
              {todayTodos.filter(todo => !todo.category).length > 0 && (
                <CategorySection
                  category="미분류"
                  index={todoCategories.length}
                  categoryTodos={getSortedTodos(todayTodos.filter(todo => !todo.category))}
                  onTodoDropped={(todoId) => handleTodoDropped(todoId, '')}
                  moveTodoInCategory={moveTodoInCategory}
                  moveCategory={moveCategory}
                  toggleTodo={toggleTodo}
                  deleteTodo={deleteTodo}
                  handleTimeChange={handleTimeChange}
                  sortMode={sortMode}
                />
              )}
            </>
          ) : (
            // 시간순 또는 특정 카테고리 필터
            <div className="space-y-2">
              <AnimatePresence>
                {sortedTodos.map((todo, index) => (
                  <DraggableTodoItem
                    key={todo.id}
                    todo={todo}
                    index={index}
                    category={todo.category || ''}
                    moveTodo={moveTodo}
                    onToggle={() => toggleTodo(todo.id)}
                    onDelete={() => deleteTodo(todo.id)}
                    onTimeChange={(time) => handleTimeChange(todo.id, time)}
                    sortMode={sortMode}
                    isDraggable={true}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {todayTodos.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>할 일을 추가해보세요</p>
            </div>
          )}
          
          {todayTodos.length > 0 && sortedTodos.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>이 카테고리에 할 일이 없습니다</p>
            </div>
          )}
        </div>
      </motion.div>
    </DndProvider>
  );
};