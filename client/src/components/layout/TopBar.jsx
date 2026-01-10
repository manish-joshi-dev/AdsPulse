import React from 'react';
import { ChevronRight } from 'lucide-react';

export const TopBar = ({ title, breadcrumb, actions }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Title and breadcrumb */}
      <div className="flex-1">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-2 mb-2">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-4 h-4 text-[#475569]" />}
                <span className={index === breadcrumb.length - 1 ? 'text-[#F1F5F9] font-medium' : 'text-[#94A3B8]'}>
                  {item}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}
        {title && <h1 className="text-2xl font-bold text-[#F1F5F9]">{title}</h1>}
      </div>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <React.Fragment key={index}>
              {action}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
