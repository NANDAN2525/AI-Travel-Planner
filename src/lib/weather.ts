/**
 * Weather API integration for real-time weather data
 * Provides weather information for itinerary optimization
 */

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
  forecast: {
    date: string;
    temperature: {
      min: number;
      max: number;
    };
    condition: string;
    description: string;
    precipitation: number;
  }[];
}

interface WeatherConditions {
  suitable: boolean;
  recommendations: string[];
  alternativeActivities: string[];
}

export class WeatherService {
  private static apiKey = process.env.OPENWEATHER_API_KEY || '';

  /**
   * Get current weather for a location
   */
  static async getCurrentWeather(location: string): Promise<WeatherData> {
    try {
      // For demo purposes, return mock data
      // In production, you would call the OpenWeather API
      const mockWeatherData: WeatherData = {
        location,
        temperature: 25,
        condition: 'Clear',
        description: 'Clear sky',
        humidity: 65,
        windSpeed: 12,
        visibility: 10,
        uvIndex: 6,
        forecast: [
          {
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            temperature: { min: 20, max: 28 },
            condition: 'Partly Cloudy',
            description: 'Partly cloudy with some sun',
            precipitation: 10,
          },
          {
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            temperature: { min: 18, max: 26 },
            condition: 'Rain',
            description: 'Light rain expected',
            precipitation: 80,
          },
        ],
      };

      return mockWeatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  /**
   * Get weather forecast for multiple days
   */
  static async getWeatherForecast(location: string, days: number): Promise<WeatherData> {
    try {
      const weatherData = await this.getCurrentWeather(location);
      
      // Generate forecast for the requested number of days
      const forecast = [];
      for (let i = 1; i <= days; i++) {
        const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
        forecast.push({
          date: date.toISOString().split('T')[0],
          temperature: {
            min: Math.floor(Math.random() * 10) + 15,
            max: Math.floor(Math.random() * 15) + 25,
          },
          condition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain', 'Sunny'][Math.floor(Math.random() * 5)],
          description: 'Weather description',
          precipitation: Math.floor(Math.random() * 100),
        });
      }

      return {
        ...weatherData,
        forecast,
      };
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw new Error('Failed to fetch weather forecast');
    }
  }

  /**
   * Analyze weather conditions for activity suitability
   */
  static analyzeWeatherConditions(
    weather: WeatherData,
    activityType: string
  ): WeatherConditions {
    const recommendations: string[] = [];
    const alternativeActivities: string[] = [];
    let suitable = true;

    // Analyze based on activity type
    switch (activityType.toLowerCase()) {
      case 'outdoor':
      case 'sightseeing':
        if (weather.condition.toLowerCase().includes('rain')) {
          suitable = false;
          recommendations.push('Bring an umbrella or raincoat');
          recommendations.push('Consider indoor alternatives');
          alternativeActivities.push('Museums', 'Indoor markets', 'Art galleries');
        }
        if (weather.temperature < 10) {
          recommendations.push('Dress warmly');
          recommendations.push('Consider hot beverages');
        }
        if (weather.temperature > 35) {
          recommendations.push('Stay hydrated');
          recommendations.push('Avoid peak sun hours (12-3 PM)');
          recommendations.push('Wear sunscreen and hat');
        }
        break;

      case 'adventure':
      case 'hiking':
        if (weather.condition.toLowerCase().includes('rain')) {
          suitable = false;
          recommendations.push('Trails may be slippery');
          recommendations.push('Consider postponing or indoor activities');
          alternativeActivities.push('Indoor rock climbing', 'Museums', 'Shopping');
        }
        if (weather.windSpeed > 20) {
          recommendations.push('High winds may affect safety');
          alternativeActivities.push('Indoor activities', 'City tours');
        }
        break;

      case 'beach':
      case 'water sports':
        if (weather.temperature < 20) {
          suitable = false;
          recommendations.push('Water may be too cold');
          alternativeActivities.push('Beach walking', 'Beachside restaurants', 'Spa treatments');
        }
        if (weather.windSpeed > 15) {
          recommendations.push('Strong winds may affect water activities');
        }
        break;

      case 'food tour':
      case 'shopping':
        // Generally suitable in most weather conditions
        if (weather.condition.toLowerCase().includes('rain')) {
          recommendations.push('Bring an umbrella');
        }
        break;

      default:
        // General recommendations
        if (weather.condition.toLowerCase().includes('rain')) {
          recommendations.push('Bring rain protection');
        }
        if (weather.temperature < 15) {
          recommendations.push('Dress warmly');
        }
        if (weather.temperature > 30) {
          recommendations.push('Stay hydrated and use sunscreen');
        }
    }

    return {
      suitable,
      recommendations,
      alternativeActivities,
    };
  }

  /**
   * Get weather-based activity recommendations
   */
  static getWeatherBasedRecommendations(weather: WeatherData): string[] {
    const recommendations: string[] = [];

    // Temperature-based recommendations
    if (weather.temperature < 10) {
      recommendations.push('Perfect weather for indoor activities like museums and cafes');
      recommendations.push('Consider hot chocolate or warm beverages');
    } else if (weather.temperature > 35) {
      recommendations.push('Great weather for early morning or evening activities');
      recommendations.push('Consider water activities or air-conditioned venues');
    } else {
      recommendations.push('Ideal weather for outdoor activities and sightseeing');
    }

    // Condition-based recommendations
    switch (weather.condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        recommendations.push('Perfect day for outdoor photography');
        recommendations.push('Great weather for walking tours');
        break;
      case 'partly cloudy':
        recommendations.push('Good weather for outdoor activities with some shade');
        break;
      case 'cloudy':
        recommendations.push('Comfortable weather for extended outdoor activities');
        break;
      case 'rain':
        recommendations.push('Consider indoor activities and cultural sites');
        recommendations.push('Perfect weather for cozy cafes and restaurants');
        break;
    }

    // UV Index recommendations
    if (weather.uvIndex > 6) {
      recommendations.push('High UV index - use sunscreen and seek shade');
    }

    return recommendations;
  }
}
