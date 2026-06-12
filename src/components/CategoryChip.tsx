import React from 'react';
import { Category } from '../types';
import CategoryIcon from './CategoryIcon';

interface CategoryChipProps {
  key?: string | number;
  category: Category;
  isActive: boolean;
  itemCount: number;
  onClick: () => void;
}

export default function CategoryChip({ category, isActive, itemCount, onClick }: CategoryChipProps) {
  return (
    <button
      id={`cat-chip-${category.id}`}
      onClick={onClick}
      className={`relative shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold select-none transition-all duration-250 cursor-pointer border ${
        isActive
          ? 'shadow-xs border-transparent text-white'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-slate-50'
      }`}
      style={{
        backgroundColor: isActive ? category.color : undefined,
        borderColor: !isActive ? '#e2e8f0' : undefined,
      }}
    >
      <CategoryIcon
        name={category.icon}
        className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-500'}`}
      />
      <span>{category.name}</span>
      <span
        className={`inline-flex items-center justify-center font-mono leading-none rounded-full px-1.5 py-0.5 text-[9px] ${
          isActive
            ? 'bg-white/20 text-white font-bold'
            : 'bg-slate-100 text-gray-500'
        }`}
      >
        {itemCount}
      </span>
    </button>
  );
}
