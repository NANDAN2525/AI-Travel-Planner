/**
 * Vertex AI integration for itinerary generation
 * Uses Gemini model for natural language processing and itinerary creation
 */

// Check if we're running on the server side
const isServer = typeof window === 'undefined';

// Import Vertex AI with error handling for development
let VertexAI: any = null;
let vertexAI: any = null;
let model: any = null;

// Only try to import Vertex AI on the server side
if (isServer) {
  try {
    const vertexAIModule = require('@google-cloud/vertexai');
    VertexAI = vertexAIModule.VertexAI;
    
    // Initialize Vertex AI only if credentials are available
    if (process.env.GOOGLE_CLOUD_PROJECT_ID) {
      vertexAI = new VertexAI({
        project: process.env.GOOGLE_CLOUD_PROJECT_ID,
        location: process.env.VERTEX_AI_LOCATION || 'us-central1',
      });

      // Get the Gemini model
      model = vertexAI.getGenerativeModel({
        model: process.env.VERTEX_AI_MODEL || 'gemini-1.5-pro',
      });
    }
  } catch (error) {
    console.warn('Vertex AI not available in development mode:', error);
  }
}

// Trip preferences interface
export interface TripPreferences {
  budget: {
    min: number;
    max: number;
    currency: 'INR' | 'USD' | 'EUR';
  };
  duration: number; // in days
  location: string;
  interests: string[];
  travelStyle: 'budget' | 'luxury' | 'adventure' | 'cultural' | 'wellness';
  groupSize: number;
  accommodationType: 'hotel' | 'hostel' | 'homestay' | 'resort';
  transportation: 'public' | 'private' | 'mixed';
}

// Activity interface
export interface Activity {
  id: string;
  name: string;
  description: string;
  category: 'sightseeing' | 'adventure' | 'cultural' | 'food' | 'shopping' | 'entertainment';
  duration: number; // in hours
  cost: number;
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  rating: number;
  bookingRequired: boolean;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
}

// Day itinerary interface
export interface DayItinerary {
  day: number;
  date: string;
  activities: Activity[];
  totalCost: number;
  totalDuration: number;
  transportation: {
    mode: string;
    cost: number;
    duration: number;
  };
  meals: {
    breakfast: { name: string; cost: number; location: string };
    lunch: { name: string; cost: number; location: string };
    dinner: { name: string; cost: number; location: string };
  };
}

// Complete itinerary interface
export interface Itinerary {
  id: string;
  userId: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalBudget: number;
  actualCost: number;
  days: DayItinerary[];
  accommodation: {
    name: string;
    type: string;
    cost: number;
    location: string;
    rating: number;
  };
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

// AI Service class for itinerary generation
export class AIService {
  /**
   * Generate personalized itinerary using Vertex AI
   */
  static async generateItinerary(preferences: TripPreferences): Promise<Itinerary> {
    try {
      // If Vertex AI is not available, use mock data for development
      if (!model) {
        console.log('Using mock itinerary data for development');
        return this.generateMockItinerary(preferences);
      }

      const prompt = this.buildItineraryPrompt(preferences);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the AI response into structured itinerary
      const itinerary = this.parseItineraryResponse(text, preferences);
      
      return itinerary;
    } catch (error) {
      console.error('Error generating itinerary:', error);
      // Fallback to mock data if AI fails
      console.log('Falling back to mock itinerary data');
      return this.generateMockItinerary(preferences);
    }
  }

  /**
   * Generate mock itinerary for development/testing
   */
  private static generateMockItinerary(preferences: TripPreferences): Itinerary {
    const itineraryId = `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startDate = new Date();
    const endDate = new Date(Date.now() + preferences.duration * 24 * 60 * 60 * 1000);

    // Generate mock days
    const days: DayItinerary[] = [];
    for (let i = 1; i <= preferences.duration; i++) {
      const dayDate = new Date(startDate.getTime() + (i - 1) * 24 * 60 * 60 * 1000);
      
      days.push({
        day: i,
        date: dayDate.toISOString().split('T')[0],
        activities: [
          {
            id: `activity_${i}_1`,
            name: `Morning Activity - Day ${i}`,
            description: `Explore local attractions and cultural sites`,
            category: 'sightseeing',
            duration: 3,
            cost: Math.floor(Math.random() * 500) + 200,
            location: {
              name: `${preferences.location} City Center`,
              coordinates: { lat: 28.6139, lng: 77.2090 }
            },
            rating: 4.5,
            bookingRequired: false,
            timeSlot: 'morning'
          },
          {
            id: `activity_${i}_2`,
            name: `Afternoon Experience - Day ${i}`,
            description: `Local food tour and cultural immersion`,
            category: 'food',
            duration: 2,
            cost: Math.floor(Math.random() * 300) + 150,
            location: {
              name: `Local Market, ${preferences.location}`,
              coordinates: { lat: 28.6140, lng: 77.2091 }
            },
            rating: 4.2,
            bookingRequired: true,
            timeSlot: 'afternoon'
          }
        ],
        totalCost: Math.floor(Math.random() * 800) + 500,
        totalDuration: 8,
        transportation: {
          mode: preferences.transportation === 'public' ? 'Metro/Bus' : 'Taxi',
          cost: Math.floor(Math.random() * 200) + 100,
          duration: 1
        },
        meals: {
          breakfast: { name: 'Local Cafe', cost: 150, location: 'Hotel Area' },
          lunch: { name: 'Traditional Restaurant', cost: 300, location: 'City Center' },
          dinner: { name: 'Fine Dining', cost: 500, location: 'Downtown' }
        }
      });
    }

    const totalCost = days.reduce((sum, day) => sum + day.totalCost, 0);

    return {
      id: itineraryId,
      userId: '',
      title: `${preferences.location} Adventure - ${preferences.duration} Days`,
      location: preferences.location,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalDays: preferences.duration,
      totalBudget: preferences.budget.max,
      actualCost: totalCost,
      days,
      accommodation: {
        name: `${preferences.accommodationType === 'hotel' ? 'Grand' : 'Cozy'} ${preferences.accommodationType === 'hotel' ? 'Hotel' : preferences.accommodationType}`,
        type: preferences.accommodationType,
        cost: Math.floor(Math.random() * 2000) + 1000,
        location: `${preferences.location} City Center`,
        rating: 4.3
      },
      summary: `A wonderful ${preferences.duration}-day adventure in ${preferences.location} featuring ${preferences.interests.join(', ')} experiences. Perfect for ${preferences.travelStyle} travelers with a budget of ₹${preferences.budget.max.toLocaleString()}.`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Build the prompt for AI itinerary generation
   */
  private static buildItineraryPrompt(preferences: TripPreferences): string {
    return `
You are an expert travel planner. Create a detailed, personalized itinerary for a trip with the following requirements:

**Trip Details:**
- Location: ${preferences.location}
- Duration: ${preferences.duration} days
- Budget: ${preferences.budget.min} - ${preferences.budget.max} ${preferences.budget.currency}
- Group Size: ${preferences.groupSize} people
- Travel Style: ${preferences.travelStyle}
- Interests: ${preferences.interests.join(', ')}
- Accommodation Type: ${preferences.accommodationType}
- Transportation: ${preferences.transportation}

**Requirements:**
1. Create a day-by-day itinerary with specific activities, timings, and costs
2. Include breakfast, lunch, and dinner recommendations with local restaurants
3. Suggest transportation options between locations
4. Provide realistic cost estimates for all activities and meals
5. Include a mix of popular attractions and hidden gems
6. Consider the travel style and interests provided
7. Ensure the total cost stays within the budget range
8. Include practical information like booking requirements and best times to visit

**Output Format:**
Please provide a detailed JSON response with the following structure:
{
  "title": "Trip title",
  "summary": "Brief trip summary",
  "accommodation": {
    "name": "Hotel/Accommodation name",
    "type": "hotel/hostel/resort",
    "cost": 0,
    "location": "Location",
    "rating": 4.5
  },
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "id": "unique_id",
          "name": "Activity name",
          "description": "Detailed description",
          "category": "sightseeing/adventure/cultural/food/shopping/entertainment",
          "duration": 2,
          "cost": 100,
          "location": {
            "name": "Location name",
            "coordinates": {"lat": 0, "lng": 0}
          },
          "rating": 4.5,
          "bookingRequired": true,
          "timeSlot": "morning/afternoon/evening/night"
        }
      ],
      "totalCost": 500,
      "totalDuration": 8,
      "transportation": {
        "mode": "taxi/bus/metro/walking",
        "cost": 50,
        "duration": 1
      },
      "meals": {
        "breakfast": {"name": "Restaurant name", "cost": 50, "location": "Location"},
        "lunch": {"name": "Restaurant name", "cost": 100, "location": "Location"},
        "dinner": {"name": "Restaurant name", "cost": 150, "location": "Location"}
      }
    }
  ]
}

Make sure the response is valid JSON and includes realistic, practical recommendations.
    `;
  }

  /**
   * Parse AI response into structured itinerary
   */
  private static parseItineraryResponse(response: string, preferences: TripPreferences): Itinerary {
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      
      // Generate unique ID
      const itineraryId = `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Calculate total costs
      const totalCost = parsedData.days.reduce((sum: number, day: any) => sum + day.totalCost, 0);
      
      // Create itinerary object
      const itinerary: Itinerary = {
        id: itineraryId,
        userId: '', // Will be set when saving to database
        title: parsedData.title || `${preferences.location} Adventure`,
        location: preferences.location,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + preferences.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalDays: preferences.duration,
        totalBudget: preferences.budget.max,
        actualCost: totalCost,
        days: parsedData.days,
        accommodation: parsedData.accommodation,
        summary: parsedData.summary || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return itinerary;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse itinerary response');
    }
  }

  /**
   * Optimize itinerary based on real-time conditions
   */
  static async optimizeItinerary(
    itinerary: Itinerary, 
    conditions: {
      weather?: string;
      events?: string[];
      availability?: { [activityId: string]: boolean };
    }
  ): Promise<Itinerary> {
    try {
      // If Vertex AI is not available, return the original itinerary
      if (!model) {
        console.log('Vertex AI not available, returning original itinerary');
        return itinerary;
      }

      const prompt = `
You are an expert travel planner. Optimize the following itinerary based on real-time conditions:

**Current Itinerary:**
${JSON.stringify(itinerary, null, 2)}

**Real-time Conditions:**
- Weather: ${conditions.weather || 'Normal conditions'}
- Local Events: ${conditions.events?.join(', ') || 'No special events'}
- Activity Availability: ${JSON.stringify(conditions.availability || {})}

**Optimization Requirements:**
1. Adjust activities based on weather conditions
2. Include or avoid local events as appropriate
3. Replace unavailable activities with suitable alternatives
4. Maintain the same budget and duration
5. Keep the overall trip structure intact

Please provide an optimized version of the itinerary in the same JSON format.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const optimizedItinerary = this.parseItineraryResponse(text, {
        budget: { min: 0, max: itinerary.totalBudget, currency: 'INR' },
        duration: itinerary.totalDays,
        location: itinerary.location,
        interests: [],
        travelStyle: 'budget',
        groupSize: 1,
        accommodationType: 'hotel',
        transportation: 'mixed'
      });

      // Preserve original metadata
      optimizedItinerary.id = itinerary.id;
      optimizedItinerary.userId = itinerary.userId;
      optimizedItinerary.createdAt = itinerary.createdAt;
      optimizedItinerary.updatedAt = new Date();

      return optimizedItinerary;
    } catch (error) {
      console.error('Error optimizing itinerary:', error);
      throw new Error('Failed to optimize itinerary');
    }
  }
}
