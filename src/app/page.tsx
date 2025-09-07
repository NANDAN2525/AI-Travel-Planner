/**
 * Main Page Component
 * Homepage with trip planner form and itinerary display
 */

'use client';

import React, { useState } from 'react';
import { Plane, MapPin, Calendar, Users, DollarSign, Sparkles } from 'lucide-react';
import TripPlannerForm from '@/components/TripPlannerForm';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import BookingFlow from '@/components/BookingFlow';
import GoogleAuth from '@/components/GoogleAuth';
import { TripPreferences, Itinerary } from '@/lib/vertex-ai';

type AppState = 'planning' | 'generating' | 'itinerary' | 'booking';

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>('planning');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle trip planner form submission
  const handleTripPlannerSubmit = async (preferences: TripPreferences) => {
    setIsLoading(true);
    setError(null);
    setAppState('generating');

    try {
      // Call the API route to generate itinerary
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setItinerary(data.itinerary);
        setAppState('itinerary');
      } else {
        throw new Error(data.error || 'Failed to generate itinerary');
      }
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate itinerary');
      setAppState('planning');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle booking initiation
  const handleBookTrip = () => {
    setAppState('booking');
  };

  // Handle booking completion
  const handleBookingComplete = (bookingId: string) => {
    console.log('Booking completed:', bookingId);
    // Here you would typically redirect to a success page or show a confirmation
  };

  // Handle save itinerary
  const handleSaveItinerary = () => {
    console.log('Saving itinerary:', itinerary?.id);
    // Here you would typically save to user's saved itineraries
  };

  // Handle share itinerary
  const handleShareItinerary = () => {
    console.log('Sharing itinerary:', itinerary?.id);
    // Here you would typically implement sharing functionality
  };

  // Handle cancel booking
  const handleCancelBooking = () => {
    setAppState('itinerary');
  };

  // Handle back to planning
  const handleBackToPlanning = () => {
    setAppState('planning');
    setItinerary(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75"></div>
                <Plane className="relative w-8 h-8 text-white mr-2" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Travel Agent
              </h1>
            </div>
            <GoogleAuth />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {appState === 'planning' && (
          <div>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="relative">
                  <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
                    Plan Your Perfect Trip with AI
                  </h2>
                  <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Get personalized itineraries tailored to your budget, interests, and preferences. 
                    Our AI creates the perfect travel plan just for you.
                  </p>
                </div>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div className="group flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">AI-Powered</h3>
                  <p className="text-sm text-gray-600 text-center">Smart recommendations based on your preferences</p>
                </div>
                <div className="group flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Budget-Friendly</h3>
                  <p className="text-sm text-gray-600 text-center">Stay within your budget with cost breakdowns</p>
                </div>
                <div className="group flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Real-Time Updates</h3>
                  <p className="text-sm text-gray-600 text-center">Adapts to weather and local events</p>
                </div>
                <div className="group flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Local Insights</h3>
                  <p className="text-sm text-gray-600 text-center">Discover hidden gems and local favorites</p>
                </div>
              </div>
            </div>

            {/* Trip Planner Form */}
            <TripPlannerForm 
              onSubmit={handleTripPlannerSubmit}
              isLoading={isLoading}
            />

            {/* Error Display */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {appState === 'generating' && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Generating Your Perfect Itinerary
            </h3>
            <p className="text-gray-600">
              Our AI is analyzing your preferences and creating a personalized travel plan...
            </p>
          </div>
        )}

        {appState === 'itinerary' && itinerary && (
          <div>
            <div className="mb-6">
              <button
                onClick={handleBackToPlanning}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Plan Another Trip
              </button>
            </div>
            <ItineraryDisplay
              itinerary={itinerary}
              onBook={handleBookTrip}
              onSave={handleSaveItinerary}
              onShare={handleShareItinerary}
            />
          </div>
        )}

        {appState === 'booking' && itinerary && (
          <div>
            <div className="mb-6">
              <button
                onClick={handleCancelBooking}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Itinerary
              </button>
            </div>
            <BookingFlow
              itinerary={itinerary}
              onBookingComplete={handleBookingComplete}
              onCancel={handleCancelBooking}
            />
        </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75"></div>
                  <Plane className="relative w-6 h-6 text-white mr-2" />
                </div>
                <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-lg">
                  AI Travel Agent
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your personal AI-powered travel companion for creating perfect itineraries.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Features</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="hover:text-blue-600 transition-colors cursor-pointer">AI Itinerary Generation</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Real-time Adaptations</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Budget Optimization</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Local Recommendations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Support</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Contact Us</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">FAQ</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">24/7 Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="hover:text-blue-600 transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Careers</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-500">
              &copy; 2024 AI Travel Agent. All rights reserved. Made with ❤️ for travelers worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}