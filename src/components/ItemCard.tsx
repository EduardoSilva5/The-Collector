import React from 'react';
import { Item, Category } from '../types';
import CategoryIcon from './CategoryIcon';
import { MapPin, Calendar, Layers } from 'lucide-react';

interface ItemCardProps {
  key?: string | number;
  item: Item;
  category?: Category;
  onClick: () => void;
}

export default function ItemCard({ item, category, onClick }: ItemCardProps) {
  // Safe default background color
  const catColor = category?.color || '#b0bec5';
  
  // Custom customFields count
  const customFieldsCount = item.customFields ? Object.keys(item.customFields).length : 0;

  // Render nicely formatted date
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div
      id={`item-card-${item.id}`}
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-teal-200 shadow-2xs hover:shadow-sm transition-all duration-300 cursor-pointer flex flex-col group select-none active:scale-[0.98]"
    >
      {/* Target Image or Category Fallback */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center opacity-80"
            style={{ backgroundColor: `${catColor}15` }}
          >
            <div
              className="p-3.5 rounded-full flex items-center justify-center border-2 border-dashed"
              style={{ borderColor: catColor, color: catColor }}
            >
              <CategoryIcon name={category?.icon || 'Package'} className="w-8 h-8" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider mt-2" style={{ color: catColor }}>
              {category?.name || 'Sem Categoria'}
            </span>
          </div>
        )}

        {/* Floating Category Badge */}
        <div
          className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs"
          style={{ backgroundColor: catColor }}
        >
          <CategoryIcon name={category?.icon || 'Package'} className="w-3 h-3 text-white" />
          <span>{category?.name || 'Item'}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Item Name */}
          <h4 className="text-sm font-bold text-[#263238] line-clamp-2 leading-snug group-hover:text-teal-600 transition-colors">
            {item.name}
          </h4>

          {/* Location details */}
          <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium mt-1.5">
            <MapPin className="w-3 h-3 shrink-0 text-gray-400" />
            <span className="truncate">{item.location || 'Sem localização'}</span>
          </div>

          {/* Notes snippet snippet */}
          {item.notes && (
            <p className="text-xs text-gray-400 mt-2 line-clamp-2 italic leading-relaxed">
              "{item.notes}"
            </p>
          )}
        </div>

        {/* Footer info: attributes quantity & entry date */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-50 text-[10px] text-gray-400 font-semibold font-mono">
          <div className="flex items-center gap-1">
            {customFieldsCount > 0 ? (
              <span className="bg-teal-50 text-[#4db6ac] font-bold rounded-sm px-1.5 py-0.5 border border-teal-100/30 flex items-center gap-0.5">
                <Layers className="w-2.5 h-2.5" />
                <span>{customFieldsCount} {customFieldsCount === 1 ? 'atr' : 'atrs'}</span>
              </span>
            ) : (
              <span className="text-gray-300 font-normal">Nenhum atributo</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5 text-gray-300" />
            <span>{formatDate(item.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
