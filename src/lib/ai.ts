import { createGoogleGenerativeAI } from "@ai-sdk/google";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error(
    "GOOGLE_API_KEY environment variable is missing. Please add it to your .env file."
  );
}

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const gemini = google("gemini-2.5-pro-exp-03-25");
