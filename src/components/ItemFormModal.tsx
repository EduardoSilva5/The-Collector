import React, { useState, useEffect, useRef } from 'react';
import { Item, Category } from '../types';
import { X, Upload, Plus, Trash2, Tag, MapPin, Keyboard, Sparkles, Image as ImageIcon } from 'lucide-react';
import CategoryIcon from './CategoryIcon';

interface ItemFormModalProps {
  key?: string | number;
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSave: (item: Item) => void;
  itemToEdit?: Item;
  onTriggerNewCategory: () => void;
  existingLocations: string[];
}

export default function ItemFormModal({
  isOpen,
  onClose,
  categories,
  onSave,
  itemToEdit,
  onTriggerNewCategory,
  existingLocations,
}: ItemFormModalProps) {
  const [name, setName] = useState(itemToEdit?.name || '');
  const [categoryId, setCategoryId] = useState(itemToEdit?.categoryId || categories[0]?.id || '');
  const [location, setLocation] = useState(itemToEdit?.location || '');
  const [notes, setNotes] = useState(itemToEdit?.notes || '');
  const [image, setImage] = useState(itemToEdit?.image || '');
  const [imageUrlInput, setImageUrlInput] = useState(
    itemToEdit?.image && !itemToEdit.image.startsWith('data:') ? itemToEdit.image : ''
  );
  const [showUrlInput, setShowUrlInput] = useState(
    !!(itemToEdit?.image && !itemToEdit.image.startsWith('data:'))
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');

  // Custom Fields (dinâmicos!)
  const [customFields, setCustomFields] = useState<{ key: string; value: string }[]>(() => {
    if (itemToEdit?.customFields) {
      return Object.entries(itemToEdit.customFields).map(([key, value]) => ({ key, value }));
    }
    return [];
  });
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const lastCategoriesLengthRef = useRef(categories.length);

  // If a new category was added while the modal is open, auto-select it!
  useEffect(() => {
    if (categories.length > lastCategoriesLengthRef.current) {
      const newCategory = categories[categories.length - 1];
      if (newCategory) {
        setCategoryId(newCategory.id);
      }
    }
    lastCategoriesLengthRef.current = categories.length;
  }, [categories]);

  if (!isOpen) return null;

  // File Upload Handlers (Base64 conversion)
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor, envie apenas arquivos de imagem.');
      return;
    }
    
    // Limit file size to ~1MB to protect client-side localStorage length limitations (approx 5MB)
    if (file.size > 1.2 * 1024 * 1024) {
      setError('Imagem muito grande. Escolha uma imagem de até 1.2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
        setShowUrlInput(false);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Add a dynamic Attribute key-value
  const addCustomField = () => {
    if (!newKey.trim() || !newValue.trim()) {
      setError('Atributo personalizado precisa de Chave e Valor.');
      return;
    }
    if (customFields.some((f) => f.key.toLowerCase() === newKey.trim().toLowerCase())) {
      setError('Um atributo com esta chave já existe.');
      return;
    }

    setCustomFields([...customFields, { key: newKey.trim(), value: newValue.trim() }]);
    setNewKey('');
    setNewValue('');
    setError('');
  };

  // Remove a dynamic Attribute key-value
  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome do item é de preenchimento obrigatório.');
      return;
    }
    if (!categoryId) {
      setError('Selecione ou crie uma categoria para o item.');
      return;
    }

    // Convert customFields list back to design shape Record<string, string>
    const customFieldsMap: { [key: string]: string } = {};
    customFields.forEach((field) => {
      customFieldsMap[field.key] = field.value;
    });

    const itemData: Item = {
      id: itemToEdit?.id || `item-${Date.now()}`,
      name: name.trim(),
      categoryId,
      location: location.trim(),
      notes: notes.trim(),
      image: showUrlInput ? imageUrlInput.trim() : image,
      createdAt: itemToEdit?.createdAt || new Date().toISOString(),
      customFields: customFieldsMap,
    };

    onSave(itemData);
    onClose();
  };

  const activeCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-100 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#263238] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: activeCategory?.color || '#4db6ac' }}
            />
            <h3 className="text-sm font-bold text-white">
              {itemToEdit ? 'Editar Item do Inventário' : 'Adicionar Novo Item'}
            </h3>
          </div>
          <button
            id="btn-close-item-modal"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Box */}
        <form onSubmit={handleSaveItem} className="p-5 overflow-y-auto space-y-4 flex-1 scrollbar-style">
          {error && (
            <div className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {/* Item Name */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Nome do Objeto *
            </label>
            <div className="relative">
              <input
                type="text"
                id="input-item-name"
                placeholder="Ex: PlayStation 5, Rosa de Pedra, O Alquimista..."
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 focus:border-teal-500 outline-none rounded-xl pl-3.5 pr-10 py-2.5 text-[#263238] font-semibold transition"
                maxLength={60}
                required
              />
              <Keyboard className="absolute right-3.5 top-3 w-4 h-4 text-gray-300" />
            </div>
          </div>

          {/* Category Dropdown and Create Button Trigger */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Coleção / Categoria *
            </label>
            <div className="flex gap-2">
              <select
                id="select-item-category"
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex-1 text-sm bg-gray-50 border border-gray-200 focus:border-teal-500 outline-none rounded-xl px-3.5 py-2.5 text-[#263238] font-medium transition cursor-pointer appearance-none"
                style={{
                  borderLeft: `4px solid ${activeCategory?.color || '#b0bec5'}`,
                }}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                id="btn-trigger-inline-cat"
                onClick={onTriggerNewCategory}
                className="bg-teal-50 hover:bg-teal-100 text-[#4db6ac] border border-teal-200 px-3.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer text-xs font-semibold shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova</span>
              </button>
            </div>
          </div>

          {/* Location details */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Localização Física / Onde Fica?
            </label>
            <div className="relative">
              <input
                type="text"
                id="input-item-location"
                placeholder="Ex: Armário Q, Caixa 4, Sala de Estar..."
                value={location || ''}
                onChange={(e) => setLocation(e.target.value)}
                list="location-recommendations"
                className="w-full text-sm bg-gray-50 border border-gray-200 focus:border-teal-500 outline-none rounded-xl pl-9 pr-3.5 py-2 text-[#263238] font-medium transition"
              />
              <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
            </div>
            {/* Auto recommendations datalist */}
            <datalist id="location-recommendations">
              {existingLocations.map((loc, idx) => (
                <option key={idx} value={loc} />
              ))}
            </datalist>
          </div>

          {/* Image Loader Drag Area */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Mídia do Item</span>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[10px] text-teal-600 hover:underline font-bold"
              >
                {showUrlInput ? 'Mudar para Upload de Arquivo' : 'Adicionar via Link de Imagem'}
              </button>
            </label>

            {showUrlInput ? (
              <div className="relative">
                <input
                  key="input-image-url"
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrlInput || ''}
                  onChange={(e) => {
                    setImageUrlInput(e.target.value);
                    setImage(e.target.value);
                  }}
                  className="w-full text-xs bg-gray-55 border border-gray-200 focus:border-teal-500 outline-none rounded-xl pl-9 pr-3.5 py-2.5 text-[#263238] font-mono transition"
                />
                <ImageIcon className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400" />
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  isDragOver
                    ? 'border-teal-400 bg-teal-50/50 scale-101'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100/70'
                }`}
              >
                <input
                  key="input-image-file"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {image ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xs">
                    <img src={image} className="w-full h-full object-cover" alt="Pre-visualização" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage('');
                      }}
                      className="absolute top-2 right-2 bg-black/80 text-white rounded-full p-1.5 hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-2.5 rounded-full bg-white text-gray-400 shadow-sm border border-gray-150 mb-2">
                      <Upload className="w-5 h-5 text-gray-500" />
                    </div>
                    <p className="text-xs font-bold text-gray-600">Arraste e solte o arquivo aqui</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Ou clique para navegar (Máx: 1.2MB)</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Item description */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Anotações / Notas de Estado
            </label>
            <textarea
              placeholder="Descreva detalhes específicos de preservação, valor emocional, histórico, observações de cuidados ou danos..."
              value={notes || ''}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-200 focus:border-teal-500 outline-none rounded-xl px-3.5 py-2 text-[#263238] font-medium transition min-h-[70px] max-h-[140px]"
              maxLength={300}
            />
          </div>

          {/* DYNAMIC ATTRIBUTES / ATRIBUTOS FLEXÍVEIS */}
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center gap-1 mb-2">
              <Tag className="w-3.5 h-3.5 text-[#4db6ac]" />
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Atributos & Regras Customizadas (Simplicidade Flexível)
              </h4>
            </div>

            {/* List current attributes inputs */}
            {customFields.length > 0 && (
              <div className="space-y-1.5 mb-3">
                {customFields.map((field, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-[#f5f7f8] py-1.5 px-3 rounded-lg border border-gray-100 text-xs"
                  >
                    <div className="font-mono flex items-center gap-1.5">
                      <span className="font-semibold text-gray-400">{field.key}:</span>
                      <span className="font-bold text-[#263238]">{field.value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomField(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Config inputs to add custom spec */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Chave (Ex: Autor, Voltagem)"
                value={newKey || ''}
                onChange={(e) => setNewKey(e.target.value)}
                className="flex-1 text-xs bg-gray-50 border border-slate-200 outline-none rounded-lg px-2.5 py-1.5"
                maxLength={20}
              />
              <input
                type="text"
                placeholder="Valor (Ex: J.K. Rowling, 220v)"
                value={newValue || ''}
                onChange={(e) => setNewValue(e.target.value)}
                className="flex-1 text-xs bg-gray-50 border border-slate-200 outline-none rounded-lg px-2.5 py-1.5"
                maxLength={40}
              />
              <button
                type="button"
                onClick={addCustomField}
                className="px-3 bg-[#4db6ac]/10 hover:bg-[#4db6ac]/20 text-[#4db6ac] border border-[#4db6ac]/30 rounded-lg transition font-bold text-xs cursor-pointer flex items-center justify-center shrink-0"
              >
                <span>Inserir</span>
              </button>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              id="btn-item-form-cancel"
              onClick={onClose}
              className="flex-1 text-xs font-semibold py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-slate-50 transition cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-item-form-save"
              className="flex-1 text-xs font-bold py-2.5 rounded-xl text-white hover:bg-teal-600 transition cursor-pointer flex items-center justify-center gap-1 shadow-xs"
              style={{ backgroundColor: activeCategory?.color || '#4db6ac' }}
            >
              <span>{itemToEdit ? 'Salvar Edições' : 'Registrar no Acervo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
