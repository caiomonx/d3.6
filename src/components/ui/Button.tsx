import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const base =
    'relative overflow-hidden font-sans font-bold text-sm tracking-wide py-4 px-6 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group border';

  const styles = {
    primary:
      'bg-medical-primary/10 border-medical-primary/50 text-medical-primary hover:bg-medical-primary hover:text-black hover:border-medical-primary shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)]',
    secondary:
      'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/30',
    danger:
      'bg-medical-danger/10 border-medical-danger/50 text-medical-danger hover:bg-medical-danger hover:text-white',
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
