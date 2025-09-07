/**
 * Tests for Weather Service
 * Tests weather data fetching and analysis functionality
 */

import { WeatherService } from '../weather';

describe('WeatherService', () => {
  describe('getCurrentWeather', () => {
    test('should return weather data for a location', async () => {
      const weather = await WeatherService.getCurrentWeather('Delhi');
      
      expect(weather).toHaveProperty('location', 'Delhi');
      expect(weather).toHaveProperty('temperature');
      expect(weather).toHaveProperty('condition');
      expect(weather).toHaveProperty('description');
      expect(weather).toHaveProperty('humidity');
      expect(weather).toHaveProperty('windSpeed');
      expect(weather).toHaveProperty('visibility');
      expect(weather).toHaveProperty('uvIndex');
      expect(weather).toHaveProperty('forecast');
      expect(Array.isArray(weather.forecast)).toBe(true);
    });

    test('should handle errors gracefully', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // This should not throw but return mock data
      const weather = await WeatherService.getCurrentWeather('InvalidLocation');
      expect(weather).toBeDefined();
      
      consoleSpy.mockRestore();
    });
  });

  describe('getWeatherForecast', () => {
    test('should return forecast for specified number of days', async () => {
      const forecast = await WeatherService.getWeatherForecast('Mumbai', 5);
      
      expect(forecast).toHaveProperty('forecast');
      expect(forecast.forecast).toHaveLength(5);
      
      forecast.forecast.forEach(day => {
        expect(day).toHaveProperty('date');
        expect(day).toHaveProperty('temperature');
        expect(day.temperature).toHaveProperty('min');
        expect(day.temperature).toHaveProperty('max');
        expect(day).toHaveProperty('condition');
        expect(day).toHaveProperty('description');
        expect(day).toHaveProperty('precipitation');
      });
    });
  });

  describe('analyzeWeatherConditions', () => {
    const mockWeather = {
      location: 'Delhi',
      temperature: 25,
      condition: 'Clear',
      description: 'Clear sky',
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      uvIndex: 6,
      forecast: [],
    };

    test('should analyze outdoor activity suitability correctly', () => {
      const analysis = WeatherService.analyzeWeatherConditions(mockWeather, 'outdoor');
      
      expect(analysis).toHaveProperty('suitable', true);
      expect(analysis).toHaveProperty('recommendations');
      expect(analysis).toHaveProperty('alternativeActivities');
      expect(Array.isArray(analysis.recommendations)).toBe(true);
      expect(Array.isArray(analysis.alternativeActivities)).toBe(true);
    });

    test('should recommend rain protection for rainy weather', () => {
      const rainyWeather = { ...mockWeather, condition: 'Rain' };
      const analysis = WeatherService.analyzeWeatherConditions(rainyWeather, 'outdoor');
      
      expect(analysis.suitable).toBe(false);
      expect(analysis.recommendations).toContain('Bring an umbrella or raincoat');
      expect(analysis.alternativeActivities).toContain('Museums');
    });

    test('should recommend warm clothing for cold weather', () => {
      const coldWeather = { ...mockWeather, temperature: 5 };
      const analysis = WeatherService.analyzeWeatherConditions(coldWeather, 'outdoor');
      
      expect(analysis.recommendations).toContain('Dress warmly');
    });

    test('should recommend hydration for hot weather', () => {
      const hotWeather = { ...mockWeather, temperature: 40 };
      const analysis = WeatherService.analyzeWeatherConditions(hotWeather, 'outdoor');
      
      expect(analysis.recommendations).toContain('Stay hydrated');
      expect(analysis.recommendations).toContain('Wear sunscreen and hat');
    });

    test('should analyze adventure activity safety', () => {
      const windyWeather = { ...mockWeather, windSpeed: 25 };
      const analysis = WeatherService.analyzeWeatherConditions(windyWeather, 'adventure');
      
      expect(analysis.recommendations).toContain('High winds may affect safety');
      expect(analysis.alternativeActivities).toContain('Indoor activities');
    });

    test('should analyze beach activity suitability', () => {
      const coldWeather = { ...mockWeather, temperature: 15 };
      const analysis = WeatherService.analyzeWeatherConditions(coldWeather, 'beach');
      
      expect(analysis.suitable).toBe(false);
      expect(analysis.recommendations).toContain('Water may be too cold');
      expect(analysis.alternativeActivities).toContain('Beach walking');
    });
  });

  describe('getWeatherBasedRecommendations', () => {
    const mockWeather = {
      location: 'Delhi',
      temperature: 25,
      condition: 'Clear',
      description: 'Clear sky',
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      uvIndex: 6,
      forecast: [],
    };

    test('should provide recommendations for clear weather', () => {
      const recommendations = WeatherService.getWeatherBasedRecommendations(mockWeather);
      
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations).toContain('Perfect day for outdoor photography');
    });

    test('should provide recommendations for hot weather', () => {
      const hotWeather = { ...mockWeather, temperature: 40 };
      const recommendations = WeatherService.getWeatherBasedRecommendations(hotWeather);
      
      expect(recommendations).toContain('Great weather for early morning or evening activities');
    });

    test('should provide recommendations for cold weather', () => {
      const coldWeather = { ...mockWeather, temperature: 5 };
      const recommendations = WeatherService.getWeatherBasedRecommendations(coldWeather);
      
      expect(recommendations).toContain('Perfect weather for indoor activities like museums and cafes');
    });

    test('should provide UV index recommendations', () => {
      const highUVWeather = { ...mockWeather, uvIndex: 8 };
      const recommendations = WeatherService.getWeatherBasedRecommendations(highUVWeather);
      
      expect(recommendations).toContain('High UV index - use sunscreen and seek shade');
    });
  });
});
