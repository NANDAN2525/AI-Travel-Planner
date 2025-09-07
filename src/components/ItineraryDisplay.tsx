/**
 * Itinerary Display Component
 * Shows the generated itinerary with day-by-day breakdown
 */

'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Navigation, 
  Utensils,
  Bed,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Heart
} from 'lucide-react';
import { Itinerary, DayItinerary, Activity } from '@/lib/vertex-ai';
import { format } from 'date-fns';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onBook?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export default function ItineraryDisplay({ 
  itinerary, 
  onBook, 
  onSave, 
  onShare 
}: ItineraryDisplayProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0])); // First day expanded by default
  const [savedItineraries, setSavedItineraries] = useState<Set<string>>(new Set());

  // Toggle day expansion
  const toggleDay = (dayNumber: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayNumber)) {
      newExpanded.delete(dayNumber);
    } else {
      newExpanded.add(dayNumber);
    }
    setExpandedDays(newExpanded);
  };

  // Toggle save status
  const toggleSave = () => {
    const newSaved = new Set(savedItineraries);
    if (newSaved.has(itinerary.id)) {
      newSaved.delete(itinerary.id);
    } else {
      newSaved.add(itinerary.id);
    }
    setSavedItineraries(newSaved);
    onSave?.();
  };

  // Format time slot
  const formatTimeSlot = (timeSlot: string) => {
    const timeMap: { [key: string]: string } = {
      morning: '9:00 AM - 12:00 PM',
      afternoon: '12:00 PM - 5:00 PM',
      evening: '5:00 PM - 8:00 PM',
      night: '8:00 PM - 11:00 PM',
    };
    return timeMap[timeSlot] || timeSlot;
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      sightseeing: '🏛️',
      adventure: '🏔️',
      cultural: '🎭',
      food: '🍽️',
      shopping: '🛍️',
      entertainment: '🎪',
    };
    return iconMap[category] || '📍';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{itinerary.title}</h1>
            <div className="flex items-center space-x-4 text-blue-100">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {itinerary.location}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {format(new Date(itinerary.startDate), 'MMM dd')} - {format(new Date(itinerary.endDate), 'MMM dd, yyyy')}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {itinerary.totalDays} days
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={toggleSave}
              className={`p-2 rounded-lg transition-colors ${
                savedItineraries.has(itinerary.id)
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <Heart className={`w-5 h-5 ${
                savedItineraries.has(itinerary.id) ? 'fill-current' : ''
              }`} />
            </button>
            <button
              onClick={onShare}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-lg font-semibold">₹{itinerary.totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Estimated Cost</p>
              <p className="text-lg font-semibold">₹{itinerary.actualCost.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Bed className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Accommodation</p>
              <p className="text-lg font-semibold">{itinerary.accommodation.name}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Rating</p>
              <p className="text-lg font-semibold">{itinerary.accommodation.rating}/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Summary */}
      {itinerary.summary && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-3">Trip Summary</h2>
          <p className="text-gray-700 leading-relaxed">{itinerary.summary}</p>
        </div>
      )}

      {/* Day-by-Day Itinerary */}
      <div className="space-y-4">
        {itinerary.days.map((day, index) => (
          <div key={day.day} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Day Header */}
            <div 
              className="p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleDay(day.day)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Day {day.day}</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(day.date), 'EEEE, MMMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">₹{day.totalCost.toLocaleString()}</span> • {day.totalDuration}h
                  </div>
                  {expandedDays.has(day.day) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Day Content */}
            {expandedDays.has(day.day) && (
              <div className="p-6">
                {/* Activities */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Navigation className="w-5 h-5 mr-2" />
                    Activities
                  </h4>
                  <div className="space-y-4">
                    {day.activities.map((activity) => (
                      <div key={activity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{getCategoryIcon(activity.category)}</span>
                            <div>
                              <h5 className="font-semibold">{activity.name}</h5>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatTimeSlot(activity.timeSlot)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <DollarSign className="w-4 h-4 mr-1" />
                              ₹{activity.cost.toLocaleString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="w-4 h-4 mr-1" />
                              {activity.rating}/5
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            {activity.location.name}
                          </div>
                          {activity.bookingRequired && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Booking Required
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transportation */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Navigation className="w-5 h-5 mr-2" />
                    Transportation
                  </h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{day.transportation.mode}</p>
                        <p className="text-sm text-gray-600">Duration: {day.transportation.duration}h</p>
                      </div>
                      <p className="font-semibold">₹{day.transportation.cost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Meals */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Utensils className="w-5 h-5 mr-2" />
                    Meals
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(day.meals).map(([mealType, meal]) => (
                      <div key={mealType} className="bg-green-50 p-4 rounded-lg">
                        <h5 className="font-medium capitalize mb-1">{mealType}</h5>
                        <p className="text-sm text-gray-600 mb-1">{meal.name}</p>
                        <p className="text-sm text-gray-500 mb-2">{meal.location}</p>
                        <p className="font-semibold text-green-700">₹{meal.cost.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={onBook}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Book This Trip
        </button>
        <button
          onClick={onSave}
          className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Save Itinerary
        </button>
      </div>
    </div>
  );
}
