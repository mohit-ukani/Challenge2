# The Voter's Journey — Setup Guide

Complete setup instructions for running the application locally and deploying to Google Cloud Run.

---

## Prerequisites

- **Node.js** 18+ and **npm** 9+
- **Google Cloud CLI** (`gcloud`) — [Install Guide](https://cloud.google.com/sdk/docs/install)
- **Docker** (for local container testing) — [Install Guide](https://docs.docker.com/get-docker/)
- A **Google Cloud Platform** account with billing enabled
- A **Firebase** account (free tier works)

---

## 1. Google Cloud Project Setup

### 1.1 Create a GCP Project
```bash
gcloud projects create voters-journey-app --name="Voters Journey"
gcloud config set project voters-journey-app
```

### 1.2 Enable Required APIs
```bash
gcloud services enable \
  maps-backend.googleapis.com \
  calendar-json.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com
```

### 1.3 Create API Keys

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. **Create API Key** for Maps JavaScript API
   - Restrict to "Maps JavaScript API"
   - Add HTTP referrer restrictions for your domains
3. **Create API Key** for Calendar API (public key)
4. **Create OAuth 2.0 Client ID**
   - Application type: "Web application"
   - Authorized JavaScript origins: `http://localhost:5173` (dev) + your Cloud Run URL
   - Authorized redirect URIs: same as above

---

## 2. Firebase Setup

### 2.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" → select your existing GCP project
3. Enable Google Analytics (optional)

### 2.2 Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add your domains to **Authorized domains**:
   - `localhost`
   - Your Cloud Run URL (after deployment)

### 2.3 Create Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose your preferred location (e.g., `us-central1`)
4. Deploy security rules:
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   firebase login
   firebase init firestore
   firebase deploy --only firestore:rules
   ```

### 2.4 Get Web App Config
1. Go to **Project Settings** → **General** → **Your apps**
2. Click **Add app** → **Web** (</>) → Register
3. Copy the Firebase config object

---

## 3. Local Development

### 3.1 Configure Environment
```bash
cp .env.example .env
```

Fill in `.env` with your actual values:
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=voters-journey-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=voters-journey-app
VITE_FIREBASE_STORAGE_BUCKET=voters-journey-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_GOOGLE_MAPS_API_KEY=AIza...
VITE_GOOGLE_MAPS_MAP_ID=your_map_id
VITE_GOOGLE_CALENDAR_CLIENT_ID=123456789.apps.googleusercontent.com
VITE_GOOGLE_CALENDAR_API_KEY=AIza...
```

### 3.2 Install & Run
```bash
npm install
npm run dev
```

Open http://localhost:5173

### 3.3 Run Tests
```bash
npm run test         # Watch mode
npm run test:run     # Single run
```

---

## 4. Deploy to Google Cloud Run

### 4.1 Manual Deployment
```bash
# Authenticate with GCP
gcloud auth login
gcloud config set project voters-journey-app

# Build and submit to Container Registry
gcloud builds submit --tag gcr.io/voters-journey-app/voters-journey \
  --substitutions=\
_VITE_FIREBASE_API_KEY="your_key",\
_VITE_FIREBASE_AUTH_DOMAIN="your_domain",\
_VITE_FIREBASE_PROJECT_ID="your_project",\
_VITE_FIREBASE_STORAGE_BUCKET="your_bucket",\
_VITE_FIREBASE_MESSAGING_SENDER_ID="your_id",\
_VITE_FIREBASE_APP_ID="your_app_id",\
_VITE_GOOGLE_MAPS_API_KEY="your_key",\
_VITE_GOOGLE_MAPS_MAP_ID="your_map_id",\
_VITE_GOOGLE_CALENDAR_CLIENT_ID="your_client_id",\
_VITE_GOOGLE_CALENDAR_API_KEY="your_cal_key"

# Deploy to Cloud Run
gcloud run deploy voters-journey \
  --image gcr.io/voters-journey-app/voters-journey \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
```

### 4.2 Automated Deployment (CI/CD)

Set up a Cloud Build trigger:
```bash
# Connect your Git repository
gcloud builds triggers create github \
  --repo-name=your-repo \
  --repo-owner=your-username \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml \
  --substitutions=\
_VITE_FIREBASE_API_KEY="...",\
_VITE_FIREBASE_AUTH_DOMAIN="..."
# (add all substitution variables)
```

### 4.3 Local Docker Testing
```bash
# Build locally
docker build \
  --build-arg VITE_FIREBASE_API_KEY="your_key" \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN="your_domain" \
  # ... add all VITE_ args
  -t voters-journey .

# Run locally
docker run -p 8080:8080 voters-journey

# Test at http://localhost:8080
```

---

## 5. Post-Deployment Checklist

After getting your Cloud Run URL (e.g., `https://voters-journey-xxxxx-uc.a.run.app`):

- [ ] **Firebase Auth**: Add Cloud Run URL to Authentication → Authorized domains
- [ ] **Google Maps API Key**: Add Cloud Run domain to HTTP referrer restrictions
- [ ] **OAuth Client**: Add Cloud Run URL to authorized JavaScript origins
- [ ] **Test Auth Flow**: Verify Google Sign-In works on deployed URL
- [ ] **Test Maps**: Verify Google Maps loads and displays markers
- [ ] **Test Calendar**: Verify calendar event creation works
- [ ] **Security Headers**: Check CSP, XFO, XCTO headers: `curl -I https://your-url`
- [ ] **SPA Routing**: Verify deep links work (e.g., `/journey`, `/finder`)

---

## Architecture Notes

### Environment Variables
All `VITE_*` variables are **build-time** values baked into the JavaScript bundle. They are:
- **Public-facing keys** (Firebase web config, Maps API key) — safe for client-side use
- **Restricted by domain** in Google Cloud Console to prevent unauthorized use
- **Not server-side secrets** — no sensitive credentials are exposed

### Security
- Firebase Security Rules enforce data access control
- Nginx serves security headers (CSP, X-Frame-Options, etc.)
- Input validation prevents XSS and injection
- React's JSX escaping prevents DOM-based XSS
