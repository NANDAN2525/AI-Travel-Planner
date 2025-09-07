# AI Travel Agent

A personalized trip planner powered by AI that creates end-to-end itineraries tailored to individual budgets, interests, and real-time conditions with seamless booking and payment capabilities.

## Features

### Core Features
- **AI-Powered Itinerary Generation**: Uses Vertex AI/Gemini to create personalized travel plans
- **Real-Time Adaptation**: Adjusts recommendations based on weather, events, and availability
- **Seamless Booking**: Integrated payment processing with Razorpay and Stripe
- **Multilingual Support**: Available in English, Hindi, Tamil, and Bengali
- **Interactive UI**: Modern React/Next.js interface with Tailwind CSS

### Technical Features
- **Firebase Integration**: Authentication, notifications, and data storage
- **Google Maps API**: Location services, places search, and directions
- **Weather API**: Real-time weather data for itinerary optimization
- **Local Events**: Integration with local events and festivals
- **Payment Gateway**: Secure payment processing
- **Responsive Design**: Mobile-first approach with modern UX

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation
- **Lucide React** for icons

### Backend & AI
- **Vertex AI/Gemini** for AI itinerary generation
- **Google Cloud BigQuery** for data storage
- **Google Maps API** for location services
- **Firebase** for authentication and real-time features

### Payment & Booking
- **Razorpay** and **Stripe** for payment processing
- **EMT Inventory API** for booking management

### Development
- **Jest** and **React Testing Library** for testing
- **ESLint** for code quality
- **TypeScript** for type checking

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud Platform account
- Firebase project
- Google Maps API key
- Payment gateway accounts (Razorpay/Stripe)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-travel-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Google Cloud Configuration
   GOOGLE_CLOUD_PROJECT_ID=your_project_id
   GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account.json

   # Google Maps API
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

   # Vertex AI Configuration
   VERTEX_AI_LOCATION=us-central1
   VERTEX_AI_MODEL=gemini-1.5-pro

   # Payment Gateway Configuration
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key

   # EMT Inventory API
   EMT_INVENTORY_API_URL=https://api.emt.com
   EMT_INVENTORY_API_KEY=your_emt_api_key

   # Weather API
   OPENWEATHER_API_KEY=your_openweather_api_key

   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Set up Google Cloud services**
   - Create a Google Cloud project
   - Enable Vertex AI API
   - Enable BigQuery API
   - Create a service account and download the JSON key
   - Set up Google Maps API

5. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication, Firestore, and Cloud Messaging
   - Get your Firebase configuration

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ai-travel-agent/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── BookingFlow.tsx    # Booking process
│   │   ├── ItineraryDisplay.tsx # Itinerary presentation
│   │   ├── LanguageSelector.tsx # Language switcher
│   │   └── TripPlannerForm.tsx # Trip planning form
│   └── lib/                   # Utility libraries
│       ├── __tests__/         # Test files
│       ├── auth.ts            # Authentication service
│       ├── booking.ts         # Booking service
│       ├── events.ts          # Events service
│       ├── firebase.ts        # Firebase configuration
│       ├── i18n.ts            # Internationalization
│       ├── maps.ts            # Google Maps service
│       ├── payment.ts         # Payment processing
│       ├── vertex-ai.ts       # AI service
│       └── weather.ts         # Weather service
├── public/                    # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## API Endpoints

### Itinerary Generation
- `POST /api/generate-itinerary` - Generate personalized itinerary
- `POST /api/optimize-itinerary` - Optimize existing itinerary

### Places & Events
- `GET /api/places/search` - Search for places and attractions

### Booking
- `POST /api/booking/create` - Create new booking
- `POST /api/booking/confirm` - Confirm booking
- `POST /api/booking/cancel` - Cancel booking

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Railway

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase configuration | Yes |
| `GOOGLE_CLOUD_PROJECT_ID` | Google Cloud project ID | Yes |
| `GOOGLE_APPLICATION_CREDENTIALS` | Service account key path | Yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes |
| `VERTEX_AI_LOCATION` | Vertex AI region | Yes |
| `VERTEX_AI_MODEL` | AI model name | Yes |
| `RAZORPAY_KEY_ID` | Razorpay key ID | Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `EMT_INVENTORY_API_URL` | EMT API endpoint | Yes |
| `EMT_INVENTORY_API_KEY` | EMT API key | Yes |
| `OPENWEATHER_API_KEY` | OpenWeather API key | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@aitravelagent.com or join our Slack channel.

## Roadmap

### Phase 2 Features
- [ ] AI-powered voice assistant
- [ ] AR-based city exploration
- [ ] Social sharing and group booking
- [ ] Loyalty program integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

### Performance Improvements
- [ ] Caching optimization
- [ ] Image optimization
- [ ] Code splitting
- [ ] PWA features
- [ ] Offline support

## Acknowledgments

- Google Cloud Platform for AI services
- Firebase for backend infrastructure
- Tailwind CSS for styling framework
- Next.js team for the amazing framework
- All contributors and testers