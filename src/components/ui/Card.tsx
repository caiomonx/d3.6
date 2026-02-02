import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  icon?: LucideIcon;
  className?: string;
  variant?: 'default' | 'alert';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  icon: Icon,
  className = '',
  variant = 'default',
}) => {
  const borderColor =
    variant === 'alert' ? 'border-medical-danger/50' : 'border-white/10';
  const glowClass =
    variant === 'alert'
      ? 'shadow-[0_0_30px_-10px_rgba(239,68,68,0.2)]'
      : 'shadow-2xl';

  // Alterado para rounded-3xl para ficar mais arredondado
  return (
    <div
      className={`glass-panel rounded-3xl p-6 ${borderColor} ${glowClass} relative overflow-hidden group transition-all duration-500 hover:border-white/20 ${className}`}
    >
      {title && (
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
          <div
            className={`p-2 rounded-xl ${
              variant === 'alert'
                ? 'bg-medical-danger/10 text-medical-danger'
                : 'bg-medical-primary/10 text-medical-primary'
            }`}
          >
            {Icon && <Icon size={20} />}
          </div>
          <h3 className="font-sans font-bold text-gray-100 uppercase tracking-widest text-sm flex-1">
            {title}
          </h3>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
          </div>
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
