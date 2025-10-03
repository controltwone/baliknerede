"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronDown, MapPin } from "lucide-react"

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  showIcon?: boolean
  iconLabel?: string
  searchPlaceholder?: string
  notFoundText?: string
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Seçiniz",
  className = "",
  showIcon = false,
  iconLabel = "",
  searchPlaceholder = "Konum ara...",
  notFoundText = "Konum bulunamadı"
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Normalize Turkish characters for better search
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[ıİ]/g, 'i')
      .replace(/[ğĞ]/g, 'g')
      .replace(/[üÜ]/g, 'u')
      .replace(/[şŞ]/g, 's')
      .replace(/[öÖ]/g, 'o')
      .replace(/[çÇ]/g, 'c')
  }

  const filteredOptions = options.filter(option => {
    const normalizedSearchTerm = normalizeText(searchTerm)
    const normalizedLabel = normalizeText(option.label)
    const normalizedValue = normalizeText(option.value)
    
    return normalizedLabel.includes(normalizedSearchTerm) ||
           normalizedValue.includes(normalizedSearchTerm)
  })

  const handleSelect = (option: Option) => {
    onChange(option.value)
    setIsOpen(false)
    setSearchTerm("")
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-xl border-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-blue-200/60 dark:border-blue-600/60 dark:text-white px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 shadow-sm hover:shadow-md flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2 min-w-0">
          {showIcon && (
            <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
          )}
          {iconLabel && (
            <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium hidden sm:inline">
              {iconLabel}:
            </span>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg z-50 max-h-60 overflow-hidden sm:min-w-[280px] sm:w-max">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
              autoFocus
            />
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto thin-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors duration-200 flex items-center gap-3 min-w-0 ${
                    option.value === value
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="sm:whitespace-nowrap">{option.label}</span>
                  {option.value === value && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                {notFoundText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
