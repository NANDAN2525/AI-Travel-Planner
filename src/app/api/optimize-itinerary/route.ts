/**
 * API Route for optimizing itineraries based on real-time conditions
 * Handles POST requests to update itineraries with current conditions
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIService, Itinerary } from '@/lib/vertex-ai';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { itinerary, conditions } = body;

    // Validate required fields
    if (!itinerary) {
      return NextResponse.json(
        { error: 'Itinerary is required' },
        { status: 400 }
      );
    }

    if (!conditions) {
      return NextResponse.json(
        { error: 'Conditions are required' },
        { status: 400 }
      );
    }

    // Validate itinerary structure
    if (!itinerary.id || !itinerary.days || !Array.isArray(itinerary.days)) {
      return NextResponse.json(
        { error: 'Invalid itinerary structure' },
        { status: 400 }
      );
    }

    // Optimize itinerary using AI service
    const optimizedItinerary = await AIService.optimizeItinerary(itinerary, conditions);

    // Return the optimized itinerary
    return NextResponse.json({
      success: true,
      itinerary: optimizedItinerary,
    });

  } catch (error) {
    console.error('Error optimizing itinerary:', error);
    
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
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
