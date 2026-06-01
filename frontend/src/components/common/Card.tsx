import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
  className?: string;
}

function Card({ children, title, icon, className = '' }: CardProps) {
  return (
    <div className={`bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition ${className}`}>
      {icon && <div className="text-blue-400 mb-4">{icon}</div>}
      {title && <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>}
      {children}
    </div>
  );
}

export default Card;