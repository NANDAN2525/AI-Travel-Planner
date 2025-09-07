/**
 * Booking Flow Component
 * Handles the complete booking process with payment integration
 */

'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  DollarSign,
  Loader2
} from 'lucide-react';
import { Itinerary } from '@/lib/vertex-ai';

interface BookingFlowProps {
  itinerary: Itinerary;
  onBookingComplete: (bookingId: string) => void;
  onCancel: () => void;
}

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  emergencyContact: string;
  emergencyPhone: string;
  specialRequests: string;
}

interface BookingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function BookingFlow({ itinerary, onBookingComplete, onCancel }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    emergencyContact: '',
    emergencyPhone: '',
    specialRequests: '',
  });

  const steps: BookingStep[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Provide your contact details',
      completed: false,
    },
    {
      id: 'review',
      title: 'Review & Confirm',
      description: 'Review your itinerary and details',
      completed: false,
    },
    {
      id: 'payment',
      title: 'Payment',
      description: 'Complete your payment',
      completed: false,
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      description: 'Booking confirmed',
      completed: false,
    },
  ];

  // Handle form input changes
  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Personal Information
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone &&
          formData.address &&
          formData.city &&
          formData.state &&
          formData.zipCode
        );
      case 1: // Review
        return true;
      case 2: // Payment
        return true;
      default:
        return false;
    }
  };

  // Move to next step
  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Move to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Process payment and complete booking
  const processBooking = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call to process booking
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate booking ID
      const newBookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      setBookingId(newBookingId);
      setCurrentStep(3); // Move to confirmation step
      
      // Call completion callback
      onBookingComplete(newBookingId);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Phone
                </label>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any special dietary requirements, accessibility needs, or other requests..."
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Review Your Booking</h3>
            
            {/* Itinerary Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Trip Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Destination:</strong> {itinerary.location}</p>
                  <p><strong>Duration:</strong> {itinerary.totalDays} days</p>
                  <p><strong>Start Date:</strong> {new Date(itinerary.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p><strong>Accommodation:</strong> {itinerary.accommodation.name}</p>
                  <p><strong>Total Cost:</strong> ₹{itinerary.actualCost.toLocaleString()}</p>
                  <p><strong>Group Size:</strong> 2 people</p>
                </div>
              </div>
            </div>

            {/* Personal Information Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                </div>
                <div>
                  <p><strong>Address:</strong> {formData.address}</p>
                  <p><strong>City:</strong> {formData.city}, {formData.state} {formData.zipCode}</p>
                  {formData.emergencyContact && (
                    <p><strong>Emergency:</strong> {formData.emergencyContact} ({formData.emergencyPhone})</p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Terms & Conditions</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Booking confirmation is subject to availability</li>
                <li>• Cancellation policy: 24 hours before travel for full refund</li>
                <li>• Travel insurance is recommended</li>
                <li>• All prices are inclusive of taxes</li>
              </ul>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Payment Information</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">₹{itinerary.actualCost.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes and fees</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-green-700">
                  Your payment is secured with 256-bit SSL encryption
                </span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-4">
                Your trip has been successfully booked. You will receive a confirmation email shortly.
              </p>
              
              {bookingId && (
                <div className="bg-gray-50 p-4 rounded-lg inline-block">
                  <p className="text-sm text-gray-600">Booking Reference</p>
                  <p className="text-lg font-mono font-semibold">{bookingId}</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-left">
              <h4 className="font-semibold mb-2">What's Next?</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Check your email for booking confirmation and e-tickets</li>
                <li>• Download our mobile app for real-time updates</li>
                <li>• Contact us 24/7 for any assistance</li>
                <li>• Enjoy your trip!</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index <= currentStep
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
                <p className={`text-xs ${
                  index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      {currentStep < 3 && (
        <div className="flex justify-between">
          <button
            onClick={currentStep === 0 ? onCancel : prevStep}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </button>
          
          <button
            onClick={currentStep === 2 ? processBooking : nextStep}
            disabled={!validateStep(currentStep) || isProcessing}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : currentStep === 2 ? (
              'Complete Booking'
            ) : (
              'Next'
            )}
          </button>
        </div>
      )}

      {currentStep === 3 && (
        <div className="text-center">
          <button
            onClick={onCancel}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
