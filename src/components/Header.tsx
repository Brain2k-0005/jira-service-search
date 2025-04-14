
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-primary flex items-center gap-2">
          <span>JIRA Service Search</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ShieldCheck className="h-5 w-5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
