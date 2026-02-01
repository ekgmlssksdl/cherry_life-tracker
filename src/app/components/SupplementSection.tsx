import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pill, Check, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface SupplementSectionProps {
  today: string;
}

export const SupplementSection: React.FC<SupplementSectionProps> = ({ today }) => {
  const { supplements, addSupplement, updateSupplement, supplementItems, addSupplementItem, updateSupplementItem, deleteSupplementItem } = useApp();
  
  const [showManageModal, setShowManageModal] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: string; name: string; emoji: string } | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemEmoji, setNewItemEmoji] = useState('💊');
  
  const todaySupplement = supplements.find(s => s.date === today);
  
  const handleToggle = (itemId: string) => {
    const checkedIds = todaySupplement?.checkedSupplementIds || [];
    const isChecked = checkedIds.includes(itemId);
    
    if (todaySupplement) {
      updateSupplement(todaySupplement.id, {
        checkedSupplementIds: isChecked 
          ? checkedIds.filter(id => id !== itemId)
          : [...checkedIds, itemId]
      });
    } else {
      addSupplement({
        date: today,
        checkedSupplementIds: [itemId]
      });
    }
  };
  
  const handleAddItem = () => {
    if (newItemName.trim()) {
      addSupplementItem({
        name: newItemName.trim(),
        emoji: newItemEmoji
      });
      setNewItemName('');
      setNewItemEmoji('💊');
    }
  };
  
  const handleUpdateItem = () => {
    if (editingItem && editingItem.name.trim()) {
      updateSupplementItem(editingItem.id, {
        name: editingItem.name.trim(),
        emoji: editingItem.emoji
      });
      setEditingItem(null);
    }
  };
  
  const handleDeleteItem = (id: string) => {
    if (confirm('이 영양제를 삭제하시겠습니까?')) {
      deleteSupplementItem(id);
    }
  };
  
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-3xl p-4 shadow-sm border hover:shadow-md transition-shadow bg-white"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
              <Pill className="w-4 h-4 text-gray-700" />
            </div>
            영양제 섭취 💊
          </h2>
          <Button
            onClick={() => setShowManageModal(true)}
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {supplementItems.map((item) => {
            const isChecked = todaySupplement?.checkedSupplementIds?.includes(item.id) || false;
            
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToggle(item.id)}
                className={`p-2.5 rounded-xl transition-all border ${
                  isChecked
                    ? 'bg-purple-500/60 border-purple-500/60 shadow-sm'
                    : 'bg-gray-50/60 border-gray-200/60 hover:bg-gray-100/60'
                }`}
              >
                <p className={`text-[10px] mb-1.5 font-medium ${isChecked ? 'text-purple-100' : 'text-gray-600'}`}>
                  {item.name}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <span className={`text-base ${isChecked ? 'text-white' : 'text-gray-900'}`}>
                    {item.emoji}
                  </span>
                  {isChecked && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Manage Modal */}
      <AnimatePresence>
        {showManageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowManageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              style={{ fontFamily: 'OngleipParkDahyeon, sans-serif' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold" style={{ color: '#E63946' }}>영양제 관리</h3>
                <Button
                  onClick={() => setShowManageModal(false)}
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Add New Item */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-bold mb-3 text-sm">새 영양제 추가</h4>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder="이름"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="text"
                    placeholder="이모지"
                    value={newItemEmoji}
                    onChange={(e) => setNewItemEmoji(e.target.value)}
                    className="w-16 text-center"
                    maxLength={2}
                  />
                </div>
                <Button
                  onClick={handleAddItem}
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  disabled={!newItemName.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  추가
                </Button>
              </div>

              {/* Existing Items */}
              <div className="space-y-2">
                <h4 className="font-bold mb-3 text-sm">현재 영양제 목록</h4>
                {supplementItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                    {editingItem?.id === item.id ? (
                      <>
                        <Input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="flex-1"
                        />
                        <Input
                          type="text"
                          value={editingItem.emoji}
                          onChange={(e) => setEditingItem({ ...editingItem, emoji: e.target.value })}
                          className="w-16 text-center"
                          maxLength={2}
                        />
                        <Button
                          onClick={handleUpdateItem}
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button
                          onClick={() => setEditingItem(null)}
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">{item.emoji}</span>
                        <span className="flex-1 font-medium">{item.name}</span>
                        <Button
                          onClick={() => setEditingItem({ id: item.id, name: item.name, emoji: item.emoji })}
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteItem(item.id)}
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
