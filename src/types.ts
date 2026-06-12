export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description?: string;
  color: string; // Tailwind-compatible or hex color
}

export interface CustomFieldConfig {
  name: string;
  type: 'text' | 'number';
}

export interface Item {
  id: string;
  name: string;
  categoryId: string;
  location: string;
  notes: string;
  image?: string; // Data URL or external link
  createdAt: string;
  customFields?: { [key: string]: string }; // flexible dynamic fields
}

export interface SampleItemPreset {
  name: string;
  categoryName: string;
  location: string;
  notes: string;
  image: string;
  customFields?: { [key: string]: string };
}
