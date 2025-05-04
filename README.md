# FitMotion - AI-Powered Fitness Tracker

<p align="center">
  <img src="public/logo.svg" alt="FitMotion Logo" width="150" />
</p>

<h2 align="center">Track Smarter, Get Stronger</h2>

FitMotion is a modern fitness tracking application built with Next.js. It leverages AI to provide intelligent insights into your workouts and nutrition, helping you reach your fitness goals faster.

**Key Features:**

*   **Workout Logging:** Track exercises, duration, effort, and estimated calories burned.
*   **AI Nutrition Tracking:** Log meals using image analysis and track against personalized targets.
*   **AI-Calculated Nutrition Targets:** Get custom daily calorie and macronutrient goals based on your body metrics, activity level, and fitness objectives.
*   **Weight Monitoring:** Log weight entries and visualize your progress.
*   **AI Fitness Assistant:** Chatbot support for fitness and nutrition questions.
*   **Personalized Dashboard:** Overview of your daily progress and history.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
*   **Authentication:** [Clerk](https://clerk.com/)
*   **Database:**  [NeonDB](https://neon.tech/) with [Prisma](https://www.prisma.io/)
*   **AI:** [Vercel AI SDK](https://sdk.vercel.ai/) with [Google Gemini](https://ai.google.dev/)
*   **File Uploads:** [UploadThing](https://uploadthing.com/)
*   **Animation:** [Framer Motion](https://www.framer.com/motion/)

## Getting Started

First, set up your environment variables. Create a `.env` file in the root of your project and add your API keys and database connection string. Use the `.env.example` or the structure below:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Database (NeonDB PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# UploadThing 
UPLOADTHING_TOKEN='eyJ...' # Get from UploadThing dashboard

# Google Generative AI (Gemini)
GOOGLE_API_KEY=
```

Next, install dependencies and run the development server:

```bash
pnpm install
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
