
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-brand-700 flex items-center gap-2">
          <span className="text-brand-600">Internal Service Directory</span>
        </Link>
        <Link to="/admin">
          <Button variant="ghost" size="sm" className="text-gray-600 gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
