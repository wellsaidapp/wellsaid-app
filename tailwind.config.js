/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Dynamically applied collection colors
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-gray-500',
    'bg-blue-400',
    'bg-orange-500',
    'bg-amber-500',
    'bg-lime-500',
    'bg-emerald-500',
    'bg-rose-500',
    'bg-green-400',
    'bg-violet-500',
    'bg-cyan-500',
    'bg-fuchsia-500',
    'bg-sky-500',
    'bg-pink-400',
    'bg-purple-400',
    'bg-yellow-400',
    'bg-red-400',
    'bg-amber-400',
    'bg-indigo-400',
    'bg-teal-400'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
