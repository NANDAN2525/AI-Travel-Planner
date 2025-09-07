/**
 * Local Events API integration
 * Provides information about local events, festivals, and activities
 */

interface LocalEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  category: 'festival' | 'concert' | 'exhibition' | 'sports' | 'cultural' | 'food' | 'other';
  price: {
    min: number;
    max: number;
    currency: string;
  };
  capacity?: number;
  organizer: string;
  website?: string;
  imageUrl?: string;
  tags: string[];
}

interface EventSearchParams {
  location: string;
  startDate: string;
  endDate: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  radius?: number; // in kilometers
}

export class EventsService {
  /**
   * Search for local events
   */
  static async searchEvents(params: EventSearchParams): Promise<LocalEvent[]> {
    try {
      // For demo purposes, return mock data
      // In production, you would integrate with event APIs like Eventbrite, Facebook Events, etc.
      const mockEvents: LocalEvent[] = [
        {
          id: 'event_1',
          name: 'Cultural Heritage Festival',
          description: 'A celebration of local culture with traditional music, dance, and food.',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '10:00',
          endTime: '18:00',
          location: {
            name: 'City Center Plaza',
            address: '123 Main Street, City Center',
            coordinates: { lat: 28.6139, lng: 77.2090 },
          },
          category: 'cultural',
          price: { min: 0, max: 500, currency: 'INR' },
          capacity: 1000,
          organizer: 'City Cultural Society',
          website: 'https://example.com/heritage-festival',
          tags: ['culture', 'heritage', 'music', 'dance', 'food'],
        },
        {
          id: 'event_2',
          name: 'Food & Wine Tasting',
          description: 'Experience local cuisine and wines from the region.',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '19:00',
          endTime: '22:00',
          location: {
            name: 'Grand Hotel Ballroom',
            address: '456 Hotel Street, Downtown',
            coordinates: { lat: 28.6140, lng: 77.2091 },
          },
          category: 'food',
          price: { min: 1500, max: 2500, currency: 'INR' },
          capacity: 100,
          organizer: 'Local Restaurant Association',
          website: 'https://example.com/food-wine-tasting',
          tags: ['food', 'wine', 'tasting', 'gourmet'],
        },
        {
          id: 'event_3',
          name: 'Art Exhibition Opening',
          description: 'Contemporary art exhibition featuring local and international artists.',
          date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '18:00',
          endTime: '21:00',
          location: {
            name: 'Modern Art Gallery',
            address: '789 Art District, Cultural Quarter',
            coordinates: { lat: 28.6141, lng: 77.2092 },
          },
          category: 'exhibition',
          price: { min: 0, max: 0, currency: 'INR' },
          capacity: 200,
          organizer: 'Modern Art Gallery',
          website: 'https://example.com/art-exhibition',
          tags: ['art', 'exhibition', 'contemporary', 'culture'],
        },
      ];

      // Filter events based on search parameters
      let filteredEvents = mockEvents;

      // Filter by date range
      filteredEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.date);
        const startDate = new Date(params.startDate);
        const endDate = new Date(params.endDate);
        return eventDate >= startDate && eventDate <= endDate;
      });

      // Filter by category
      if (params.category) {
        filteredEvents = filteredEvents.filter(event => 
          event.category === params.category
        );
      }

      // Filter by price range
      if (params.priceRange) {
        filteredEvents = filteredEvents.filter(event => 
          event.price.min >= params.priceRange!.min && 
          event.price.max <= params.priceRange!.max
        );
      }

      return filteredEvents;
    } catch (error) {
      console.error('Error searching events:', error);
      throw new Error('Failed to search events');
    }
  }

  /**
   * Get events for a specific date
   */
  static async getEventsForDate(location: string, date: string): Promise<LocalEvent[]> {
    try {
      const events = await this.searchEvents({
        location,
        startDate: date,
        endDate: date,
      });

      return events;
    } catch (error) {
      console.error('Error getting events for date:', error);
      throw new Error('Failed to get events for date');
    }
  }

  /**
   * Get events by category
   */
  static async getEventsByCategory(
    location: string,
    category: string,
    startDate: string,
    endDate: string
  ): Promise<LocalEvent[]> {
    try {
      const events = await this.searchEvents({
        location,
        startDate,
        endDate,
        category,
      });

      return events;
    } catch (error) {
      console.error('Error getting events by category:', error);
      throw new Error('Failed to get events by category');
    }
  }

  /**
   * Get free events
   */
  static async getFreeEvents(
    location: string,
    startDate: string,
    endDate: string
  ): Promise<LocalEvent[]> {
    try {
      const events = await this.searchEvents({
        location,
        startDate,
        endDate,
        priceRange: { min: 0, max: 0 },
      });

      return events;
    } catch (error) {
      console.error('Error getting free events:', error);
      throw new Error('Failed to get free events');
    }
  }

  /**
   * Get event recommendations based on interests
   */
  static async getEventRecommendations(
    location: string,
    interests: string[],
    startDate: string,
    endDate: string
  ): Promise<LocalEvent[]> {
    try {
      const allEvents = await this.searchEvents({
        location,
        startDate,
        endDate,
      });

      // Score events based on interests
      const scoredEvents = allEvents.map(event => {
        let score = 0;
        interests.forEach(interest => {
          if (event.tags.includes(interest.toLowerCase())) {
            score += 1;
          }
          if (event.category === interest.toLowerCase()) {
            score += 2;
          }
        });
        return { event, score };
      });

      // Sort by score and return top recommendations
      return scoredEvents
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.event);
    } catch (error) {
      console.error('Error getting event recommendations:', error);
      throw new Error('Failed to get event recommendations');
    }
  }

  /**
   * Get event details by ID
   */
  static async getEventById(eventId: string): Promise<LocalEvent | null> {
    try {
      // In production, this would fetch from a database or API
      const mockEvents = await this.searchEvents({
        location: 'Delhi',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });

      return mockEvents.find(event => event.id === eventId) || null;
    } catch (error) {
      console.error('Error getting event by ID:', error);
      throw new Error('Failed to get event details');
    }
  }
}
