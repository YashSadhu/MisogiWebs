import React from 'react';
import { Category } from '../../types';

interface CategoryBadgeProps {
  category: Category;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${category.color}25`, // Add transparency
        color: category.color,
      }}
    >
      {category.name}
    </span>
  );
};

export default CategoryBadge;