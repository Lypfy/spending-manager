import React from 'react';
import * as LucideIcons from 'lucide-react';

export const DynamicIcon = ({ name, size = 18, color, className = '' }) => {
  // Try exact name or fallback
  const IconComponent = LucideIcons[name] || LucideIcons.CircleDot || LucideIcons.DollarSign;

  return <IconComponent size={size} color={color} className={className} />;
};
