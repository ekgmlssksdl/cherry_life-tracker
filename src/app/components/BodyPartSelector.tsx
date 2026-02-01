import React, { useState } from 'react';

interface BodyPartSelectorProps {
  selectedParts: string[];
  onToggle: (part: string) => void;
}

export const BodyPartSelector: React.FC<BodyPartSelectorProps> = ({ selectedParts, onToggle }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const isSelected = (part: string) => selectedParts.includes(part);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const bodyPartCategories = [
    {
      category: '어깨',
      parts: [
        { name: '어깨 앞쪽', desc: '전면 삼각근. 팔을 앞으로 들어올릴 때 사용' },
        { name: '어깨 옆쪽', desc: '측면 삼각근. 팔을 옆으로 들어올릴 때 사용' },
        { name: '어깨 뒤쪽', desc: '후면 삼각근. 팔을 뒤로 당길 때 사용' },
        { name: '목/어깨 라인', desc: '승모근. 어깨를 으쓱하거나 목을 지탱' }
      ]
    },
    {
      category: '가슴',
      parts: [
        { name: '윗가슴', desc: '쇄골 아래쪽. 인클라인 동작' },
        { name: '중간 가슴', desc: '가슴 중앙. 일반적인 푸시 동작' },
        { name: '아랫가슴', desc: '가슴 하부. 디클라인 동작' },
        { name: '안쪽 가슴', desc: '가슴 안쪽 라인. 모으는 동작' }
      ]
    },
    {
      category: '등',
      parts: [
        { name: '등 전체(광배근)', desc: '등의 넓은 부위. 당기는 동작' },
        { name: '등 윗부분', desc: '승모근/능형근. 견갑골 주변' },
        { name: '척추 라인', desc: '기립근. 허리와 척추 지탱' },
        { name: '허리 아랫부분', desc: '등 하부' }
      ]
    },
    {
      category: '팔',
      parts: [
        { name: '알통(이두)', desc: '팔 앞쪽. 팔을 굽히는 동작' },
        { name: '팔뚝 뒤(삼두)', desc: '팔 뒤쪽. 팔을 펴는 동작' },
        { name: '팔뚝(전완)', desc: '손목과 악력' }
      ]
    },
    {
      category: '복부',
      parts: [
        { name: '윗배', desc: '상복부' },
        { name: '아랫배', desc: '하복부. 다리 들기 동작' },
        { name: '옆구리', desc: '복사근. 비틀기 동작' },
        { name: '코어', desc: '몸통 중심을 잡아주는 속근육' }
      ]
    },
    {
      category: '엉덩이',
      parts: [
        { name: '엉덩이 전체', desc: '대둔근. 힙 업의 핵심' },
        { name: '엉덩이 옆쪽', desc: '중둔근. 골반 라인' },
        { name: '엉덩이 깊은곳', desc: '소둔근. 고관절 안정' }
      ]
    },
    {
      category: '허벅지',
      parts: [
        { name: '앞 허벅지', desc: '대퇴사두근. 무릎 펴기' },
        { name: '뒷 허벅지', desc: '햄스트링. 무릎 굽히기' },
        { name: '안쪽 허벅지', desc: '내전근. 다리 모으기' },
        { name: '바깥 허벅지', desc: '승마살 부위' }
      ]
    },
    {
      category: '종아리',
      parts: [
        { name: '종아리 알', desc: '비복근. 발목 펴기' },
        { name: '종아리 전체', desc: '가자미근. 서 있을 때 사용' }
      ]
    },
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">운동 부위 선택</p>
      <div className="space-y-3">
        {bodyPartCategories.map((group) => (
          <div key={group.category} className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-600">{group.category}</p>
              <button
                onClick={() => toggleCategory(group.category)}
                className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
              >
                {expandedCategories.has(group.category) ? '설명 숨기기' : '설명 보기'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.parts.map((part) => (
                <button
                  key={part.name}
                  onClick={() => onToggle(part.name)}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                    isSelected(part.name)
                      ? 'bg-red-500 text-white border-red-600 shadow-sm font-semibold'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {part.name}
                </button>
              ))}
            </div>
            {expandedCategories.has(group.category) && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                {group.parts.map((part) => (
                  <div key={part.name} className="flex gap-2">
                    <span className="text-xs font-medium text-gray-700 min-w-[80px]">{part.name}:</span>
                    <span className="text-xs text-gray-500">{part.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {selectedParts.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">선택된 부위:</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedParts.map((part) => (
              <span
                key={part}
                className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md"
              >
                {part}
                <button
                  onClick={() => onToggle(part)}
                  className="hover:bg-red-200 rounded-full p-0.5"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};