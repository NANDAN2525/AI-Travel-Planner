/**
 * Language Selector Component
 * Allows users to switch between supported languages
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { I18nService, SupportedLanguage } from '@/lib/i18n';

interface LanguageSelectorProps {
  className?: string;
}

export default function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    // Get current language on component mount
    setCurrentLanguage(I18nService.getCurrentLanguage());
  }, []);

  const availableLanguages = I18nService.getAvailableLanguages();

  const handleLanguageChange = (languageCode: SupportedLanguage) => {
    I18nService.setLanguage(languageCode);
    setCurrentLanguage(languageCode);
    setIsOpen(false);
    
    // Trigger a custom event to notify other components of language change
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: languageCode } 
    }));
  };

  const currentLanguageInfo = availableLanguages.find(lang => lang.code === currentLanguage);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLanguageInfo?.nativeName || 'English'}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              {availableLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    currentLanguage === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{language.nativeName}</span>
                    <span className="text-xs text-gray-500">({language.name})</span>
                  </div>
                  {currentLanguage === language.code && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
