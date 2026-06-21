"use client";

import React from 'react';

export const Input = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    required = false,
    className = "",
    error = "",
    icon: Icon
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`w-full ${Icon ? 'pl-12' : 'px-4'} py-3 md:py-3.5 bg-white border border-gray-200 rounded-[10px] text-sm font-medium text-[#1a1a2e] placeholder-gray-400 shadow-sm hover:border-gray-300 focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/15 outline-none transition-all ${error ? 'border-red-500' : ''}`}
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
};
