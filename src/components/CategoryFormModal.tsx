import React, { useState } from 'react';
import { Category } from '../types';
import CategoryIcon, { AVAILABLE_ICONS } from './CategoryIcon';
import { X, Sparkles, Plus } from 'lucide-react';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
}

const PALETTE_COLORS = [
  '#4db6ac', // Teal
  '#e57373', // Red
  '#f06292', // Pink
  '#ba68c8', // Purple
  '#7986cb', // Indigo
  '#4fc3f7', // Blue
  '#26a69a', // Medium Teal
  '#81c784', // Green
  '#d4e157', // Lime
  '#ffb74d', // Orange
  '#ff8a65', // Coral
  '#a1887f', // Brown
  '#90a4ae', // Grey-Slate
];

export default function CategoryFormModal({ isOpen, onClose, onSave }: CategoryFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Package');
  const [selectedColor, setSelectedColor] = useState('#4db6ac');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, insira o nome da categoria.');
      return;
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      icon: selectedIcon,
      color: selectedColor,
    };

    onSave(newCategory);
    
    // Clear inputs and close
    setName('');
    setDescription('');
    setSelectedIcon('Package');
    setSelectedColor('#4db6ac');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-100 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#263238] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4db6ac]" />
            <h3 className="text-sm font-bold">Nova Categoria Custom</h3>
          </div>
          <button
            id="btn-close-cat-modal"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="text-xs text-red-500 font-semibold bg-red-55 p-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Nome da Categoria *
            </label>
            <input
              type="text"
              id="input-cat-name"
              placeholder="Ex: Selos, Colecionáveis Geek, Vinis..."
              value={name || ''}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm bg-gray-50 border border-gray-200 focus:border-[#4db6ac] outline-none rounded-xl px-3.5 py-2 text-[#263238] font-medium transition"
              maxLength={25}
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Descrição Curta
            </label>
            <textarea
              id="input-cat-desc"
              placeholder="Breve resumo desta coleção..."
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm bg-gray-50 border border-gray-200 focus:border-[#4db6ac] outline-none rounded-xl px-3.5 py-1.5 text-[#263238] font-medium transition min-h-[60px] max-h-[100px] resize-none"
              maxLength={100}
            />
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Cor do Tema
            </label>
            <div className="flex flex-wrap gap-2">
              {PALETTE_COLORS.map((col) => {
                const isSelected = selectedColor === col;
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`w-6 h-6 rounded-full cursor-pointer relative transition hover:scale-110 flex items-center justify-center`}
                    style={{ backgroundColor: col }}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white block shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Picker Grid */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Escolha um Ícone representativo
            </label>
            <div className="grid grid-cols-4 gap-2 bg-gray-50 p-2.5 rounded-2xl border border-gray-150">
              {AVAILABLE_ICONS.map((iconItem) => {
                const isSelected = selectedIcon === iconItem.name;
                return (
                  <button
                    key={iconItem.name}
                    type="button"
                    title={iconItem.label}
                    onClick={() => setSelectedIcon(iconItem.name)}
                    className={`p-2.5 rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-white text-white shadow-xs border border-gray-100 scale-102'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                    }`}
                    style={{
                      backgroundColor: isSelected ? selectedColor : undefined,
                    }}
                  >
                    <iconItem.component className="w-4 h-4" />
                    <span className="text-[8px] font-medium truncate w-full text-center mt-1">
                      {iconItem.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              id="btn-cat-cancel"
              onClick={onClose}
              className="flex-1 text-xs font-semibold py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-slate-50 transition cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-cat-save"
              className="flex-1 text-xs font-bold py-2.5 rounded-xl text-white hover:bg-teal-600 transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              style={{ backgroundColor: selectedColor }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Categoria</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
