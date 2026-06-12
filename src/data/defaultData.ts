import { Category, Item } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-books',
    name: 'Livros',
    icon: 'Book',
    description: 'Livros físicos, e-books e quadrinhos',
    color: '#4db6ac', // Teal
  },
  {
    id: 'cat-games',
    name: 'Jogos & Consoles',
    icon: 'Gamepad2',
    description: 'Jogos de tabuleiro, cartas e videogames',
    color: '#80cbc4',
  },
  {
    id: 'cat-electronics',
    name: 'Eletrônicos',
    icon: 'Cpu',
    description: 'Aparelhos, gadgets e hardware',
    color: '#26a69a',
  },
  {
    id: 'cat-plants',
    name: 'Plantas',
    icon: 'Flower2',
    description: 'Suculentas, folhagens e flores',
    color: '#00897b',
  },
  {
    id: 'cat-others',
    name: 'Outros',
    icon: 'Package',
    description: 'Itens diversos colecionáveis',
    color: '#b0bec5', // Cool Grey
  },
];

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'item-1',
    name: 'O Senhor dos Anéis: A Sociedade do Anel',
    categoryId: 'cat-books',
    location: 'Estante Principal - Prateleira 2',
    notes: 'Edição especial de colecionador em capa dura. Tradução revisada.',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=650',
    createdAt: '2026-05-20T10:00:00Z',
    customFields: {
      'Autor': 'J.R.R. Tolkien',
      'Ano': '2019',
      'Páginas': '576',
    },
  },
  {
    id: 'item-2',
    name: 'The Legend of Zelda: Tears of the Kingdom',
    categoryId: 'cat-games',
    location: 'Gaveta de Jogos do Switch',
    notes: 'Mídia física. Emprestado ao Carlos em Abril de 2026.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=650',
    createdAt: '2026-05-21T14:30:00Z',
    customFields: {
      'Plataforma': 'Nintendo Switch',
      'Estado': 'Em Excelente Estado',
    },
  },
  {
    id: 'item-3',
    name: 'Monstera Deliciosa (Costela de Adão)',
    categoryId: 'cat-plants',
    location: 'Vaso perto da janela da sala',
    notes: 'Regar duas vezes por semana. Adubar a cada 3 meses na primavera.',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=650',
    createdAt: '2026-05-22T08:15:00Z',
    customFields: {
      'Tipo': 'Folhagem',
      'Regar': '2x por semana',
    },
  },
  {
    id: 'item-4',
    name: 'Fone de Ouvido Sony WH-1000XM4',
    categoryId: 'cat-electronics',
    location: 'Suporte de headphone na Mesa de Trabalho',
    notes: 'Excelente cancelamento de ruído. Bateria durando normalmente.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=650',
    createdAt: '2026-05-22T11:00:00Z',
    customFields: {
      'Conexão': 'Bluetooth 5.0',
      'Cor': 'Preto',
    },
  },
];
