import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label: string;
  placeholder?: string;
  className?: string;
}

export const Select = ({
  value,
  onChange,
  options,
  label,
  placeholder = "Select...",
  className = "",
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }

      const currentIndex = options.findIndex(
        (option) => option.value === value
      );
      let nextIndex =
        e.key === "ArrowDown" ? currentIndex + 1 : currentIndex - 1;

      if (nextIndex < 0) {
        nextIndex = options.length - 1;
      } else if (nextIndex >= options.length) {
        nextIndex = 0;
      }

      onChange(options[nextIndex].value);
    }
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className="relative w-full cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={label}
      >
        <div
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                      bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                      focus:border-blue-500 text-sm"
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {isOpen && (
          <ul
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md 
                     py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto 
                     focus:outline-none sm:text-sm"
            role="listbox"
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 
                         ${
                           value === option.value
                             ? "text-white bg-blue-600"
                             : "text-gray-900 hover:bg-gray-100"
                         }`}
                role="option"
                aria-selected={value === option.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
