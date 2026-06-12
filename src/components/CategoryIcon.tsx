import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const AVAILABLE_ICONS = [
  { name: 'Book', label: 'Livros', component: Icons.Book },
  { name: 'Gamepad2', label: 'Jogos / Consoles', component: Icons.Gamepad2 },
  { name: 'Cpu', label: 'Eletrônicos', component: Icons.Cpu },
  { name: 'Flower2', label: 'Plantas / Flores', component: Icons.Flower2 },
  { name: 'Package', label: 'Pacotes / Caixas', component: Icons.Package },
  { name: 'Folder', label: 'Pastas / Documentos', component: Icons.Folder },
  { name: 'Music', label: 'Música / Discos', component: Icons.Music },
  { name: 'Camera', label: 'Câmeras / Fotos', component: Icons.Camera },
  { name: 'Layers', label: 'Cards / Coleções', component: Icons.Layers },
  { name: 'Sparkles', label: 'Raridades / Joias', component: Icons.Sparkles },
  { name: 'Shirt', label: 'Roupas / Moda', component: Icons.Shirt },
  { name: 'Wine', label: 'Bebidas / Vinhos', component: Icons.Wine },
  { name: 'Coins', label: 'Moedas / Cédulas', component: Icons.Coins },
  { name: 'Compass', label: 'Viagem / Selos', component: Icons.Compass },
  { name: 'Briefcase', label: 'Ferramentas', component: Icons.Briefcase },
  { name: 'Gift', label: 'Brinquedos / Bonecos', component: Icons.Gift },
];

export default function CategoryIcon({ name, className = "w-4 h-4", size }: CategoryIconProps) {
  // Find the icon component or default to Package
  const found = AVAILABLE_ICONS.find((item) => item.name === name);
  const IconComponent = found ? found.component : Icons.Package;

  return <IconComponent className={className} size={size} />;
}
