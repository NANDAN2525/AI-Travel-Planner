import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
}))

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}))

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
}))

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
}))

// Mock Google Cloud services
jest.mock('@google-cloud/vertexai', () => ({
  VertexAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('Mock AI response'),
        },
      }),
    }),
  })),
}))

jest.mock('@google-cloud/bigquery', () => ({
  BigQuery: jest.fn(),
}))

jest.mock('@googlemaps/google-maps-services-js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    placesNearby: jest.fn().mockResolvedValue({
      data: {
        results: [],
      },
    }),
    placeDetails: jest.fn().mockResolvedValue({
      data: {
        result: null,
      },
    }),
    directions: jest.fn().mockResolvedValue({
      data: {
        routes: [],
      },
    }),
    geocode: jest.fn().mockResolvedValue({
      data: {
        results: [],
      },
    }),
    reverseGeocode: jest.fn().mockResolvedValue({
      data: {
        results: [],
      },
    }),
  })),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'mock-api-key'
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'mock-project.firebaseapp.com'
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'mock-project'
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'mock-project.appspot.com'
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'mock-sender-id'
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'mock-app-id'
process.env.GOOGLE_CLOUD_PROJECT_ID = 'mock-project'
process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'mock-maps-key'
process.env.VERTEX_AI_LOCATION = 'us-central1'
process.env.VERTEX_AI_MODEL = 'gemini-1.5-pro'
process.env.RAZORPAY_KEY_ID = 'mock-razorpay-key'
process.env.RAZORPAY_KEY_SECRET = 'mock-razorpay-secret'
process.env.STRIPE_PUBLISHABLE_KEY = 'mock-stripe-key'
process.env.STRIPE_SECRET_KEY = 'mock-stripe-secret'
process.env.EMT_INVENTORY_API_URL = 'https://mock-api.com'
process.env.EMT_INVENTORY_API_KEY = 'mock-emt-key'
process.env.OPENWEATHER_API_KEY = 'mock-weather-key'
