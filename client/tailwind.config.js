/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366F1',   // Indigo-500
          accent: '#06B6D4',    // Cyan-500 (Accent)
          highlight: '#06B6D4', // Cyan-500
          success: '#22C55E',   // Green-500
          warning: '#F59E0B',   // Amber-500
          error: '#EF4444',     // Red-500
          hover: '#4F46E5',     // Indigo-600
        },
        dark: {
          bg: '#0F172A',        // Slate-900 (Background)
          bgSec: '#111827',     // Gray-900 (Secondary Background)
          card: '#1E293B',      // Slate-800 (Cards)
          border: '#334155',    // Slate-700 (Borders)
          muted: '#CBD5E1',     // Slate-300 (Text Secondary)
          text: '#F8FAFC',      // Slate-50 (Text Primary)
        }
      },
    },
  },
  plugins: [],
}
