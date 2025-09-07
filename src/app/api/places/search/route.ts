/**
 * API Route for searching places using Google Maps API
 * Handles GET requests to search for places, restaurants, and attractions
 */

import { NextRequest, NextResponse } from 'next/server';
import { MapsService } from '@/lib/maps';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const query = searchParams.get('q');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');
    const type = searchParams.get('type');

    // Validate required parameters
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Parse location if provided
    let location = undefined;
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json(
          { error: 'Invalid latitude or longitude values' },
          { status: 400 }
        );
      }
      
      location = { lat: latitude, lng: longitude };
    }

    // Parse radius
    const searchRadius = radius ? parseInt(radius) : 5000;
    if (isNaN(searchRadius) || searchRadius < 0) {
      return NextResponse.json(
        { error: 'Invalid radius value' },
        { status: 400 }
      );
    }

    // Search for places based on type
    let places;
    if (type === 'restaurant') {
      places = await MapsService.searchRestaurants(
        location || { lat: 0, lng: 0 },
        searchRadius,
        query
      );
    } else if (type === 'attraction') {
      places = await MapsService.searchNearbyAttractions(
        location || { lat: 0, lng: 0 },
        searchRadius,
        'tourist_attraction'
      );
    } else {
      places = await MapsService.searchPlaces(
        query,
        location,
        searchRadius
      );
    }

    // Return the search results
    return NextResponse.json({
      success: true,
      places,
      query,
      location,
      radius: searchRadius,
      type,
    });

  } catch (error) {
    console.error('Error searching places:', error);
    
    // Return appropriate error response
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
