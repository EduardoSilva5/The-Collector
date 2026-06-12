import React from 'react';
import { Item, Category } from '../types';
import { Grid, BarChart2, Package, Layers, Plus } from 'lucide-react';

interface StatsDashboardProps {
  items: Item[];
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  selectedCategoryId: string;
}

export default function StatsDashboard({
  items,
  categories,
  onSelectCategory,
  selectedCategoryId,
}: StatsDashboardProps) {
  // Count counts of items within category
  const getCategoryCount = (catId: string) => {
    return items.filter((item) => item.categoryId === catId).length;
  };

  const totalItems = items.length;
  const totalCategories = categories.length;

  // Let's list percentages and counts for each category
  const itemDistribution = categories.map((cat) => {
    const count = getCategoryCount(cat.id);
    const pVal = totalItems > 0 ? (count / totalItems) * 100 : 0;
    return {
      category: cat,
      count,
      percentage: Math.round(pVal),
    };
  });

  return (
    <div id="stats-dashboard-container" className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-teal-50 rounded-lg">
            <BarChart2 className="w-4 h-4 text-[#4db6ac]" />
          </div>
          <h3 className="text-sm font-bold text-[#263238]">Visão Geral da Coleção</h3>
        </div>
        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-mono font-semibold text-gray-500">
          Métricas
        </span>
      </div>

      {/* Grid count cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-[#f5f7f8] rounded-xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total de Itens</span>
            <p className="text-2xl font-extrabold text-[#263238] font-mono leading-none mt-1">{totalItems}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#4db6ac]">
            <Package className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 bg-[#f5f7f8] rounded-xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Categorias</span>
            <p className="text-2xl font-extrabold text-[#263238] font-mono leading-none mt-1">{totalCategories}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-150 flex items-center justify-center text-[#263238]">
            <Layers className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Breakdown sliders */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <span>Distribuição</span>
          <span>Itens (%)</span>
        </div>
        
        {itemDistribution.map(({ category, count, percentage }) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(isSelected ? '' : category.id)}
              className={`w-full text-left group focus:outline-none block transition-all rounded-lg p-1.5 -mx-1.5 hover:bg-slate-55`}
            >
              <div className="flex justify-between items-center text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full block border-2 border-white shadow-xs"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className={`font-semibold ${isSelected ? 'text-[#4db6ac] font-bold underlineUnderline' : 'text-gray-700'}`}>
                    {category.name}
                  </span>
                </div>
                <span className="font-mono text-gray-500 text-[11px]">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalItems > 0 ? (count / totalItems) * 100 : 0}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
