/**
 * Tests for I18n Service
 * Tests multilingual support functionality
 */

import { I18nService, SupportedLanguage } from '../i18n';

describe('I18nService', () => {
  beforeEach(() => {
    // Reset language to English before each test
    I18nService.setLanguage('en');
  });

  describe('Language Management', () => {
    test('should set and get current language', () => {
      I18nService.setLanguage('hi');
      expect(I18nService.getCurrentLanguage()).toBe('hi');
    });

    test('should default to English for invalid language', () => {
      I18nService.setLanguage('invalid' as SupportedLanguage);
      expect(I18nService.getCurrentLanguage()).toBe('en');
    });

    test('should get all available languages', () => {
      const languages = I18nService.getAvailableLanguages();
      expect(languages).toHaveLength(4);
      expect(languages.map(l => l.code)).toEqual(['en', 'hi', 'ta', 'bn']);
    });
  });

  describe('Translation', () => {
    test('should return English translation by default', () => {
      const translation = I18nService.t('nav.home');
      expect(translation).toBe('Home');
    });

    test('should return Hindi translation when language is set to Hindi', () => {
      I18nService.setLanguage('hi');
      const translation = I18nService.t('nav.home');
      expect(translation).toBe('होम');
    });

    test('should return Tamil translation when language is set to Tamil', () => {
      I18nService.setLanguage('ta');
      const translation = I18nService.t('nav.home');
      expect(translation).toBe('வீடு');
    });

    test('should return Bengali translation when language is set to Bengali', () => {
      I18nService.setLanguage('bn');
      const translation = I18nService.t('nav.home');
      expect(translation).toBe('হোম');
    });

    test('should fallback to English for missing translations', () => {
      I18nService.setLanguage('hi');
      // @ts-ignore - Testing with invalid key
      const translation = I18nService.t('invalid.key');
      expect(translation).toBe('invalid.key');
    });
  });

  describe('Utility Functions', () => {
    test('should format currency correctly for Indian languages', () => {
      I18nService.setLanguage('hi');
      const formatted = I18nService.formatCurrency(1500);
      expect(formatted).toBe('₹1,500');
    });

    test('should format currency correctly for English', () => {
      I18nService.setLanguage('en');
      const formatted = I18nService.formatCurrency(1500, 'USD');
      expect(formatted).toBe('USD 1,500');
    });

    test('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = I18nService.formatDate(date, 'en');
      expect(formatted).toContain('January');
      expect(formatted).toContain('2024');
    });

    test('should identify RTL languages correctly', () => {
      expect(I18nService.isRTL('en')).toBe(false);
      expect(I18nService.isRTL('hi')).toBe(false);
      expect(I18nService.isRTL('ta')).toBe(false);
      expect(I18nService.isRTL('bn')).toBe(false);
    });
  });
});
