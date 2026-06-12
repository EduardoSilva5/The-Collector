import React, { useState, useEffect } from 'react';
import { Item, Category } from './types';
import { DEFAULT_CATEGORIES, INITIAL_ITEMS } from './data/defaultData';
import MobileFrame from './components/MobileFrame';
import StatsDashboard from './components/StatsDashboard';
import CategoryChip from './components/CategoryChip';
import ItemCard from './components/ItemCard';
import ItemModal from './components/ItemModal';
import ItemFormModal from './components/ItemFormModal';
import CategoryFormModal from './components/CategoryFormModal';
import { 
  Plus, 
  Search, 
  Layers, 
  Settings2, 
  BarChart4, 
  RotateCcw, 
  SlidersHorizontal,
  FolderPlus,
  HelpCircle,
  TrendingUp,
  Folder,
  Trash2,
  Sparkles
} from 'lucide-react';
import CategoryIcon from './components/CategoryIcon';

export default function App() {
  // Persistence States
  const [items, setItems] = useState<Item[]>(() => {
    const raw = localStorage.getItem('the_collector_items_v2');
    return raw ? JSON.parse(raw) : INITIAL_ITEMS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const raw = localStorage.getItem('the_collector_categories_v2');
    return raw ? JSON.parse(raw) : DEFAULT_CATEGORIES;
  });

  // Navigation and Filter States
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest'); // newest, oldest, name-asc, name-desc
  const [showStats, setShowStats] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modal Control States
  const [isItemFormOpen, setIsItemFormOpen] = useState<boolean>(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState<boolean>(false);
  const [activeItemToView, setActiveItemToView] = useState<Item | undefined>(undefined);
  const [activeItemToEdit, setActiveItemToEdit] = useState<Item | undefined>(undefined);
  const [confirmDeleteAllOpen, setConfirmDeleteAllOpen] = useState<boolean>(false);
  const [confirmDeleteCategoryOpen, setConfirmDeleteCategoryOpen] = useState<boolean>(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState<boolean>(false);

  // Sync state with localStorage on changes
  useEffect(() => {
    localStorage.setItem('the_collector_items_v2', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('the_collector_categories_v2', JSON.stringify(categories));
  }, [categories]);

  // Handle item actions
  const handleSaveItem = (savedItem: Item) => {
    const exists = items.some((item) => item.id === savedItem.id);
    if (exists) {
      setItems(items.map((item) => (item.id === savedItem.id ? savedItem : item)));
    } else {
      setItems([savedItem, ...items]);
    }
    setIsItemFormOpen(false);
    setActiveItemToEdit(undefined);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
    if (activeItemToView?.id === itemId) {
      setActiveItemToView(undefined);
    }
  };

  const handleEditItemTrigger = (itemToEdit: Item) => {
    setActiveItemToEdit(itemToEdit);
    setIsItemFormOpen(true);
  };

  // Handle category creation
  const handleSaveCategory = (newCategory: Category) => {
    setCategories([...categories, newCategory]);
    setIsCategoryFormOpen(false);
  };

  // Reset collections to defaults or start fresh
  const handleResetToDefaults = () => {
    setConfirmResetOpen(true);
  };

  const handleClearAll = () => {
    setConfirmDeleteAllOpen(true);
  };

  const handleDeleteCategory = (catId: string) => {
    const hasOthers = categories.some((c) => c.id === 'cat-others');
    let fallbackId = 'cat-others';
    if (!hasOthers && categories.length > 0) {
      const possibleFallback = categories.find((c) => c.id !== catId);
      fallbackId = possibleFallback ? possibleFallback.id : '';
    }

    setItems(items.map(item => {
      if (item.categoryId === catId) {
        return { ...item, categoryId: fallbackId };
      }
      return item;
    }));

    setCategories(categories.filter((cat) => cat.id !== catId));
    setSelectedCategoryId('');
  };

  const handlePopulateSampleDataForce = () => {
    setItems(INITIAL_ITEMS);
    setCategories(DEFAULT_CATEGORIES);
  };

  // Extract all unique locations for form autocompletion
  const existingLocations = Array.from(
    new Set(items.map((item) => item.location).filter((loc) => !!loc))
  ) as string[];

  // Filter & Search Logic
  const filteredItems = items.filter((item) => {
    // Category match
    const categoryMatch = selectedCategoryId === '' || item.categoryId === selectedCategoryId;
    
    // Keyword match
    const normSearch = searchQuery.toLowerCase().trim();
    if (!normSearch) return categoryMatch;

    const nameMatch = item.name.toLowerCase().includes(normSearch);
    const locationMatch = item.location.toLowerCase().includes(normSearch);
    const notesMatch = item.notes.toLowerCase().includes(normSearch);
    
    const categoryInfo = categories.find((c) => c.id === item.categoryId);
    const categoryNameMatch = categoryInfo?.name.toLowerCase().includes(normSearch) || false;

    // Check custom fields values
    const customFieldsMatch = item.customFields
      ? Object.entries(item.customFields).some(
          ([key, value]) =>
            key.toLowerCase().includes(normSearch) || String(value).toLowerCase().includes(normSearch)
        )
      : false;

    return categoryMatch && (nameMatch || locationMatch || notesMatch || categoryNameMatch || customFieldsMatch);
  });

  // Sort Logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  return (
    <MobileFrame isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen}>
      <div id="the-collector-app" className="flex-1 flex flex-col min-h-0 bg-[#f5f7f8] relative">
        
        {/* Main Sticky Header */}
        <header className="bg-[#263238] text-white px-5 py-4 shrink-0 shadow-md">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#4db6ac] flex items-center justify-center text-[#263238] shadow-sm select-none">
                <span className="font-extrabold text-[#263238] text-lg font-mono">C</span>
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-white leading-none">The Collector</h1>
                <span className="text-[10px] text-[#b0bec5] font-medium leading-none">Módulo de Inventário Pessoal</span>
              </div>
            </div>

            {/* Config & quick controller buttons */}
            <div className="flex items-center gap-1.5">
              <button
                title="Estatísticas do Acervo"
                onClick={() => setShowStats(!showStats)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  showStats ? 'bg-[#4db6ac] text-[#263238]' : 'hover:bg-slate-700/60 text-[#b0bec5]'
                }`}
              >
                <BarChart4 className="w-4 h-4" />
              </button>
              <button
                title="Cadastrar Categoria"
                onClick={() => setIsCategoryFormOpen(true)}
                className="p-1.5 rounded-lg text-[#b0bec5] hover:bg-slate-700/60 hover:text-white transition-colors cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
              <button
                title="Restaurar Padrões"
                onClick={handleResetToDefaults}
                className="p-1.5 rounded-lg text-[#b0bec5] hover:bg-slate-700/60 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Viewport Wrapper */}
        <main className="flex-1 p-4 space-y-4 overflow-y-auto select-none scrollbar-style pb-24">
          
          {/* Dashboard Stats Box if toggled */}
          {showStats && (
            <StatsDashboard
              items={items}
              categories={categories}
              onSelectCategory={(cid) => setSelectedCategoryId(cid)}
              selectedCategoryId={selectedCategoryId}
            />
          )}

          {/* Core Controls: Search, Sort & Clear Options */}
          <div className="space-y-2.5">
            {/* Search Input and sorting dropdown */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Pesquisar por nome, local, notas ou tags..."
                  value={searchQuery || ''}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-white border border-gray-200 outline-none rounded-xl pl-9 pr-8 py-2.5 text-[#263238] focus:border-teal-500 font-semibold shadow-2xs placeholder-gray-400 transition"
                />
                <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-gray-300 hover:text-gray-500 font-mono text-xs rounded-full p-0.5"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Grid or sorting options */}
              <select
                value={sortBy || 'newest'}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-white border border-gray-200 outline-none rounded-xl px-2.5 py-2 text-[#263238] font-semibold cursor-pointer shadow-3xs"
              >
                <option value="newest">Mais Novos</option>
                <option value="oldest">Mais Antigos</option>
                <option value="name-asc">A - Z</option>
                <option value="name-desc">Z - A</option>
              </select>
            </div>

            {/* Custom customizable quick Category filter track */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none shrink-0 z-10 selector-track">
              {/* All Categories Chip */}
              <button
                onClick={() => setSelectedCategoryId('')}
                className={`relative shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  selectedCategoryId === ''
                    ? 'bg-[#263238] border-transparent text-white shadow-3xs'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Todos</span>
                <span className="font-mono text-[9px] bg-slate-100 text-gray-500 rounded-full px-1.5 py-0.2 ml-0.5 font-bold">
                  {items.length}
                </span>
              </button>

              {/* Dynamic Categories */}
              {categories.map((cat) => {
                const count = items.filter((item) => item.categoryId === cat.id).length;
                return (
                  <CategoryChip
                    key={cat.id}
                    category={cat}
                    isActive={selectedCategoryId === cat.id}
                    itemCount={count}
                    onClick={() => setSelectedCategoryId(selectedCategoryId === cat.id ? '' : cat.id)}
                  />
                );
              })}

              {/* Direct Quick Add Category option */}
              <button
                onClick={() => setIsCategoryFormOpen(true)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-gray-300 text-teal-600 font-bold text-xs hover:border-teal-500 hover:bg-teal-50 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Coleção</span>
              </button>
            </div>
          </div>

          {/* Subtitle list header */}
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            <span className="flex items-center gap-2">
              {selectedCategoryId 
                ? `${categories.find((c) => c.id === selectedCategoryId)?.name || 'Coleção'} (${sortedItems.length})` 
                : `Acervo Completo (${sortedItems.length})`}
              {selectedCategoryId && (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteCategoryOpen(true)}
                  className="text-red-500 hover:text-red-650 flex items-center gap-1 text-[10px] uppercase font-bold border border-red-200 bg-red-50 px-2.5 py-1 rounded-xl ml-2 cursor-pointer transition shadow-3xs"
                  title="Excluir esta categoria"
                >
                  <Trash2 className="w-2.5 h-2.5 text-red-500" />
                  <span>excluir categoria</span>
                </button>
              )}
            </span>
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 font-bold text-[10px] uppercase py-1.5 px-3 rounded-xl transition flex items-center gap-1 cursor-pointer shadow-3xs"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>excluir tudo</span>
              </button>
            )}
          </div>

          {/* Empty States logic */}
          {sortedItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-3xs flex flex-col items-center justify-center py-10">
              <div className="p-4 rounded-full bg-slate-50 text-gray-300 mb-3 border border-gray-150">
                <Folder className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-sm font-bold text-[#263238]">Nenhum item localizado</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-[240px] leading-normal font-medium">
                {items.length === 0
                  ? 'O inventário está limpo. Comece cadastrando um item ou popule com dados de teste.'
                  : 'Nenhum objeto corresponde aos filtros ou termos de pesquisa ativos.'}
              </p>

              {items.length === 0 ? (
                <div className="flex flex-col gap-2 w-full mt-4 max-w-[220px]">
                  <button
                    onClick={() => setIsItemFormOpen(true)}
                    className="w-full text-xs bg-[#4db6ac] hover:bg-teal-600 text-white font-bold py-2 px-3 rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Primeiro Item</span>
                  </button>
                  <button
                    onClick={handlePopulateSampleDataForce}
                    className="w-full text-xs border border-teal-200 text-teal-600 bg-teal-50 hover:bg-teal-100 font-semibold py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Dados de Coleção Exemplo</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategoryId('');
                  }}
                  className="mt-3 text-xs text-[#4db6ac] hover:underline font-bold cursor-pointer"
                >
                  Limpar todos os Filtros
                </button>
              )}
            </div>
          ) : (
            /* Items responsive grid */
            <div className="grid grid-cols-2 gap-3.5" id="inventory-grid">
              {sortedItems.map((item) => {
                const category = categories.find((cat) => cat.id === item.categoryId);
                return (
                  <ItemCard
                    key={item.id}
                    item={item}
                    category={category}
                    onClick={() => setActiveItemToView(item)}
                  />
                );
              })}
            </div>
          )}
        </main>

        {/* Dynamic bottom absolute sticky panel control action */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-2xl border border-gray-150 px-4 py-3 shadow-md/50 flex justify-between items-center z-40">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Colecionador</span>
            <span className="text-xs font-extrabold text-[#263238] leading-none">The Collector</span>
          </div>
          
          <button
            id="btn-register-floating"
            onClick={() => {
              setActiveItemToEdit(undefined);
              setIsItemFormOpen(true);
            }}
            className="bg-[#4db6ac] hover:bg-teal-600 text-white font-bold text-xs py-2 px-4 shadow-sm hover:shadow-md rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Adicionar Item</span>
          </button>
        </div>

        {/* Standard Modals Container */}
        
        {/* Item View Details modal Overlay */}
        {activeItemToView && (
          <ItemModal
            key={`view-${activeItemToView.id}`}
            isOpen={!!activeItemToView}
            onClose={() => setActiveItemToView(undefined)}
            item={activeItemToView}
            category={categories.find((c) => c.id === activeItemToView?.categoryId)}
            onEdit={handleEditItemTrigger}
            onDelete={handleDeleteItem}
          />
        )}

        {/* Item Create / Edit form Modal */}
        {isItemFormOpen && (
          <ItemFormModal
            key={activeItemToEdit ? `edit-${activeItemToEdit.id}` : 'create-new'}
            isOpen={isItemFormOpen}
            onClose={() => {
              setIsItemFormOpen(false);
              setActiveItemToEdit(undefined);
            }}
            categories={categories}
            onSave={handleSaveItem}
            itemToEdit={activeItemToEdit}
            onTriggerNewCategory={() => setIsCategoryFormOpen(true)}
            existingLocations={existingLocations}
          />
        )}

        {/* Category Create Modal */}
        {isCategoryFormOpen && (
          <CategoryFormModal
            isOpen={isCategoryFormOpen}
            onClose={() => setIsCategoryFormOpen(false)}
            onSave={handleSaveCategory}
          />
        )}

        {/* Custom Confirmation Modals */}

        {/* Confirm Delete All Modal */}
        {confirmDeleteAllOpen && (
          <div id="modal-confirm-delete-all" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[200] animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-xs p-6 shadow-2xl border border-gray-150 flex flex-col items-center text-center">
              <div className="p-3.5 rounded-full bg-red-50 text-red-500 mb-4 border border-red-100">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#263238] mb-2 px-1">Tem certeza que deseja excluir tudo?</h3>
              <p className="text-xs text-gray-400 mb-6 max-w-[200px] leading-normal font-medium">
                Todos os itens do seu acervo pessoal serão excluídos permanentemente. Essa ação é irreversível.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteAllOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 text-xs font-bold transition cursor-pointer"
                >
                  Não
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setItems([]);
                    setSelectedCategoryId('');
                    setConfirmDeleteAllOpen(false);
                  }}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  Sim
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Delete Category Modal */}
        {confirmDeleteCategoryOpen && selectedCategoryId && (
          <div id="modal-confirm-delete-category" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[200] animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-xs p-6 shadow-2xl border border-gray-150 flex flex-col items-center text-center">
              <div className="p-3.5 rounded-full bg-red-50 text-red-500 mb-4 border border-red-100">
                <Folder className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#263238] mb-2 px-1">Tem certeza que deseja excluir esta categoria?</h3>
              <p className="text-xs text-gray-400 mb-6 max-w-[220px] leading-normal font-medium">
                A categoria "{categories.find(c => c.id === selectedCategoryId)?.name}" será removida. Os itens pertencentes a ela serão movidos para a categoria "Outros".
              </p>
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteCategoryOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 text-xs font-bold transition cursor-pointer"
                >
                  Não
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteCategory(selectedCategoryId);
                    setConfirmDeleteCategoryOpen(false);
                  }}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  Sim
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Reset to Defaults Modal */}
        {confirmResetOpen && (
          <div id="modal-confirm-reset" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[200] animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-xs p-6 shadow-2xl border border-gray-150 flex flex-col items-center text-center">
              <div className="p-3.5 rounded-full bg-teal-50 text-teal-600 mb-4 border border-teal-100">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#263238] mb-2 px-1">Restaurar padrões?</h3>
              <p className="text-xs text-gray-400 mb-6 max-w-[220px] leading-normal font-medium">
                Deseja restaurar as coleções iniciais de exemplo? Todos os dados customizados serão mesclados com os padrões.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setConfirmResetOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 text-xs font-bold transition cursor-pointer"
                >
                  Não
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCategories(DEFAULT_CATEGORIES);
                    setItems(INITIAL_ITEMS);
                    setConfirmResetOpen(false);
                  }}
                  className="flex-1 py-2.5 bg-[#4db6ac] hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  Sim
                </button>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </MobileFrame>
  );
}
