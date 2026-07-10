import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface SingleSelectDropdownProps {
  label?: string;
  options: { id: string; name: string }[];
  selectedId: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

const SingleSelectDropdown = ({
  label,
  options,
  selectedId,
  onChange,
  disabled,
  error,
  placeholder = "Select option",
  className = "",
}: SingleSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.id === selectedId);

  return (
    <div className={`space-y-2 relative ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full min-h-[46px] text-sm text-gray-500 bg-white px-4 py-2.5 rounded-xl border flex items-center justify-between cursor-pointer disabled:bg-gray-50 select-none ${
          error
            ? "border-red-500 bg-red-50/10"
            : "border-gray-250 border-[#d9e5f7]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {selectedOption ? (
          <span className="text-gray-800 font-semibold">
            {selectedOption.name}
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <ChevronDown className="h-5 w-5 text-gray-400 pointer-events-none" />
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 z-20">
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-2 space-y-1">
            {options.length === 0 ? (
              <div className="text-gray-400 text-xs p-2 text-center">
                No options available
              </div>
            ) : (
              options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors text-sm text-gray-700 font-medium select-none ${
                    selectedId === opt.id ? "bg-blue-50 text-[#1f59da]" : ""
                  }`}
                >
                  {opt.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs font-semibold mt-1">{error}</p>
      )}
    </div>
  );
};

export default SingleSelectDropdown;
