import { type ChangeEvent } from 'react';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
}

function Input({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required, 
  textarea = false, 
  rows = 4 
}: InputProps) {
  return (
    <div>
      {label && <label className="block text-gray-300 text-sm mb-1">{label}</label>}
      {textarea ? (
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
        />
      )}
    </div>
  );
}

export default Input;