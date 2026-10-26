import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const DEFAULT_ROLES = [
  { value: 'ROLE_ADMIN', label: 'System Admin' },
  { value: 'ROLE_REGULATORY_OFFICER', label: 'Regulatory Officer' },
  { value: 'ROLE_SCRUTINY_OFFICER', label: 'Scrutiny Officer' },
  { value: 'ROLE_EVC_OFFICER', label: 'EVC Officer' },
  { value: 'ROLE_INSTITUTION_ADMIN', label: 'Institution Admin' },
  { value: 'ROLE_COMPLIANCE_OFFICER', label: 'Compliance Officer' },
  { value: 'ROLE_AUDITOR', label: 'Auditor' }
];

export default function RoleDropdown({
  value,
  onChange,
  options = DEFAULT_ROLES,
  disabled = false,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listboxRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || {
    value,
    label: value?.replace('ROLE_', '').replace(/_/g, ' ') || 'Select Role'
  };

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Sync focused index with current value when opening
  useEffect(() => {
    if (isOpen) {
      const idx = options.findIndex((opt) => opt.value === value);
      setFocusedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, value, options]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          const selected = options[focusedIndex];
          onChange(selected.value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center justify-between gap-2 min-w-[130px] px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer focus:outline-none"
        style={{
          backgroundColor: '#1A1B1F',
          color: '#F5F5F5',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: isOpen ? '0 0 0 2px rgba(185, 245, 107, 0.2)' : 'none',
          borderColor: isOpen ? '#B9F56B' : 'rgba(255, 255, 255, 0.18)'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = '#292C30';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = '#1A1B1F';
        }}
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#A1A1AA] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#B9F56B]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <ul
          ref={listboxRef}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`role-opt-${focusedIndex}`}
          className="absolute left-0 mt-1.5 min-w-[170px] w-full rounded-xl py-1 z-50 shadow-2xl backdrop-blur-md border animate-fade-in"
          style={{
            backgroundColor: '#1A1B1F',
            borderColor: 'rgba(255, 255, 255, 0.18)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6)'
          }}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isFocused = index === focusedIndex;

            return (
              <li
                key={option.value}
                id={`role-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
                className="flex items-center justify-between px-3 py-1.5 mx-1 my-0.5 rounded-lg text-[11px] cursor-pointer transition-colors"
                style={{
                  backgroundColor: isSelected
                    ? 'rgba(185, 245, 107, 0.12)'
                    : isFocused
                    ? '#292C30'
                    : 'transparent',
                  color: isSelected ? '#B9F56B' : '#F5F5F5',
                  fontWeight: isSelected ? '600' : '400'
                }}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#B9F56B] shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
