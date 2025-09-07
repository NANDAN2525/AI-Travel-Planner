/**
 * API Route for generating itineraries using Vertex AI
 * Handles POST requests to generate personalized trip itineraries
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/vertex-ai';
import { TripPreferences } from '@/lib/vertex-ai';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const preferences: TripPreferences = body.preferences;

    // Validate required fields
    if (!preferences.location || !preferences.duration || !preferences.budget) {
      return NextResponse.json(
        { error: 'Missing required fields: location, duration, and budget are required' },
        { status: 400 }
      );
    }

    // Validate budget range
    if (preferences.budget.min >= preferences.budget.max) {
      return NextResponse.json(
        { error: 'Minimum budget must be less than maximum budget' },
        { status: 400 }
      );
    }

    // Validate duration
    if (preferences.duration < 1 || preferences.duration > 30) {
      return NextResponse.json(
        { error: 'Duration must be between 1 and 30 days' },
        { status: 400 }
      );
    }

    // Generate itinerary using AI service
    const itinerary = await AIService.generateItinerary(preferences);

    // Return the generated itinerary
    return NextResponse.json({
      success: true,
      itinerary,
    });

  } catch (error) {
    console.error('Error generating itinerary:', error);
    
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
