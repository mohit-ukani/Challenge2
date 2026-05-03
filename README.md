# 🇮🇳 The Voter's Journey

An intelligent, secure, and highly optimized web application designed to guide Indian citizens through the electoral process. 
This platform features interactive timelines, comprehensive checklists, real-time polling station finders, and an AI-powered assistant to answer voter-related queries.

## 🌟 Key Features

- **AI Election Assistant**: A rate-limited, XSS-protected chatbot powered by Google Gemini that answers questions strictly related to the Indian electoral process.
- **Interactive Voter Timeline**: A comprehensive, step-by-step roadmap from registration to casting your ballot.
- **Polling Station Finder**: Google Maps integration to quickly locate nearby election booths using secure, sanitized input.
- **Personalized Checklist**: A persistent tracking system backed by Firebase to ensure you have all the necessary documentation before Election Day.
- **Flawless Performance**: Architected with React code-splitting (`React.lazy`), component memoization (`React.memo`), and resource pre-fetching for lightning-fast load times.
- **Enterprise-grade Security**: Built-in safeguards including strict DOM sanitization, rate limiters, and whitelist-based data persistence.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS
- **Routing**: React Router DOM (v7)
- **Backend/BaaS**: Firebase (Auth, Firestore, Hosting)
- **APIs**: Google Maps API, Google Generative AI (Gemini)
- **Testing**: Vitest, React Testing Library

## 🚀 Getting Started

### Prerequisites

You will need Node.js (v18+) and your own API keys for Firebase, Google Maps, and Gemini.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mohit-ukani/Challenge2.git
   cd Challenge2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Copy the example environment file and fill in your secure credentials:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Running Tests
This project includes a comprehensive, 100% passing test suite across utilities and components:
```bash
npm run test:run
```

## 🔒 Security Best Practices

To prevent accidental leaks, `.env` files are strictly ignored via `.gitignore`. The commit history has been entirely scrubbed to ensure no sensitive credentials exist in the Git logs.

## 📜 License

This project is licensed under the MIT License.
