# Health & Nutrition Tracker

A full-stack health and nutrition tracking application built with React, TypeScript, Vite, and Supabase. Features include food recognition via image analysis, calorie tracking, weight prediction, and personalized health recommendations.

## Project Structure

```
project/
├── src/                          # Frontend React application
│   ├── components/               # React components
│   │   ├── UploadFood.tsx       # Food image recognition & logging
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── CalorieTracker.tsx   # Calorie tracking view
│   │   ├── HealthAssessment.tsx # Health assessment form
│   │   └── ...other components
│   ├── contexts/                 # React context for auth
│   │   └── AuthContext.tsx       # Authentication state
│   ├── lib/                      # Utilities
│   │   └── supabase.ts          # Supabase client setup
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # React entry point
├── supabase/functions/           # Supabase Edge Functions (Deno)
│   ├── analyze-food/            # Food analysis function
│   │   └── index.ts
│   ├── get-recommendations/     # Diet recommendations
│   │   └── index.ts
│   └── predict-weight/          # Weight prediction
│       └── index.ts
├── supabase/migrations/          # Database migrations
│   └── 20260407123552_create_health_nutrition_schema.sql
├── .env                          # Environment variables (local only)
├── package.json                  # Frontend dependencies
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
└── deno.lock                     # Deno dependency lock file
```

## Setup Instructions

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Create or update `.env` file:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Supabase Edge Functions Setup

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Link to Your Project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Deploy Functions**
   ```bash
   supabase functions deploy
   ```

   Individual functions can be deployed with:
   ```bash
   supabase functions deploy analyze-food
   supabase functions deploy get-recommendations
   supabase functions deploy predict-weight
   ```

4. **View Function Logs**
   ```bash
   supabase functions logs analyze-food
   ```

## API Documentation

### 1. Analyze Food Function

**Endpoint:** `POST /functions/v1/analyze-food`

Analyzes food from either an image or text input and returns nutritional information.

**Request:**
```bash
curl -X POST https://your-project.functions.supabase.co/analyze-food \
  -H "Content-Type: application/json" \
  -d '{
    "food_name": "apple"
  }'
```

**Response:**
```json
{
  "food_name": "Apple",
  "calories": 95,
  "protein": 0.5,
  "carbs": 25,
  "fats": 0.3,
  "serving_size": "1 medium (182g)"
}
```

**Parameters:**
- `food_name` (optional): Food name for direct lookup
- `image_data` (optional): Base64-encoded image data for image recognition

### 2. Get Recommendations Function

**Endpoint:** `POST /functions/v1/get-recommendations`

Retrieves personalized diet recommendations based on health profile.

**Request:**
```bash
curl -X POST https://your-project.functions.supabase.co/get-recommendations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": "uuid"
  }'
```

**Response:**
```json
{
  "category": "Weight Loss Plan",
  "description": "...",
  "meal_plan": {
    "breakfast": ["..."],
    "lunch": ["..."],
    "dinner": ["..."],
    "snacks": ["..."]
  },
  "foods_to_eat": ["..."],
  "foods_to_avoid": ["..."],
  "tips": ["..."]
}
```

### 3. Predict Weight Function

**Endpoint:** `POST /functions/v1/predict-weight`

Predicts future weight based on calorie intake and activity level.

**Request:**
```bash
curl -X POST https://your-project.functions.supabase.co/predict-weight \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "current_weight": 75,
    "avg_calories": 2000,
    "calorie_goal": 2200,
    "activity_level": "moderate"
  }'
```

## Frontend Integration

The frontend uses the Supabase SDK to invoke these functions. Example from `UploadFood.tsx`:

```typescript
const { data: foodData, error: functionError } = await supabase.functions.invoke('analyze-food', {
  body: { 
    image_data: image,
    food_name: foodName.trim()
  },
});
```

## Database Schema

The application uses PostgreSQL with the following key tables:

- `auth.users` - User authentication (managed by Supabase Auth)
- `public.health_profiles` - User health information
- `public.food_logs` - Daily food intake logs
- `public.daily_summaries` - Aggregated daily nutrition data
- `public.activity_logs` - Exercise and activity tracking

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (Render backend URL in production) |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key (safe for frontend) |

## Deployment (Manual Website Setup)

### Which frontend host to use?

If your backend is already on Render, deploy frontend on **Vercel** (recommended): faster global CDN for static Vite sites, simpler SPA hosting, and easy env var setup.

You can still use Render Static Site if you prefer one platform.

### Option A: Frontend on Vercel (recommended)

1. Push `project/` to GitHub.
2. Go to [Vercel](https://vercel.com/) -> **Add New Project**.
3. Import repo and set:
   - Framework preset: `Vite`
   - Root directory: `project`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variables in Vercel Project Settings:
   - `VITE_API_BASE_URL=https://<your-render-backend>.onrender.com`
   - `VITE_SUPABASE_URL=...`
   - `VITE_SUPABASE_ANON_KEY=...`
5. Deploy.

Notes:
- `vercel.json` is added for SPA route rewrites.
- If backend CORS blocks requests, allow your Vercel domain in backend CORS config.

### Option B: Frontend on Render Static Site

1. Go to [Render](https://render.com/) -> **New** -> **Static Site**.
2. Connect repo and set:
   - Root directory: `project`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
3. Add env vars:
   - `VITE_API_BASE_URL=https://<your-render-backend>.onrender.com`
   - `VITE_SUPABASE_URL=...`
   - `VITE_SUPABASE_ANON_KEY=...`
4. In Render Static Site settings, add a rewrite:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
5. Deploy.

## Frontend Features

- **User Authentication** - Sign up, login, and session management
- **Food Recognition** - Upload images or enter food names
- **Calorie Tracking** - Log meals and track daily intake
- **Health Assessment** - Input health metrics and BMI calculation
- **Dashboard** - View nutrition overview and stats
- **Recommendations** - Get personalized diet recommendations
- **Weight Prediction** - Predict future weight based on current habits

## Backend Functions

### Analyze Food (`analyze-food/index.ts`)
- Detects food from image data using color analysis heuristics
- Falls back to text-based food database lookup
- Returns detailed nutrition information
- Supports both English and Indian cuisine

### Get Recommendations (`get-recommendations/index.ts`)
- Generates personalized diet plans based on BMI category
- Provides meal suggestions and foods to avoid
- Authenticated with JWT token
- Adapts recommendations based on activity level

### Predict Weight (`predict-weight/index.ts`)
- Calculates weight change projections
- Uses calorie deficit/surplus calculations
- Provides trend analysis
- Authenticated with JWT token

## Troubleshooting

### "Failed to analyze food: Edge Function returned a non-2xx status code"

1. Verify `.env` file has correct Supabase credentials
2. Check that the `analyze-food` function is deployed:
   ```bash
   supabase functions list
   ```
3. Check function logs:
   ```bash
   supabase functions logs analyze-food
   ```
4. Verify CORS headers are being returned properly

### Functions Not Deployed

1. Ensure you're logged into Supabase CLI:
   ```bash
   supabase projects list
   ```
2. Deploy with verbose output:
   ```bash
   supabase functions deploy --debug
   ```

### TypeScript Errors in Functions

The project uses Deno for Edge Functions. Module resolution errors from esm.sh imports are expected during local development but will work when deployed. These are not actual compilation errors.

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Technologies Used

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Supabase Edge Functions (Deno), PostgreSQL
- **Authentication:** Supabase Auth
- **State Management:** React Context API
- **HTTP Client:** Supabase JS SDK

## License

This project is provided as-is for educational and development purposes.

## Support

For issues:
1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review function logs in Supabase dashboard
3. Check browser console for frontend errors
4. Verify environment variables are correctly set
