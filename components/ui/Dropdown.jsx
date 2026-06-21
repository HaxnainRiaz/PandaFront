"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Dropdown = ({
    options = [],
    value,
    onChange,
    placeholder = "Select option",
    className = "",
    label = "",
    icon: Icon
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => (opt.value || opt) === value);
    const displayValue = selectedOption ? (selectedOption.label || selectedOption) : placeholder;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange({ target: { value: optionValue } });
        setIsOpen(false);
    };

    return (
        <div className={cn("relative w-full", className)} ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between px-5 py-1 bg-white border border-[#e5e7eb] rounded-2xl text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md h-[45px] md:h-[54px]",
                    isOpen ? "ring-2 ring-[#e63946]/20 border-[#e63946]/40" : "hover:border-gray-300",
                    !selectedOption ? "text-gray-400" : "text-[#1a1a2e]",
                    Icon ? "pl-14" : "pl-6"
                )}
            >
                <div className='flex gap-2 items-center'>
                    {Icon && (
                        <div className="text-[#e63946]">
                            <Icon size={18} />
                        </div>
                    )}
                    <span className="truncate">{displayValue}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute z-[100] w-full mt-2 bg-white border border-[#e5e7eb] rounded-2xl shadow-2xl py-2 animate-fadeIn overflow-hidden">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {options.map((option) => {
                            const optValue = option.value || option;
                            const optLabel = option.label || option;
                            const isSelected = optValue === value;

                            return (
                                <button
                                    key={optValue}
                                    type="button"
                                    onClick={() => handleSelect(optValue)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-6 py-3 text-sm text-left transition-colors",
                                        isSelected ? "bg-[#e63946]/8 text-[#e63946] font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1a1a2e]"
                                    )}
                                >
                                    <span>{optLabel}</span>
                                    {isSelected && <Check className="h-4 w-4 text-[#e63946]" />}
                                </button>
                            );
                        })}
                        {options.length === 0 && (
                            <div className="px-6 py-3 text-sm text-neutral-400 italic text-center">No options available</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
