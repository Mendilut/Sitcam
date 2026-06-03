import { useState, useEffect, useRef } from 'react';
import { Search, Loader, X } from 'lucide-react';

interface Suggestion {
  id: number;
  nombre?: string;
  titulo?: string;
  imagen_tipo?: string;
  icono?: string;
}

interface SearchInputProps {
  onSearch: (term: string) => void;
  onSelect?: (id: number, name: string) => void;
  placeholder?: string;
  endpoint: string; // '/api/productos/suggest' o '/api/servicios/suggest'
  className?: string;
}

function SearchInput({ onSearch, onSelect, placeholder = 'Buscar...', endpoint, className = '' }: SearchInputProps) {
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (term.length < 2) {
        setSuggestions([]);
        onSearch(term);
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`${endpoint}?q=${encodeURIComponent(term)}&limit=5`);
        const data = await response.json();
        setSuggestions(data);
        setShowDropdown(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [term, endpoint, onSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: Suggestion) => {
    const displayName = suggestion.nombre || suggestion.titulo || '';
    setTerm(displayName);
    setShowDropdown(false);
    if (onSelect) {
      onSelect(suggestion.id, displayName);
    }
    onSearch(displayName);
  };

  const handleClear = () => {
    setTerm('');
    onSearch('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    onSearch(value);
  };

  return (
    <div className={`relative flex-1 ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={term}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        />
        {term && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
        {loading && (
          <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
        )}
      </div>
      
      {showDropdown && suggestions.length > 0 && (
        <div ref={dropdownRef} className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition flex items-center gap-2"
            >
              {suggestion.imagen_tipo ? (
                <span className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-xs">📷</span>
              ) : suggestion.icono ? (
                <span className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-xs">🔧</span>
              ) : null}
              <span>{suggestion.nombre || suggestion.titulo}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchInput;