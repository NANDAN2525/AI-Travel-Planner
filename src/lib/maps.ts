/**
 * Google Maps integration for location services
 * Handles places search, directions, and geocoding
 */

import { Client } from '@googlemaps/google-maps-services-js';

// Initialize Google Maps client
const mapsClient = new Client({});

// Place interface
export interface Place {
  placeId: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  priceLevel?: number;
  types: string[];
  photos?: string[];
  openingHours?: {
    openNow: boolean;
    periods: any[];
  };
  reviews?: {
    author: string;
    rating: number;
    text: string;
    time: Date;
  }[];
}

// Directions interface
export interface Directions {
  distance: string;
  duration: string;
  steps: {
    instruction: string;
    distance: string;
    duration: string;
  }[];
  polyline: string;
}

// Maps service class
export class MapsService {
  private static apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  /**
   * Search for places by query
   */
  static async searchPlaces(
    query: string,
    location?: { lat: number; lng: number },
    radius: number = 5000
  ): Promise<Place[]> {
    try {
      const response = await mapsClient.placesNearby({
        params: {
          key: this.apiKey,
          location: location || { lat: 0, lng: 0 },
          radius,
          keyword: query,
        },
      });

      return response.data.results.map((place) => ({
        placeId: place.place_id || '',
        name: place.name || '',
        address: place.vicinity || '',
        coordinates: {
          lat: place.geometry?.location?.lat || 0,
          lng: place.geometry?.location?.lng || 0,
        },
        rating: place.rating || 0,
        priceLevel: place.price_level,
        types: place.types || [],
        photos: place.photos?.map((photo) => photo.photo_reference || ''),
      }));
    } catch (error) {
      console.error('Error searching places:', error);
      throw new Error('Failed to search places');
    }
  }

  /**
   * Get place details by place ID
   */
  static async getPlaceDetails(placeId: string): Promise<Place | null> {
    try {
      const response = await mapsClient.placeDetails({
        params: {
          key: this.apiKey,
          place_id: placeId,
          fields: [
            'place_id',
            'name',
            'formatted_address',
            'geometry',
            'rating',
            'price_level',
            'types',
            'photos',
            'opening_hours',
            'reviews',
          ],
        },
      });

      const place = response.data.result;
      if (!place) return null;

      return {
        placeId: place.place_id || '',
        name: place.name || '',
        address: place.formatted_address || '',
        coordinates: {
          lat: place.geometry?.location?.lat || 0,
          lng: place.geometry?.location?.lng || 0,
        },
        rating: place.rating || 0,
        priceLevel: place.price_level,
        types: place.types || [],
        photos: place.photos?.map((photo) => photo.photo_reference || ''),
        openingHours: place.opening_hours ? {
          openNow: place.opening_hours.open_now || false,
          periods: place.opening_hours.periods || [],
        } : undefined,
        reviews: place.reviews?.map((review) => ({
          author: review.author_name || '',
          rating: review.rating || 0,
          text: review.text || '',
          time: new Date(review.time || 0),
        })),
      };
    } catch (error) {
      console.error('Error getting place details:', error);
      throw new Error('Failed to get place details');
    }
  }

  /**
   * Get directions between two points
   */
  static async getDirections(
    origin: { lat: number; lng: number } | string,
    destination: { lat: number; lng: number } | string,
    mode: 'driving' | 'walking' | 'transit' | 'bicycling' = 'driving'
  ): Promise<Directions | null> {
    try {
      const response = await mapsClient.directions({
        params: {
          key: this.apiKey,
          origin: typeof origin === 'string' ? origin : `${origin.lat},${origin.lng}`,
          destination: typeof destination === 'string' ? destination : `${destination.lat},${destination.lng}`,
          mode,
        },
      });

      const route = response.data.routes[0];
      if (!route) return null;

      const leg = route.legs[0];
      if (!leg) return null;

      return {
        distance: leg.distance?.text || '',
        duration: leg.duration?.text || '',
        steps: leg.steps?.map((step) => ({
          instruction: step.html_instructions || '',
          distance: step.distance?.text || '',
          duration: step.duration?.text || '',
        })) || [],
        polyline: route.overview_polyline?.points || '',
      };
    } catch (error) {
      console.error('Error getting directions:', error);
      throw new Error('Failed to get directions');
    }
  }

  /**
   * Geocode an address to coordinates
   */
  static async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await mapsClient.geocode({
        params: {
          key: this.apiKey,
          address,
        },
      });

      const result = response.data.results[0];
      if (!result?.geometry?.location) return null;

      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      };
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw new Error('Failed to geocode address');
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  static async reverseGeocode(
    lat: number,
    lng: number
  ): Promise<string | null> {
    try {
      const response = await mapsClient.reverseGeocode({
        params: {
          key: this.apiKey,
          latlng: { lat, lng },
        },
      });

      const result = response.data.results[0];
      return result?.formatted_address || null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw new Error('Failed to reverse geocode');
    }
  }

  /**
   * Search for nearby attractions
   */
  static async searchNearbyAttractions(
    location: { lat: number; lng: number },
    radius: number = 10000,
    type: string = 'tourist_attraction'
  ): Promise<Place[]> {
    try {
      const response = await mapsClient.placesNearby({
        params: {
          key: this.apiKey,
          location,
          radius,
          type,
        },
      });

      return response.data.results.map((place) => ({
        placeId: place.place_id || '',
        name: place.name || '',
        address: place.vicinity || '',
        coordinates: {
          lat: place.geometry?.location?.lat || 0,
          lng: place.geometry?.location?.lng || 0,
        },
        rating: place.rating || 0,
        priceLevel: place.price_level,
        types: place.types || [],
        photos: place.photos?.map((photo) => photo.photo_reference || ''),
      }));
    } catch (error) {
      console.error('Error searching nearby attractions:', error);
      throw new Error('Failed to search nearby attractions');
    }
  }

  /**
   * Search for restaurants
   */
  static async searchRestaurants(
    location: { lat: number; lng: number },
    radius: number = 5000,
    cuisine?: string
  ): Promise<Place[]> {
    try {
      const params: any = {
        key: this.apiKey,
        location,
        radius,
        type: 'restaurant',
      };

      if (cuisine) {
        params.keyword = cuisine;
      }

      const response = await mapsClient.placesNearby({ params });

      return response.data.results.map((place) => ({
        placeId: place.place_id || '',
        name: place.name || '',
        address: place.vicinity || '',
        coordinates: {
          lat: place.geometry?.location?.lat || 0,
          lng: place.geometry?.location?.lng || 0,
        },
        rating: place.rating || 0,
        priceLevel: place.price_level,
        types: place.types || [],
        photos: place.photos?.map((photo) => photo.photo_reference || ''),
      }));
    } catch (error) {
      console.error('Error searching restaurants:', error);
      throw new Error('Failed to search restaurants');
    }
  }
}
