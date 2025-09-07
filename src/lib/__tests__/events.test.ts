/**
 * Tests for Events Service
 * Tests local events search and recommendation functionality
 */

import { EventsService } from '../events';

describe('EventsService', () => {
  describe('searchEvents', () => {
    test('should return events for valid search parameters', async () => {
      const events = await EventsService.searchEvents({
        location: 'Delhi',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
      });

      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);

      events.forEach(event => {
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('name');
        expect(event).toHaveProperty('description');
        expect(event).toHaveProperty('date');
        expect(event).toHaveProperty('startTime');
        expect(event).toHaveProperty('endTime');
        expect(event).toHaveProperty('location');
        expect(event).toHaveProperty('category');
        expect(event).toHaveProperty('price');
        expect(event).toHaveProperty('organizer');
        expect(event).toHaveProperty('tags');

        expect(event.location).toHaveProperty('name');
        expect(event.location).toHaveProperty('address');
        expect(event.location).toHaveProperty('coordinates');
        expect(event.location.coordinates).toHaveProperty('lat');
        expect(event.location.coordinates).toHaveProperty('lng');

        expect(event.price).toHaveProperty('min');
        expect(event.price).toHaveProperty('max');
        expect(event.price).toHaveProperty('currency');

        expect(Array.isArray(event.tags)).toBe(true);
      });
    });

    test('should filter events by category', async () => {
      const events = await EventsService.searchEvents({
        location: 'Delhi',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        category: 'cultural',
      });

      expect(Array.isArray(events)).toBe(true);
      events.forEach(event => {
        expect(event.category).toBe('cultural');
      });
    });

    test('should filter events by price range', async () => {
      const events = await EventsService.searchEvents({
        location: 'Delhi',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        priceRange: { min: 0, max: 1000 },
      });

      expect(Array.isArray(events)).toBe(true);
      events.forEach(event => {
        expect(event.price.min).toBeGreaterThanOrEqual(0);
        expect(event.price.max).toBeLessThanOrEqual(1000);
      });
    });

    test('should handle empty results gracefully', async () => {
      const events = await EventsService.searchEvents({
        location: 'NonExistentCity',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
      });

      expect(Array.isArray(events)).toBe(true);
    });
  });

  describe('getEventsForDate', () => {
    test('should return events for a specific date', async () => {
      const events = await EventsService.getEventsForDate('Delhi', '2024-01-15');

      expect(Array.isArray(events)).toBe(true);
      events.forEach(event => {
        expect(event.date).toBe('2024-01-15');
      });
    });
  });

  describe('getEventsByCategory', () => {
    test('should return events filtered by category', async () => {
      const events = await EventsService.getEventsByCategory(
        'Delhi',
        'food',
        '2024-01-15',
        '2024-01-20'
      );

      expect(Array.isArray(events)).toBe(true);
      events.forEach(event => {
        expect(event.category).toBe('food');
      });
    });
  });

  describe('getFreeEvents', () => {
    test('should return only free events', async () => {
      const events = await EventsService.getFreeEvents('Delhi', '2024-01-15', '2024-01-20');

      expect(Array.isArray(events)).toBe(true);
      events.forEach(event => {
        expect(event.price.min).toBe(0);
        expect(event.price.max).toBe(0);
      });
    });
  });

  describe('getEventRecommendations', () => {
    test('should return events based on interests', async () => {
      const events = await EventsService.getEventRecommendations(
        'Delhi',
        ['culture', 'art'],
        '2024-01-15',
        '2024-01-20'
      );

      expect(Array.isArray(events)).toBe(true);
      // Events should be scored and sorted by relevance
      if (events.length > 1) {
        // Check that events with matching interests are prioritized
        const hasRelevantEvent = events.some(event => 
          event.tags.some(tag => ['culture', 'art'].includes(tag)) ||
          event.category === 'cultural' ||
          event.category === 'exhibition'
        );
        expect(hasRelevantEvent).toBe(true);
      }
    });

    test('should return empty array for no matching interests', async () => {
      const events = await EventsService.getEventRecommendations(
        'Delhi',
        ['nonexistent-interest'],
        '2024-01-15',
        '2024-01-20'
      );

      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBe(0);
    });
  });

  describe('getEventById', () => {
    test('should return event details for valid ID', async () => {
      // First get some events to have a valid ID
      const events = await EventsService.searchEvents({
        location: 'Delhi',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
      });

      if (events.length > 0) {
        const event = await EventsService.getEventById(events[0].id);
        expect(event).toBeDefined();
        expect(event?.id).toBe(events[0].id);
      }
    });

    test('should return null for invalid ID', async () => {
      const event = await EventsService.getEventById('invalid-id');
      expect(event).toBeNull();
    });
  });
});
