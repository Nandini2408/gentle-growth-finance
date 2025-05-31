
import React from 'react';
import { 
  Utensils, 
  Car, 
  Music, 
  ShoppingBag, 
  Heart 
} from 'lucide-react';

interface CategoryIconProps {
  category: 'food' | 'transport' | 'entertainment' | 'shopping' | 'health' | 'other';
  size?: number;
  className?: string;
}

const categoryConfig = {
  food: { 
    icon: Utensils, 
    color: 'text-category-food',
    bgColor: 'bg-category-food',
    name: 'Food & Dining'
  },
  transport: { 
    icon: Car, 
    color: 'text-category-transport',
    bgColor: 'bg-category-transport',
    name: 'Transportation'
  },
  entertainment: { 
    icon: Music, 
    color: 'text-category-entertainment',
    bgColor: 'bg-category-entertainment',
    name: 'Entertainment'
  },
  shopping: { 
    icon: ShoppingBag, 
    color: 'text-category-shopping',
    bgColor: 'bg-category-shopping',
    name: 'Shopping'
  },
  health: { 
    icon: Heart, 
    color: 'text-category-health',
    bgColor: 'bg-category-health',
    name: 'Health & Wellness'
  },
  other: { 
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"/>
        <circle cx="19" cy="12" r="1"/>
        <circle cx="5" cy="12" r="1"/>
      </svg>
    ), 
    color: 'text-category-other',
    bgColor: 'bg-category-other',
    name: 'Other'
  }
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  size = 20, 
  className = '' 
}) => {
  const config = categoryConfig[category];
  const IconComponent = config.icon;

  return (
    <IconComponent 
      size={size} 
      className={`${config.color} ${className}`}
    />
  );
};

export const getCategoryConfig = (category: string) => {
  return categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.other;
};

export default CategoryIcon;
