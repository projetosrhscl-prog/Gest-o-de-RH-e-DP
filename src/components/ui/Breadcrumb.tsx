import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
      <div className="flex items-center text-slate-400">
        <Home className="w-3.5 h-3.5" />
      </div>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
          {item.onClick && !item.isActive ? (
            <button
              onClick={item.onClick}
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ) : (
            <span className={item.isActive ? 'font-semibold text-slate-900' : 'text-slate-500'}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
