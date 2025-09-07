/**
 * Booking service for managing trip bookings
 * Integrates with EMT Inventory API and payment processing
 */

import { PaymentService } from './payment';
import { Itinerary } from './vertex-ai';

interface BookingData {
  id: string;
  itineraryId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    specialRequests?: string;
  };
  paymentInfo: {
    method: 'razorpay' | 'stripe';
    paymentId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'captured' | 'failed';
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingDate: Date;
  travelDate: Date;
  totalAmount: number;
  confirmationNumber: string;
  eTicketUrl?: string;
  cancellationPolicy: {
    canCancel: boolean;
    cancellationDeadline: Date;
    refundPercentage: number;
  };
}

interface EMTInventoryItem {
  id: string;
  type: 'hotel' | 'flight' | 'activity' | 'transport';
  name: string;
  description: string;
  price: number;
  availability: boolean;
  bookingUrl?: string;
  provider: string;
}

export class BookingService {
  private static emtApiUrl = process.env.EMT_INVENTORY_API_URL || '';
  private static emtApiKey = process.env.EMT_INVENTORY_API_KEY || '';

  /**
   * Create a new booking
   */
  static async createBooking(
    itinerary: Itinerary,
    customerInfo: BookingData['customerInfo'],
    paymentMethod: 'razorpay' | 'stripe'
  ): Promise<BookingResponse> {
    try {
      // Generate booking ID
      const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      // Calculate total amount
      const totalAmount = itinerary.actualCost;
      
      // Create payment request
      const paymentRequest = {
        amount: totalAmount,
        currency: 'INR',
        orderId: bookingId,
        customerId: customerInfo.email,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        description: `Trip booking for ${itinerary.location}`,
        metadata: {
          itineraryId: itinerary.id,
          bookingId,
        },
      };

      // Process payment
      const paymentResponse = await PaymentService.processPayment(paymentRequest, paymentMethod);
      
      if (!paymentResponse.success) {
        return {
          success: false,
          bookingId,
          paymentId: paymentResponse.paymentId,
          status: 'failed',
          confirmationNumber: '',
          error: paymentResponse.error || 'Payment processing failed',
        };
      }

      // Create booking data
      const bookingData: BookingData = {
        id: bookingId,
        itineraryId: itinerary.id,
        customerInfo,
        paymentInfo: {
          method: paymentMethod,
          paymentId: paymentResponse.paymentId,
          amount: totalAmount,
          currency: 'INR',
          status: 'pending',
        },
        status: 'pending',
        bookingDate: new Date(),
        travelDate: new Date(itinerary.startDate),
        totalAmount,
        confirmationNumber: this.generateConfirmationNumber(),
        cancellationPolicy: {
          canCancel: true,
          cancellationDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          refundPercentage: 100,
        },
      };

      // Save booking to database (in production)
      await this.saveBooking(bookingData);

      // Generate e-ticket
      const eTicketUrl = await this.generateETicket(bookingData, itinerary);

      return {
        success: true,
        bookingId,
        paymentId: paymentResponse.paymentId,
        status: 'confirmed',
        confirmationNumber: bookingData.confirmationNumber,
        eTicketUrl,
      };

    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        bookingId: '',
        paymentId: '',
        status: 'failed',
        confirmationNumber: '',
        error: error instanceof Error ? error.message : 'Booking creation failed',
      };
    }
  }

  /**
   * Confirm booking after payment verification
   */
  static async confirmBooking(
    bookingId: string,
    paymentId: string,
    paymentMethod: 'razorpay' | 'stripe'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify payment
      let paymentResponse;
      if (paymentMethod === 'razorpay') {
        paymentResponse = await PaymentService.verifyRazorpayPayment(
          paymentId,
          bookingId,
          '' // signature would be provided in real implementation
        );
      } else {
        paymentResponse = await PaymentService.confirmStripePayment(paymentId);
      }

      if (!paymentResponse.success) {
        return {
          success: false,
          error: paymentResponse.error || 'Payment verification failed',
        };
      }

      // Update booking status
      await this.updateBookingStatus(bookingId, 'confirmed');

      // Send confirmation email
      await this.sendConfirmationEmail(bookingId);

      return { success: true };

    } catch (error) {
      console.error('Error confirming booking:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Booking confirmation failed',
      };
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(
    bookingId: string,
    reason: string
  ): Promise<{ success: boolean; refundAmount?: number; error?: string }> {
    try {
      // Get booking details
      const booking = await this.getBooking(bookingId);
      if (!booking) {
        return {
          success: false,
          error: 'Booking not found',
        };
      }

      // Check if cancellation is allowed
      if (!booking.cancellationPolicy.canCancel) {
        return {
          success: false,
          error: 'Cancellation not allowed for this booking',
        };
      }

      // Check cancellation deadline
      if (new Date() > booking.cancellationPolicy.cancellationDeadline) {
        return {
          success: false,
          error: 'Cancellation deadline has passed',
        };
      }

      // Calculate refund amount
      const refundAmount = booking.totalAmount * (booking.cancellationPolicy.refundPercentage / 100);

      // Process refund
      const refundResponse = await PaymentService.refundPayment(
        booking.paymentInfo.paymentId,
        refundAmount,
        reason
      );

      if (!refundResponse.success) {
        return {
          success: false,
          error: refundResponse.error || 'Refund processing failed',
        };
      }

      // Update booking status
      await this.updateBookingStatus(bookingId, 'cancelled');

      // Send cancellation email
      await this.sendCancellationEmail(bookingId, refundAmount);

      return {
        success: true,
        refundAmount,
      };

    } catch (error) {
      console.error('Error cancelling booking:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Booking cancellation failed',
      };
    }
  }

  /**
   * Get booking details
   */
  static async getBooking(bookingId: string): Promise<BookingData | null> {
    try {
      // In production, this would fetch from database
      // For demo purposes, return mock data
      return null;
    } catch (error) {
      console.error('Error getting booking:', error);
      return null;
    }
  }

  /**
   * Get user bookings
   */
  static async getUserBookings(userEmail: string): Promise<BookingData[]> {
    try {
      // In production, this would fetch from database
      // For demo purposes, return empty array
      return [];
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  }

  /**
   * Search EMT inventory
   */
  static async searchEMTInventory(
    location: string,
    type: 'hotel' | 'flight' | 'activity' | 'transport',
    date: string
  ): Promise<EMTInventoryItem[]> {
    try {
      // In production, this would call EMT Inventory API
      // For demo purposes, return mock data
      const mockItems: EMTInventoryItem[] = [
        {
          id: 'emt_1',
          type: 'hotel',
          name: 'Grand Hotel',
          description: 'Luxury hotel in city center',
          price: 5000,
          availability: true,
          bookingUrl: 'https://example.com/book/grand-hotel',
          provider: 'EMT Hotels',
        },
        {
          id: 'emt_2',
          type: 'activity',
          name: 'City Tour',
          description: 'Guided city tour with local expert',
          price: 1500,
          availability: true,
          bookingUrl: 'https://example.com/book/city-tour',
          provider: 'EMT Activities',
        },
      ];

      return mockItems.filter(item => item.type === type);
    } catch (error) {
      console.error('Error searching EMT inventory:', error);
      return [];
    }
  }

  /**
   * Generate confirmation number
   */
  private static generateConfirmationNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `CONF-${timestamp}-${random}`;
  }

  /**
   * Save booking to database
   */
  private static async saveBooking(booking: BookingData): Promise<void> {
    try {
      // In production, this would save to database
      console.log('Saving booking:', booking.id);
    } catch (error) {
      console.error('Error saving booking:', error);
      throw error;
    }
  }

  /**
   * Update booking status
   */
  private static async updateBookingStatus(bookingId: string, status: BookingData['status']): Promise<void> {
    try {
      // In production, this would update database
      console.log('Updating booking status:', bookingId, status);
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  /**
   * Generate e-ticket
   */
  private static async generateETicket(booking: BookingData, itinerary: Itinerary): Promise<string> {
    try {
      // In production, this would generate a PDF e-ticket
      const eTicketUrl = `https://example.com/etickets/${booking.id}.pdf`;
      return eTicketUrl;
    } catch (error) {
      console.error('Error generating e-ticket:', error);
      throw error;
    }
  }

  /**
   * Send confirmation email
   */
  private static async sendConfirmationEmail(bookingId: string): Promise<void> {
    try {
      // In production, this would send email via email service
      console.log('Sending confirmation email for booking:', bookingId);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send cancellation email
   */
  private static async sendCancellationEmail(bookingId: string, refundAmount: number): Promise<void> {
    try {
      // In production, this would send email via email service
      console.log('Sending cancellation email for booking:', bookingId, 'Refund:', refundAmount);
    } catch (error) {
      console.error('Error sending cancellation email:', error);
      throw error;
    }
  }
}

interface BookingResponse {
  success: boolean;
  bookingId: string;
  paymentId: string;
  status: 'confirmed' | 'pending' | 'failed';
  confirmationNumber: string;
  eTicketUrl?: string;
  error?: string;
}
