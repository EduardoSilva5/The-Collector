import React, { useState } from 'react';
import { Item, Category } from '../types';
import CategoryIcon from './CategoryIcon';
import { MapPin, Calendar, Edit, Trash2, X, Tag, FileText, Maximize2, Minimize2 } from 'lucide-react';

interface ItemModalProps {
  key?: string | number;
  isOpen: boolean;
  onClose: () => void;
  item?: Item;
  category?: Category;
  onEdit: (item: Item) => void;
  onDelete: (itemId: string) => void;
}

export default function ItemModal({ isOpen, onClose, item, category, onEdit, onDelete }: ItemModalProps) {
  const [isImageExpanded, setIsImageExpanded] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  if (!isOpen || !item) return null;

  const catColor = category?.color || '#b0bec5';

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const handleEditTrigger = () => {
    onEdit(item);
    onClose();
  };

  const handleDeleteTrigger = () => {
    setShowConfirmDelete(true);
  };

  const customFieldsCount = item.customFields ? Object.keys(item.customFields).length : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-100 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-150 flex flex-col max-h-[90vh] relative">
        
        {/* Custom deletion warning overlay */}
        {showConfirmDelete && (
          <div id="modal-confirm-delete-item" className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-50 animate-fadeIn">
            <div className="p-3.5 rounded-full bg-red-50 text-red-500 mb-4 border border-red-100">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-[#263238] mb-1.5 px-3 leading-snug">
              Tem certeza que deseja excluir este objeto?
            </h3>
            <p className="text-xs text-gray-400 mb-6 max-w-[210px] leading-normal font-medium">
              "{item.name}" será removido permanentemente do seu acervo pessoal.
            </p>
            <div className="flex gap-3 w-52">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-bold transition cursor-pointer"
              >
                Não
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(item.id);
                  onClose();
                }}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
              >
                Sim
              </button>
            </div>
          </div>
        )}

        {/* Cover / Image Header Area */}
        <div 
          className={`relative w-full bg-slate-50 shrink-0 transition-all duration-300 overflow-hidden ${
            item.image 
              ? (isImageExpanded ? 'h-52' : 'h-20') 
              : 'aspect-video'
          }`}
        >
          {item.image ? (
            <div className="relative w-full h-full">
              <img 
                src={item.image} 
                alt={item.name} 
                referrerPolicy="no-referrer" 
                className="w-full h-full object-cover" 
              />
              {/* Expand / Minimize button */}
              <button
                type="button"
                onClick={() => setIsImageExpanded(!isImageExpanded)}
                className="absolute right-3.5 bottom-2 bg-black/60 hover:bg-black/80 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 shadow-xs transition duration-200 cursor-pointer"
              >
                {isImageExpanded ? (
                  <>
                    <Minimize2 className="w-3 h-3 text-white" />
                    <span>Recolher</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3 h-3 text-white" />
                    <span>Expandir</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center opacity-85"
              style={{ backgroundColor: `${catColor}15` }}
            >
              <div
                className="p-4 rounded-full flex items-center justify-center border-2 border-dashed"
                style={{ borderColor: catColor, color: catColor }}
              >
                <CategoryIcon name={category?.icon || 'Package'} className="w-10 h-10" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider mt-2.5" style={{ color: catColor }}>
                {category?.name || 'Item'}
              </span>
            </div>
          )}

          {/* Close trigger */}
          <button
            id="btn-close-item-detail"
            onClick={onClose}
            className="absolute top-2.5 right-3.5 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 transition cursor-pointer z-10 shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Category Chip floating */}
          <div
            className="absolute bottom-2 left-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs"
            style={{ backgroundColor: catColor }}
          >
            <CategoryIcon name={category?.icon || 'Package'} className="w-3 h-3 text-white" />
            <span>{category?.name || 'Acervo'}</span>
          </div>
        </div>

        {/* Scrollable details wrapper */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* Main Titles */}
          <div>
            <h3 className="text-lg font-extrabold text-[#263238] leading-tight">
              {item.name}
            </h3>

            {/* Location details */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold mt-2 bg-slate-50 border border-slate-100 py-1.5 px-3 rounded-xl w-fit">
              <MapPin className="w-3.5 h-3.5 text-[#4db6ac]" />
              <span>📍 {item.location || 'Sem localização estipulada'}</span>
            </div>
          </div>

          {/* Notes description paragraph */}
          {item.notes ? (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1.5 text-gray-400">
                <FileText className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Anotações do Colecionador</span>
              </div>
              <p className="text-xs text-gray-650 leading-relaxed italic">
                "{item.notes}"
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">Nenhuma anotação registrada para este item.</p>
          )}

          {/* Custom specifications / characteristics section */}
          {customFieldsCount > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ficha Técnica e Atributos</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(item.customFields!).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl flex flex-col text-left transition-all hover:bg-slate-55"
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wide text-gray-400 block truncate">
                      {key}
                    </span>
                    <span className="text-xs font-semibold text-[#263238] block truncate mt-0.5" title={value}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Addition Log Metric */}
          <div className="flex items-center gap-1 text-[10px] text-gray-450 font-mono font-bold mt-2">
            <Calendar className="w-3 h-3 text-gray-300" />
            <span>Cadastrado em: {formatDate(item.createdAt)}</span>
          </div>
        </div>

        {/* Dynamic Action Lever Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 shrink-0">
          <button
            onClick={handleDeleteTrigger}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir</span>
          </button>
          
          <button
            onClick={handleEditTrigger}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-xs font-bold shadow-sm hover:opacity-90 transition cursor-pointer"
            style={{ backgroundColor: catColor }}
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
