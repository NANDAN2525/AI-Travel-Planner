/**
 * Internationalization (i18n) support
 * Provides multilingual support for English, Hindi, and regional languages
 */

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'bn';

interface TranslationKeys {
  // Navigation
  'nav.home': string;
  'nav.plan': string;
  'nav.bookings': string;
  'nav.profile': string;
  'nav.signIn': string;
  'nav.signUp': string;

  // Trip Planner
  'tripPlanner.title': string;
  'tripPlanner.subtitle': string;
  'tripPlanner.destination': string;
  'tripPlanner.startDate': string;
  'tripPlanner.endDate': string;
  'tripPlanner.budget': string;
  'tripPlanner.groupSize': string;
  'tripPlanner.interests': string;
  'tripPlanner.travelStyle': string;
  'tripPlanner.accommodation': string;
  'tripPlanner.transportation': string;
  'tripPlanner.generateItinerary': string;
  'tripPlanner.generating': string;

  // Interests
  'interests.heritage': string;
  'interests.nature': string;
  'interests.adventure': string;
  'interests.food': string;
  'interests.nightlife': string;
  'interests.shopping': string;
  'interests.wellness': string;
  'interests.photography': string;
  'interests.art': string;
  'interests.beaches': string;

  // Travel Styles
  'travelStyle.budget': string;
  'travelStyle.luxury': string;
  'travelStyle.adventure': string;
  'travelStyle.cultural': string;
  'travelStyle.wellness': string;

  // Accommodation Types
  'accommodation.hotel': string;
  'accommodation.hostel': string;
  'accommodation.homestay': string;
  'accommodation.resort': string;

  // Transportation
  'transportation.public': string;
  'transportation.private': string;
  'transportation.mixed': string;

  // Itinerary
  'itinerary.title': string;
  'itinerary.summary': string;
  'itinerary.activities': string;
  'itinerary.transportation': string;
  'itinerary.meals': string;
  'itinerary.bookTrip': string;
  'itinerary.saveItinerary': string;
  'itinerary.shareItinerary': string;

  // Booking
  'booking.title': string;
  'booking.personalInfo': string;
  'booking.review': string;
  'booking.payment': string;
  'booking.confirmation': string;
  'booking.firstName': string;
  'booking.lastName': string;
  'booking.email': string;
  'booking.phone': string;
  'booking.address': string;
  'booking.city': string;
  'booking.state': string;
  'booking.zipCode': string;
  'booking.emergencyContact': string;
  'booking.specialRequests': string;
  'booking.totalAmount': string;
  'booking.cardNumber': string;
  'booking.expiryDate': string;
  'booking.cvv': string;
  'booking.cardholderName': string;
  'booking.completeBooking': string;
  'booking.confirmed': string;

  // Common
  'common.loading': string;
  'common.error': string;
  'common.success': string;
  'common.cancel': string;
  'common.next': string;
  'common.previous': string;
  'common.close': string;
  'common.save': string;
  'common.share': string;
  'common.download': string;
  'common.required': string;
  'common.optional': string;
}

const translations: Record<SupportedLanguage, TranslationKeys> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.plan': 'Plan Trip',
    'nav.bookings': 'My Bookings',
    'nav.profile': 'Profile',
    'nav.signIn': 'Sign In',
    'nav.signUp': 'Sign Up',

    // Trip Planner
    'tripPlanner.title': 'Plan Your Perfect Trip',
    'tripPlanner.subtitle': 'Tell us about your travel preferences and we\'ll create a personalized itinerary just for you.',
    'tripPlanner.destination': 'Destination',
    'tripPlanner.startDate': 'Start Date',
    'tripPlanner.endDate': 'End Date',
    'tripPlanner.budget': 'Budget Range (INR)',
    'tripPlanner.groupSize': 'Group Size',
    'tripPlanner.interests': 'What interests you? (Select all that apply)',
    'tripPlanner.travelStyle': 'Travel Style',
    'tripPlanner.accommodation': 'Accommodation Preference',
    'tripPlanner.transportation': 'Transportation Preference',
    'tripPlanner.generateItinerary': 'Generate My Itinerary',
    'tripPlanner.generating': 'Generating Your Itinerary...',

    // Interests
    'interests.heritage': 'Heritage & History',
    'interests.nature': 'Nature & Wildlife',
    'interests.adventure': 'Adventure Sports',
    'interests.food': 'Food & Cuisine',
    'interests.nightlife': 'Nightlife & Entertainment',
    'interests.shopping': 'Shopping',
    'interests.wellness': 'Wellness & Spa',
    'interests.photography': 'Photography',
    'interests.art': 'Art & Culture',
    'interests.beaches': 'Beaches & Water Sports',

    // Travel Styles
    'travelStyle.budget': 'Budget',
    'travelStyle.luxury': 'Luxury',
    'travelStyle.adventure': 'Adventure',
    'travelStyle.cultural': 'Cultural',
    'travelStyle.wellness': 'Wellness',

    // Accommodation Types
    'accommodation.hotel': 'Hotel',
    'accommodation.hostel': 'Hostel',
    'accommodation.homestay': 'Homestay',
    'accommodation.resort': 'Resort',

    // Transportation
    'transportation.public': 'Public Transport',
    'transportation.private': 'Private Vehicle',
    'transportation.mixed': 'Mixed',

    // Itinerary
    'itinerary.title': 'Your Itinerary',
    'itinerary.summary': 'Trip Summary',
    'itinerary.activities': 'Activities',
    'itinerary.transportation': 'Transportation',
    'itinerary.meals': 'Meals',
    'itinerary.bookTrip': 'Book This Trip',
    'itinerary.saveItinerary': 'Save Itinerary',
    'itinerary.shareItinerary': 'Share Itinerary',

    // Booking
    'booking.title': 'Complete Your Booking',
    'booking.personalInfo': 'Personal Information',
    'booking.review': 'Review & Confirm',
    'booking.payment': 'Payment',
    'booking.confirmation': 'Confirmation',
    'booking.firstName': 'First Name',
    'booking.lastName': 'Last Name',
    'booking.email': 'Email',
    'booking.phone': 'Phone',
    'booking.address': 'Address',
    'booking.city': 'City',
    'booking.state': 'State',
    'booking.zipCode': 'ZIP Code',
    'booking.emergencyContact': 'Emergency Contact',
    'booking.specialRequests': 'Special Requests',
    'booking.totalAmount': 'Total Amount',
    'booking.cardNumber': 'Card Number',
    'booking.expiryDate': 'Expiry Date',
    'booking.cvv': 'CVV',
    'booking.cardholderName': 'Cardholder Name',
    'booking.completeBooking': 'Complete Booking',
    'booking.confirmed': 'Booking Confirmed!',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.share': 'Share',
    'common.download': 'Download',
    'common.required': 'Required',
    'common.optional': 'Optional',
  },

  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.plan': 'यात्रा योजना',
    'nav.bookings': 'मेरी बुकिंग',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.signIn': 'साइन इन',
    'nav.signUp': 'साइन अप',

    // Trip Planner
    'tripPlanner.title': 'अपनी परफेक्ट यात्रा की योजना बनाएं',
    'tripPlanner.subtitle': 'हमें अपनी यात्रा की प्राथमिकताएं बताएं और हम आपके लिए एक व्यक्तिगत यात्रा कार्यक्रम बनाएंगे।',
    'tripPlanner.destination': 'गंतव्य',
    'tripPlanner.startDate': 'प्रारंभ तिथि',
    'tripPlanner.endDate': 'समाप्ति तिथि',
    'tripPlanner.budget': 'बजट सीमा (INR)',
    'tripPlanner.groupSize': 'समूह का आकार',
    'tripPlanner.interests': 'आपकी रुचि क्या है? (सभी लागू विकल्प चुनें)',
    'tripPlanner.travelStyle': 'यात्रा शैली',
    'tripPlanner.accommodation': 'आवास प्राथमिकता',
    'tripPlanner.transportation': 'परिवहन प्राथमिकता',
    'tripPlanner.generateItinerary': 'मेरा यात्रा कार्यक्रम बनाएं',
    'tripPlanner.generating': 'आपका यात्रा कार्यक्रम बनाया जा रहा है...',

    // Interests
    'interests.heritage': 'विरासत और इतिहास',
    'interests.nature': 'प्रकृति और वन्यजीव',
    'interests.adventure': 'रोमांचक खेल',
    'interests.food': 'भोजन और व्यंजन',
    'interests.nightlife': 'रात्रि जीवन और मनोरंजन',
    'interests.shopping': 'खरीदारी',
    'interests.wellness': 'स्वास्थ्य और स्पा',
    'interests.photography': 'फोटोग्राफी',
    'interests.art': 'कला और संस्कृति',
    'interests.beaches': 'समुद्र तट और जल खेल',

    // Travel Styles
    'travelStyle.budget': 'बजट',
    'travelStyle.luxury': 'लक्जरी',
    'travelStyle.adventure': 'रोमांच',
    'travelStyle.cultural': 'सांस्कृतिक',
    'travelStyle.wellness': 'स्वास्थ्य',

    // Accommodation Types
    'accommodation.hotel': 'होटल',
    'accommodation.hostel': 'होस्टल',
    'accommodation.homestay': 'होमस्टे',
    'accommodation.resort': 'रिसॉर्ट',

    // Transportation
    'transportation.public': 'सार्वजनिक परिवहन',
    'transportation.private': 'निजी वाहन',
    'transportation.mixed': 'मिश्रित',

    // Itinerary
    'itinerary.title': 'आपका यात्रा कार्यक्रम',
    'itinerary.summary': 'यात्रा सारांश',
    'itinerary.activities': 'गतिविधियां',
    'itinerary.transportation': 'परिवहन',
    'itinerary.meals': 'भोजन',
    'itinerary.bookTrip': 'इस यात्रा को बुक करें',
    'itinerary.saveItinerary': 'यात्रा कार्यक्रम सहेजें',
    'itinerary.shareItinerary': 'यात्रा कार्यक्रम साझा करें',

    // Booking
    'booking.title': 'अपनी बुकिंग पूरी करें',
    'booking.personalInfo': 'व्यक्तिगत जानकारी',
    'booking.review': 'समीक्षा और पुष्टि',
    'booking.payment': 'भुगतान',
    'booking.confirmation': 'पुष्टि',
    'booking.firstName': 'पहला नाम',
    'booking.lastName': 'अंतिम नाम',
    'booking.email': 'ईमेल',
    'booking.phone': 'फोन',
    'booking.address': 'पता',
    'booking.city': 'शहर',
    'booking.state': 'राज्य',
    'booking.zipCode': 'पिन कोड',
    'booking.emergencyContact': 'आपातकालीन संपर्क',
    'booking.specialRequests': 'विशेष अनुरोध',
    'booking.totalAmount': 'कुल राशि',
    'booking.cardNumber': 'कार्ड नंबर',
    'booking.expiryDate': 'समाप्ति तिथि',
    'booking.cvv': 'CVV',
    'booking.cardholderName': 'कार्डधारक का नाम',
    'booking.completeBooking': 'बुकिंग पूरी करें',
    'booking.confirmed': 'बुकिंग पुष्ट!',

    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.close': 'बंद करें',
    'common.save': 'सहेजें',
    'common.share': 'साझा करें',
    'common.download': 'डाउनलोड',
    'common.required': 'आवश्यक',
    'common.optional': 'वैकल्पिक',
  },

  ta: {
    // Navigation
    'nav.home': 'வீடு',
    'nav.plan': 'பயணத் திட்டம்',
    'nav.bookings': 'எனது முன்பதிவுகள்',
    'nav.profile': 'சுயவிவரம்',
    'nav.signIn': 'உள்நுழைய',
    'nav.signUp': 'பதிவு செய்',

    // Trip Planner
    'tripPlanner.title': 'உங்கள் சரியான பயணத்தை திட்டமிடுங்கள்',
    'tripPlanner.subtitle': 'உங்கள் பயண விருப்பங்களை எங்களிடம் கூறுங்கள், நாங்கள் உங்களுக்காக தனிப்பட்ட பயண அட்டவணையை உருவாக்குவோம்.',
    'tripPlanner.destination': 'இலக்கு',
    'tripPlanner.startDate': 'தொடக்க தேதி',
    'tripPlanner.endDate': 'முடிவு தேதி',
    'tripPlanner.budget': 'பட்ஜெட் வரம்பு (INR)',
    'tripPlanner.groupSize': 'குழு அளவு',
    'tripPlanner.interests': 'உங்கள் ஆர்வம் என்ன? (அனைத்து பொருந்தும் விருப்பங்களையும் தேர்ந்தெடுக்கவும்)',
    'tripPlanner.travelStyle': 'பயண பாணி',
    'tripPlanner.accommodation': 'விடுதி விருப்பம்',
    'tripPlanner.transportation': 'போக்குவரத்து விருப்பம்',
    'tripPlanner.generateItinerary': 'எனது பயண அட்டவணையை உருவாக்கு',
    'tripPlanner.generating': 'உங்கள் பயண அட்டவணை உருவாக்கப்படுகிறது...',

    // Interests
    'interests.heritage': 'பாரம்பரியம் மற்றும் வரலாறு',
    'interests.nature': 'இயற்கை மற்றும் வனவிலங்கு',
    'interests.adventure': 'சாகச விளையாட்டுகள்',
    'interests.food': 'உணவு மற்றும் சமையல்',
    'interests.nightlife': 'இரவு வாழ்க்கை மற்றும் பொழுதுபோக்கு',
    'interests.shopping': 'கடைவீதி',
    'interests.wellness': 'ஆரோக்கியம் மற்றும் ஸ்பா',
    'interests.photography': 'புகைப்படம்',
    'interests.art': 'கலை மற்றும் கலாச்சாரம்',
    'interests.beaches': 'கடற்கரைகள் மற்றும் நீர் விளையாட்டுகள்',

    // Travel Styles
    'travelStyle.budget': 'பட்ஜெட்',
    'travelStyle.luxury': 'ஆடம்பரம்',
    'travelStyle.adventure': 'சாகசம்',
    'travelStyle.cultural': 'கலாச்சார',
    'travelStyle.wellness': 'ஆரோக்கியம்',

    // Accommodation Types
    'accommodation.hotel': 'ஹோட்டல்',
    'accommodation.hostel': 'விடுதி',
    'accommodation.homestay': 'வீட்டு தங்கல்',
    'accommodation.resort': 'ரிசார்ட்',

    // Transportation
    'transportation.public': 'பொது போக்குவரத்து',
    'transportation.private': 'தனியார் வாகனம்',
    'transportation.mixed': 'கலப்பு',

    // Itinerary
    'itinerary.title': 'உங்கள் பயண அட்டவணை',
    'itinerary.summary': 'பயண சுருக்கம்',
    'itinerary.activities': 'செயல்பாடுகள்',
    'itinerary.transportation': 'போக்குவரத்து',
    'itinerary.meals': 'உணவு',
    'itinerary.bookTrip': 'இந்த பயணத்தை முன்பதிவு செய்',
    'itinerary.saveItinerary': 'பயண அட்டவணையை சேமி',
    'itinerary.shareItinerary': 'பயண அட்டவணையை பகிர்',

    // Booking
    'booking.title': 'உங்கள் முன்பதிவை முடிக்கவும்',
    'booking.personalInfo': 'தனிப்பட்ட தகவல்',
    'booking.review': 'மறுஆய்வு மற்றும் உறுதிப்படுத்தல்',
    'booking.payment': 'கட்டணம்',
    'booking.confirmation': 'உறுதிப்படுத்தல்',
    'booking.firstName': 'முதல் பெயர்',
    'booking.lastName': 'கடைசி பெயர்',
    'booking.email': 'மின்னஞ்சல்',
    'booking.phone': 'தொலைபேசி',
    'booking.address': 'முகவரி',
    'booking.city': 'நகரம்',
    'booking.state': 'மாநிலம்',
    'booking.zipCode': 'அஞ்சல் குறியீடு',
    'booking.emergencyContact': 'அவசர தொடர்பு',
    'booking.specialRequests': 'சிறப்பு கோரிக்கைகள்',
    'booking.totalAmount': 'மொத்த தொகை',
    'booking.cardNumber': 'அட்டை எண்',
    'booking.expiryDate': 'காலாவதி தேதி',
    'booking.cvv': 'CVV',
    'booking.cardholderName': 'அட்டை வைத்திருப்பவர் பெயர்',
    'booking.completeBooking': 'முன்பதிவை முடிக்கவும்',
    'booking.confirmed': 'முன்பதிவு உறுதிப்படுத்தப்பட்டது!',

    // Common
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'பிழை',
    'common.success': 'வெற்றி',
    'common.cancel': 'ரத்து செய்',
    'common.next': 'அடுத்து',
    'common.previous': 'முந்தைய',
    'common.close': 'மூடு',
    'common.save': 'சேமி',
    'common.share': 'பகிர்',
    'common.download': 'பதிவிறக்கு',
    'common.required': 'தேவை',
    'common.optional': 'விருப்பமானது',
  },

  bn: {
    // Navigation
    'nav.home': 'হোম',
    'nav.plan': 'ভ্রমণ পরিকল্পনা',
    'nav.bookings': 'আমার বুকিং',
    'nav.profile': 'প্রোফাইল',
    'nav.signIn': 'সাইন ইন',
    'nav.signUp': 'সাইন আপ',

    // Trip Planner
    'tripPlanner.title': 'আপনার নিখুঁত ভ্রমণ পরিকল্পনা করুন',
    'tripPlanner.subtitle': 'আপনার ভ্রমণ পছন্দ সম্পর্কে আমাদের বলুন এবং আমরা আপনার জন্য একটি ব্যক্তিগত ভ্রমণ পরিকল্পনা তৈরি করব।',
    'tripPlanner.destination': 'গন্তব্য',
    'tripPlanner.startDate': 'শুরু তারিখ',
    'tripPlanner.endDate': 'শেষ তারিখ',
    'tripPlanner.budget': 'বাজেট পরিসর (INR)',
    'tripPlanner.groupSize': 'দলের আকার',
    'tripPlanner.interests': 'আপনার আগ্রহ কী? (সব প্রযোজ্য বিকল্প নির্বাচন করুন)',
    'tripPlanner.travelStyle': 'ভ্রমণ শৈলী',
    'tripPlanner.accommodation': 'আবাসন পছন্দ',
    'tripPlanner.transportation': 'পরিবহন পছন্দ',
    'tripPlanner.generateItinerary': 'আমার ভ্রমণ পরিকল্পনা তৈরি করুন',
    'tripPlanner.generating': 'আপনার ভ্রমণ পরিকল্পনা তৈরি হচ্ছে...',

    // Interests
    'interests.heritage': 'ঐতিহ্য এবং ইতিহাস',
    'interests.nature': 'প্রকৃতি এবং বন্যপ্রাণী',
    'interests.adventure': 'অ্যাডভেঞ্চার স্পোর্টস',
    'interests.food': 'খাবার এবং রান্না',
    'interests.nightlife': 'রাতের জীবন এবং বিনোদন',
    'interests.shopping': 'কেনাকাটা',
    'interests.wellness': 'সুস্থতা এবং স্পা',
    'interests.photography': 'ফটোগ্রাফি',
    'interests.art': 'শিল্প এবং সংস্কৃতি',
    'interests.beaches': 'সমুদ্র সৈকত এবং জল ক্রীড়া',

    // Travel Styles
    'travelStyle.budget': 'বাজেট',
    'travelStyle.luxury': 'বিলাসিতা',
    'travelStyle.adventure': 'অ্যাডভেঞ্চার',
    'travelStyle.cultural': 'সাংস্কৃতিক',
    'travelStyle.wellness': 'সুস্থতা',

    // Accommodation Types
    'accommodation.hotel': 'হোটেল',
    'accommodation.hostel': 'হোস্টেল',
    'accommodation.homestay': 'হোমস্টে',
    'accommodation.resort': 'রিসোর্ট',

    // Transportation
    'transportation.public': 'পাবলিক ট্রান্সপোর্ট',
    'transportation.private': 'ব্যক্তিগত যানবাহন',
    'transportation.mixed': 'মিশ্র',

    // Itinerary
    'itinerary.title': 'আপনার ভ্রমণ পরিকল্পনা',
    'itinerary.summary': 'ভ্রমণ সারসংক্ষেপ',
    'itinerary.activities': 'কার্যক্রম',
    'itinerary.transportation': 'পরিবহন',
    'itinerary.meals': 'খাবার',
    'itinerary.bookTrip': 'এই ভ্রমণ বুক করুন',
    'itinerary.saveItinerary': 'ভ্রমণ পরিকল্পনা সংরক্ষণ করুন',
    'itinerary.shareItinerary': 'ভ্রমণ পরিকল্পনা শেয়ার করুন',

    // Booking
    'booking.title': 'আপনার বুকিং সম্পূর্ণ করুন',
    'booking.personalInfo': 'ব্যক্তিগত তথ্য',
    'booking.review': 'পর্যালোচনা এবং নিশ্চিতকরণ',
    'booking.payment': 'পেমেন্ট',
    'booking.confirmation': 'নিশ্চিতকরণ',
    'booking.firstName': 'নাম',
    'booking.lastName': 'উপাধি',
    'booking.email': 'ইমেইল',
    'booking.phone': 'ফোন',
    'booking.address': 'ঠিকানা',
    'booking.city': 'শহর',
    'booking.state': 'রাজ্য',
    'booking.zipCode': 'জিপ কোড',
    'booking.emergencyContact': 'জরুরি যোগাযোগ',
    'booking.specialRequests': 'বিশেষ অনুরোধ',
    'booking.totalAmount': 'মোট পরিমাণ',
    'booking.cardNumber': 'কার্ড নম্বর',
    'booking.expiryDate': 'মেয়াদ শেষ তারিখ',
    'booking.cvv': 'CVV',
    'booking.cardholderName': 'কার্ডধারীর নাম',
    'booking.completeBooking': 'বুকিং সম্পূর্ণ করুন',
    'booking.confirmed': 'বুকিং নিশ্চিত!',

    // Common
    'common.loading': 'লোড হচ্ছে...',
    'common.error': 'ত্রুটি',
    'common.success': 'সফলতা',
    'common.cancel': 'বাতিল',
    'common.next': 'পরবর্তী',
    'common.previous': 'পূর্ববর্তী',
    'common.close': 'বন্ধ',
    'common.save': 'সংরক্ষণ',
    'common.share': 'শেয়ার',
    'common.download': 'ডাউনলোড',
    'common.required': 'প্রয়োজনীয়',
    'common.optional': 'ঐচ্ছিক',
  },
};

// Language context and hooks
export class I18nService {
  private static currentLanguage: SupportedLanguage = 'en';

  /**
   * Set the current language
   */
  static setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', language);
    }
  }

  /**
   * Get the current language
   */
  static getCurrentLanguage(): SupportedLanguage {
    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferred-language') as SupportedLanguage;
      if (stored && translations[stored]) {
        this.currentLanguage = stored;
      }
    }
    return this.currentLanguage;
  }

  /**
   * Get translation for a key
   */
  static t(key: keyof TranslationKeys): string {
    const language = this.getCurrentLanguage();
    return translations[language][key] || translations.en[key] || key;
  }

  /**
   * Get all available languages
   */
  static getAvailableLanguages(): { code: SupportedLanguage; name: string; nativeName: string }[] {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    ];
  }

  /**
   * Check if a language is RTL (Right-to-Left)
   */
  static isRTL(language: SupportedLanguage): boolean {
    // Currently all supported languages are LTR
    return false;
  }

  /**
   * Format currency based on language
   */
  static formatCurrency(amount: number, currency: string = 'INR'): string {
    const language = this.getCurrentLanguage();
    
    if (language === 'hi' || language === 'ta' || language === 'bn') {
      // For Indian languages, use Indian number format
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    
    return `${currency} ${amount.toLocaleString()}`;
  }

  /**
   * Format date based on language
   */
  static formatDate(date: Date, language: SupportedLanguage = this.getCurrentLanguage()): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', options);
  }
}
