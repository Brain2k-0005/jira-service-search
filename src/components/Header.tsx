
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-primary flex items-center gap-2">
          <span>Internal Service Directory</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
