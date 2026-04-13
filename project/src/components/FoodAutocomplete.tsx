import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { searchFoods, getDefaultUnit } from '../data/foodDatabase';

interface FoodAutocompleteProps {
  value: string;
  onChange: (foodName: string) => void;
  onSelect: (foodName: string, unit: string) => void;
  placeholder?: string;
}

const FoodAutocomplete: React.FC<FoodAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Search or type food name...',
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search suggestions
  useEffect(() => {
    if (value.trim().length > 0) {
      const results = searchFoods(value);
      setSuggestions(results);
      setIsOpen(true);
      setFocusedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (foodName: string) => {
    const unit = getDefaultUnit(foodName);
    onChange(foodName);
    onSelect(foodName, unit);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSelect(suggestions[focusedIndex].name);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        {value && <ChevronDown className="absolute right-3 top-3 text-gray-400" size={20} />}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-auto">
          {suggestions.map((food, idx) => (
            <div
              key={food.name}
              onClick={() => handleSelect(food.name)}
              className={`p-3 cursor-pointer ${
                idx === focusedIndex ? 'bg-blue-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="font-medium text-gray-900">{food.name}</p>
            </div>
          ))}
        </div>
      )}

      {isOpen && value && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4">
          <p className="text-gray-600 text-sm">
            Food not found. You can still add it manually with nutrition info.
          </p>
        </div>
      )}
    </div>
  );
};

export default FoodAutocomplete;
