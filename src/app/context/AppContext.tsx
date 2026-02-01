import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-1427e4c0`;

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  category?: string;
  time?: string;
  categoryOrder?: number;
  timeOrder?: number;
}

export interface Exercise {
  id: string;
  date: string;
  type: string;
  duration: number;
  intensity: string;
  memo: string;
  swimmingStyles?: {
    butterfly?: number;
    breaststroke?: number;
    freestyle?: number;
    backstroke?: number;
    kick?: number;
    kickboard?: number;
    turn?: number;
  };
  totalDistance?: number;
  pilatesEquipment?: string[];
  bodyParts?: string[];
}

export interface CatCare {
  id: string;
  date: string;
  stoolCount: number;
  urineCount: number;
  foodRemaining: number;
  supplements: boolean;
  vomitTypes?: { type: string; count: number }[];
  stoolConditions?: { type: string; count: number }[];
  abnormalityMemo?: string;
}

export interface DayLog {
  id: string;
  date: string;
  photo?: string;
  memo: string;
  showInCalendar?: boolean;
}

export interface Event {
  id: string;
  date: string;
  endDate?: string;
  title: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  isAllDay: boolean;
  recurrence?: {
    type: 'none' | 'weekly' | 'monthly' | 'yearly' | 'custom';
    weekDays?: string[];
    interval?: number;
    unit?: 'day' | 'week' | 'month' | 'year';
  };
}

export interface SupplementItem {
  id: string;
  name: string;
  emoji: string;
}

export interface Supplement {
  id: string;
  date: string;
  checkedSupplementIds: string[];
}

export interface LanguageItem {
  id: string;
  name: string;
  flag: string;
}

export interface LanguageStudy {
  id: string;
  date: string;
  checkedLanguageIds: string[];
}

interface AppContextType {
  todos: Todo[];
  addTodo: (text: string, date: string, category?: string, time?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  reorderTodos: (reorderedTodos: Todo[]) => void;
  
  todoCategories: string[];
  addTodoCategory: (category: string) => void;
  reorderCategories: (reorderedCategories: string[]) => void;
  
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, 'id'>) => void;
  updateExercise: (id: string, updates: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
  
  catCares: CatCare[];
  addCatCare: (catCare: Omit<CatCare, 'id'>) => void;
  updateCatCare: (id: string, updates: Partial<CatCare>) => void;
  
  dayLogs: DayLog[];
  addDayLog: (log: Omit<DayLog, 'id'>) => void;
  updateDayLog: (id: string, updates: Partial<DayLog>) => void;
  
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  supplementItems: SupplementItem[];
  addSupplementItem: (item: Omit<SupplementItem, 'id'>) => void;
  updateSupplementItem: (id: string, updates: Partial<SupplementItem>) => void;
  deleteSupplementItem: (id: string) => void;
  
  supplements: Supplement[];
  addSupplement: (supplement: Omit<Supplement, 'id'>) => void;
  updateSupplement: (id: string, updates: Partial<Supplement>) => void;
  deleteSupplement: (id: string) => void;
  
  languageItems: LanguageItem[];
  addLanguageItem: (item: Omit<LanguageItem, 'id'>) => void;
  updateLanguageItem: (id: string, updates: Partial<LanguageItem>) => void;
  deleteLanguageItem: (id: string) => void;
  
  languageStudies: LanguageStudy[];
  addLanguageStudy: (study: Omit<LanguageStudy, 'id'>) => void;
  updateLanguageStudy: (id: string, updates: Partial<LanguageStudy>) => void;
  deleteLanguageStudy: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Dummy context for fallback (prevents crashes in preview mode)
const dummyContext: AppContextType = {
  todos: [],
  addTodo: () => {},
  toggleTodo: () => {},
  deleteTodo: () => {},
  updateTodo: () => {},
  reorderTodos: () => {},
  todoCategories: [],
  addTodoCategory: () => {},
  reorderCategories: () => {},
  exercises: [],
  addExercise: () => {},
  updateExercise: () => {},
  deleteExercise: () => {},
  catCares: [],
  addCatCare: () => {},
  updateCatCare: () => {},
  dayLogs: [],
  addDayLog: () => {},
  updateDayLog: () => {},
  events: [],
  addEvent: () => {},
  updateEvent: () => {},
  deleteEvent: () => {},
  supplementItems: [],
  addSupplementItem: () => {},
  updateSupplementItem: () => {},
  deleteSupplementItem: () => {},
  supplements: [],
  addSupplement: () => {},
  updateSupplement: () => {},
  deleteSupplement: () => {},
  languageItems: [],
  addLanguageItem: () => {},
  updateLanguageItem: () => {},
  deleteLanguageItem: () => {},
  languageStudies: [],
  addLanguageStudy: () => {},
  updateLanguageStudy: () => {},
  deleteLanguageStudy: () => {},
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    console.warn('useApp must be used within AppProvider. Using dummy context for preview.');
    return dummyContext;
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [catCares, setCatCares] = useState<CatCare[]>([]);
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [supplementItems, setSupplementItems] = useState<SupplementItem[]>([
    { id: '1', name: '유산균', emoji: '🦠' },
    { id: '2', name: '마그네슘', emoji: '💊' },
    { id: '3', name: '올리브오일', emoji: '🫒' },
    { id: '4', name: '기타', emoji: '💫' },
  ]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [languageItems, setLanguageItems] = useState<LanguageItem[]>([
    { id: '1', name: '영어', flag: '🇺🇸' },
    { id: '2', name: '프랑스어', flag: '🇫🇷' },
    { id: '3', name: '일본어', flag: '🇯🇵' },
    { id: '4', name: '스페인어', flag: '🇪🇸' },
  ]);
  const [languageStudies, setLanguageStudies] = useState<LanguageStudy[]>([]);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  
  // Local state for categories
  const [todoCategories, setTodoCategories] = useState<string[]>([
    '개인', '업무', '운동', '고양이', '쇼핑', '기타',
  ]);

  // Fetch data from server on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/data`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Server response: ${response.status}`);
        }

        const data = await response.json();
        
        console.log('✅ Database connected successfully');
        setIsDbConnected(true);
        
        setTodos(data.todos || []);
        setExercises(data.exercises || []);
        setCatCares(data.catCares || []);
        setDayLogs(data.dayLogs || []);
        setEvents(data.events || []);
        if (data.supplementItems) setSupplementItems(data.supplementItems);
        setSupplements(data.supplements || []);
        if (data.languageItems) setLanguageItems(data.languageItems);
        setLanguageStudies(data.languageStudies || []);
      } catch (error) {
        console.error('Error fetching data from server:', error);
        console.warn('Falling back to localStorage');
        setIsDbConnected(false);
        loadFromLocalStorage();
      }
    };

    fetchData();
  }, []);

  // Helper function to load data from localStorage
  const loadFromLocalStorage = () => {
    try {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) setTodos(JSON.parse(storedTodos));

      const storedExercises = localStorage.getItem('exercises');
      if (storedExercises) setExercises(JSON.parse(storedExercises));

      const storedCatCares = localStorage.getItem('catCares');
      if (storedCatCares) setCatCares(JSON.parse(storedCatCares));

      const storedDayLogs = localStorage.getItem('dayLogs');
      if (storedDayLogs) setDayLogs(JSON.parse(storedDayLogs));

      const storedEvents = localStorage.getItem('events');
      if (storedEvents) setEvents(JSON.parse(storedEvents));

      const storedSupplementItems = localStorage.getItem('supplementItems');
      if (storedSupplementItems) setSupplementItems(JSON.parse(storedSupplementItems));

      const storedSupplements = localStorage.getItem('supplements');
      if (storedSupplements) setSupplements(JSON.parse(storedSupplements));

      const storedLanguageItems = localStorage.getItem('languageItems');
      if (storedLanguageItems) setLanguageItems(JSON.parse(storedLanguageItems));

      const storedLanguageStudies = localStorage.getItem('languageStudies');
      if (storedLanguageStudies) setLanguageStudies(JSON.parse(storedLanguageStudies));
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  // Save to server helper
  const saveToServer = async (endpoint: string, data: any) => {
    if (!isDbConnected) return;
    
    try {
      const response = await fetch(`${SERVER_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(`Error saving to ${endpoint}:`, await response.text());
      }
    } catch (error) {
      console.error(`Error saving to ${endpoint}:`, error);
    }
  };

  // Auto-save todos to server/localStorage
  useEffect(() => {
    if (isDbConnected) {
      saveToServer('todos', { todos });
    } else {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isDbConnected]);

  useEffect(() => {
    if (isDbConnected) {
      saveToServer('exercises', { exercises });
    } else {
      localStorage.setItem('exercises', JSON.stringify(exercises));
    }
  }, [exercises, isDbConnected]);

  useEffect(() => {
    if (isDbConnected) {
      saveToServer('cat-cares', { catCares });
    } else {
      localStorage.setItem('catCares', JSON.stringify(catCares));
    }
  }, [catCares, isDbConnected]);

  useEffect(() => {
    if (isDbConnected) {
      saveToServer('day-logs', { dayLogs });
    } else {
      localStorage.setItem('dayLogs', JSON.stringify(dayLogs));
    }
  }, [dayLogs, isDbConnected]);

  useEffect(() => {
    if (isDbConnected) {
      saveToServer('events', { events });
    } else {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events, isDbConnected]);

  useEffect(() => {
    if (isDbConnected) {
      saveToServer('supplement-items', { supplementItems });
    } else {
      localStorage.setItem('supplementItems', JSON.stringify(supplementItems));
    }
  }, [supplementItems, isDbConnected]);

  useEffect(() => {
    if (isDbConnected) {
      saveToServer('supplements', { supplements });
    } else {
      localStorage.setItem('supplements', JSON.stringify(supplements));
    }
  }, [supplements, isDbConnected]);

  useEffect(() => {
    if (isDbConnected) {
      saveToServer('language-items', { languageItems });
    } else {
      localStorage.setItem('languageItems', JSON.stringify(languageItems));
    }
  }, [languageItems, isDbConnected]);

  useEffect(() => {
    if (isDbConnected) {
      saveToServer('language-studies', { languageStudies });
    } else {
      localStorage.setItem('languageStudies', JSON.stringify(languageStudies));
    }
  }, [languageStudies, isDbConnected]);

  // Todo operations
  const addTodo = (text: string, date: string, category?: string, time?: string) => {
    console.log('📝 Adding todo:', { text, date, category, time });
    const newTodo: Todo = { 
      id: Date.now().toString(), 
      text, 
      completed: false, 
      date, 
      category, 
      time 
    };
    setTodos(prev => [...prev, newTodo]);
    console.log('✅ Todo added successfully');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const reorderTodos = (reorderedTodos: Todo[]) => {
    setTodos(reorderedTodos);
  };

  const addTodoCategory = (category: string) => {
    if (!todoCategories.includes(category)) {
      setTodoCategories([...todoCategories, category]);
    }
  };

  const reorderCategories = (reorderedCategories: string[]) => {
    setTodoCategories(reorderedCategories);
  };

  // Exercise operations
  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    const newExercise = { ...exercise, id: Date.now().toString() };
    setExercises(prev => [...prev, newExercise]);
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  // Cat care operations
  const addCatCare = (catCare: Omit<CatCare, 'id'>) => {
    const newCare = { ...catCare, id: Date.now().toString() };
    setCatCares(prev => [...prev, newCare]);
  };

  const updateCatCare = (id: string, updates: Partial<CatCare>) => {
    setCatCares(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // Day log operations
  const addDayLog = (log: Omit<DayLog, 'id'>) => {
    const newLog = { ...log, id: Date.now().toString() };
    setDayLogs(prev => [...prev, newLog]);
  };

  const updateDayLog = (id: string, updates: Partial<DayLog>) => {
    setDayLogs(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  // Event operations
  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = { ...event, id: Date.now().toString() };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Supplement item operations
  const addSupplementItem = (item: Omit<SupplementItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    setSupplementItems(prev => [...prev, newItem]);
  };

  const updateSupplementItem = (id: string, updates: Partial<SupplementItem>) => {
    setSupplementItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteSupplementItem = (id: string) => {
    setSupplementItems(prev => prev.filter(item => item.id !== id));
    // Also remove this item from all supplement records
    setSupplements(prev => prev.map(s => ({
      ...s,
      checkedSupplementIds: s.checkedSupplementIds.filter(itemId => itemId !== id)
    })));
  };

  // Supplement operations
  const addSupplement = (supplement: Omit<Supplement, 'id'>) => {
    const newSupplement = { ...supplement, id: Date.now().toString() };
    setSupplements(prev => [...prev, newSupplement]);
  };

  const updateSupplement = (id: string, updates: Partial<Supplement>) => {
    setSupplements(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSupplement = (id: string) => {
    setSupplements(prev => prev.filter(s => s.id !== id));
  };

  // Language item operations
  const addLanguageItem = (item: Omit<LanguageItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    setLanguageItems(prev => [...prev, newItem]);
  };

  const updateLanguageItem = (id: string, updates: Partial<LanguageItem>) => {
    setLanguageItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteLanguageItem = (id: string) => {
    setLanguageItems(prev => prev.filter(item => item.id !== id));
    // Also remove this item from all language study records
    setLanguageStudies(prev => prev.map(s => ({
      ...s,
      checkedLanguageIds: s.checkedLanguageIds.filter(itemId => itemId !== id)
    })));
  };

  // Language study operations
  const addLanguageStudy = (study: Omit<LanguageStudy, 'id'>) => {
    const newStudy = { ...study, id: Date.now().toString() };
    setLanguageStudies(prev => [...prev, newStudy]);
  };

  const updateLanguageStudy = (id: string, updates: Partial<LanguageStudy>) => {
    setLanguageStudies(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteLanguageStudy = (id: string) => {
    setLanguageStudies(prev => prev.filter(l => l.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        updateTodo,
        reorderTodos,
        todoCategories,
        addTodoCategory,
        reorderCategories,
        exercises,
        addExercise,
        updateExercise,
        deleteExercise,
        catCares,
        addCatCare,
        updateCatCare,
        dayLogs,
        addDayLog,
        updateDayLog,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        supplementItems,
        addSupplementItem,
        updateSupplementItem,
        deleteSupplementItem,
        supplements,
        addSupplement,
        updateSupplement,
        deleteSupplement,
        languageItems,
        addLanguageItem,
        updateLanguageItem,
        deleteLanguageItem,
        languageStudies,
        addLanguageStudy,
        updateLanguageStudy,
        deleteLanguageStudy,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};