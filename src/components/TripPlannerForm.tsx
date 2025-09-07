/**
 * Trip Planner Form Component
 * Main form for collecting user preferences and generating itineraries
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Calendar, Users, DollarSign, Heart, Plane, Car, Train } from 'lucide-react';
import { TripPreferences } from '@/lib/vertex-ai';

// Form validation schema
const tripPlannerSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.object({
    min: z.number().min(1000, 'Minimum budget should be at least ₹1,000'),
    max: z.number().min(1000, 'Maximum budget should be at least ₹1,000'),
  }).refine((data) => data.max >= data.min, {
    message: 'Maximum budget must be greater than or equal to minimum budget',
    path: ['max'],
  }),
  groupSize: z.number().min(1, 'Group size must be at least 1').max(20, 'Group size cannot exceed 20'),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  travelStyle: z.enum(['budget', 'luxury', 'adventure', 'cultural', 'wellness']),
  accommodationType: z.enum(['hotel', 'hostel', 'homestay', 'resort']),
  transportation: z.enum(['public', 'private', 'mixed']),
});

type TripPlannerFormData = z.infer<typeof tripPlannerSchema>;

interface TripPlannerFormProps {
  onSubmit: (preferences: TripPreferences) => void;
  isLoading?: boolean;
}

// Interest options
const interestOptions = [
  { id: 'heritage', label: 'Heritage & History', icon: '🏛️' },
  { id: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
  { id: 'adventure', label: 'Adventure Sports', icon: '🏔️' },
  { id: 'food', label: 'Food & Cuisine', icon: '🍽️' },
  { id: 'nightlife', label: 'Nightlife & Entertainment', icon: '🌃' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'wellness', label: 'Wellness & Spa', icon: '🧘' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'art', label: 'Art & Culture', icon: '🎨' },
  { id: 'beaches', label: 'Beaches & Water Sports', icon: '🏖️' },
];

export default function TripPlannerForm({ onSubmit, isLoading = false }: TripPlannerFormProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TripPlannerFormData>({
    resolver: zodResolver(tripPlannerSchema),
    defaultValues: {
      budget: { min: 5000, max: 50000 },
      groupSize: 2,
      interests: [],
      travelStyle: 'budget',
      accommodationType: 'hotel',
      transportation: 'mixed',
    },
  });

  const watchedValues = watch();

  // Calculate trip duration
  const calculateDuration = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const duration = calculateDuration(watchedValues.startDate, watchedValues.endDate);

  // Handle interest selection
  const toggleInterest = (interestId: string) => {
    const newInterests = selectedInterests.includes(interestId)
      ? selectedInterests.filter(id => id !== interestId)
      : [...selectedInterests, interestId];
    
    setSelectedInterests(newInterests);
    setValue('interests', newInterests);
  };

  // Handle form submission
  const handleFormSubmit = (data: TripPlannerFormData) => {
    const preferences: TripPreferences = {
      budget: {
        min: data.budget.min,
        max: data.budget.max,
        currency: 'INR',
      },
      duration,
      location: data.location,
      interests: data.interests,
      travelStyle: data.travelStyle,
      groupSize: data.groupSize,
      accommodationType: data.accommodationType,
      transportation: data.transportation,
    };

    onSubmit(preferences);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
      <div className="mb-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-xl"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
              Plan Your Perfect Trip
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Tell us about your travel preferences and we'll create a personalized itinerary just for you.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Location and Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Destination
            </label>
            <input
              type="text"
              {...register('location')}
              placeholder="Where do you want to go?"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Start Date
            </label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              End Date
            </label>
            <input
              type="date"
              {...register('endDate')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
            )}
            {duration > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {duration} day{duration !== 1 ? 's' : ''} trip
              </p>
            )}
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-2">
            <DollarSign className="inline w-4 h-4 mr-1" />
            Budget Range (INR)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                {...register('budget.min', { valueAsNumber: true })}
                placeholder="Minimum budget"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
              {errors.budget?.min && (
                <p className="text-red-500 text-sm mt-1">{errors.budget.min.message}</p>
              )}
            </div>
            <div>
              <input
                type="number"
                {...register('budget.max', { valueAsNumber: true })}
                placeholder="Maximum budget"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
              {errors.budget?.max && (
                <p className="text-red-500 text-sm mt-1">{errors.budget.max.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Group Size */}
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-2">
            <Users className="inline w-4 h-4 mr-1" />
            Group Size
          </label>
          <input
            type="number"
            {...register('groupSize', { valueAsNumber: true })}
            min="1"
            max="20"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.groupSize && (
            <p className="text-red-500 text-sm mt-1">{errors.groupSize.message}</p>
          )}
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-3">
            <Heart className="inline w-4 h-4 mr-1" />
            What interests you? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {interestOptions.map((interest) => (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggleInterest(interest.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                  selectedInterests.includes(interest.id)
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white/50 backdrop-blur-sm'
                }`}
              >
                <div className="text-lg mb-1">{interest.icon}</div>
                <div className="text-sm font-medium text-gray-800">{interest.label}</div>
              </button>
            ))}
          </div>
          {errors.interests && (
            <p className="text-red-500 text-sm mt-1">{errors.interests.message}</p>
          )}
        </div>

        {/* Travel Style */}
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-3">
            Travel Style
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { value: 'budget', label: 'Budget', icon: '💰' },
              { value: 'luxury', label: 'Luxury', icon: '✨' },
              { value: 'adventure', label: 'Adventure', icon: '🏔️' },
              { value: 'cultural', label: 'Cultural', icon: '🏛️' },
              { value: 'wellness', label: 'Wellness', icon: '🧘' },
            ].map((style) => (
              <label key={style.value} className="cursor-pointer">
                <input
                  type="radio"
                  value={style.value}
                  {...register('travelStyle')}
                  className="sr-only"
                />
                <div className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  watchedValues.travelStyle === style.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="text-lg mb-1">{style.icon}</div>
                  <div className="text-sm font-medium text-gray-800">{style.label}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Accommodation Type */}
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-3">
            Accommodation Preference
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'hotel', label: 'Hotel', icon: '🏨' },
              { value: 'hostel', label: 'Hostel', icon: '🏠' },
              { value: 'homestay', label: 'Homestay', icon: '🏡' },
              { value: 'resort', label: 'Resort', icon: '🏖️' },
            ].map((accommodation) => (
              <label key={accommodation.value} className="cursor-pointer">
                <input
                  type="radio"
                  value={accommodation.value}
                  {...register('accommodationType')}
                  className="sr-only"
                />
                <div className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  watchedValues.accommodationType === accommodation.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="text-lg mb-1">{accommodation.icon}</div>
                  <div className="text-sm font-medium text-gray-800">{accommodation.label}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Transportation */}
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-3">
            Transportation Preference
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'public', label: 'Public Transport', icon: <Train className="w-5 h-5" /> },
              { value: 'private', label: 'Private Vehicle', icon: <Car className="w-5 h-5" /> },
              { value: 'mixed', label: 'Mixed', icon: <Plane className="w-5 h-5" /> },
            ].map((transport) => (
              <label key={transport.value} className="cursor-pointer">
                <input
                  type="radio"
                  value={transport.value}
                  {...register('transportation')}
                  className="sr-only"
                />
                <div className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  watchedValues.transportation === transport.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex justify-center mb-1">{transport.icon}</div>
                  <div className="text-sm font-medium text-gray-800">{transport.label}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Your Itinerary...
              </div>
            ) : (
              'Generate My Itinerary'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
