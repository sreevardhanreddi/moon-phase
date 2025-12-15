/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./*.html",
        "./*.js"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            animation: {
                'pulse-slow': 'pulse 2s ease-in-out infinite',
            }
        }
    },
    plugins: [],
}

