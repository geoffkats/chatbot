import React from 'react';
import { BellIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-rich-charcoal shadow-sm p-4 flex justify-between items-center border-b border-matte-gold/20 flex-shrink-0">
      <h1 className="text-2xl font-serif text-platinum">AI Receptionist Dashboard</h1>
      <div className="flex items-center space-x-4">
        <button className="text-platinum/70 hover:text-platinum">
          <BellIcon className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 rounded-full bg-matte-gold flex items-center justify-center text-rich-charcoal font-bold text-lg">
          S
        </div>
      </div>
    </header>
  );
};