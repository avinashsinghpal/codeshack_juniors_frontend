/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'x-black': '#000000',
                'x-card': '#16181C',
                'x-border': '#2F3336',
                'x-text': '#E7E9EA',
                'x-text-secondary': '#71767B',
                'x-blue': '#1D9BF0',
                'x-hover': '#1A1A1A',
                'x-success': '#00BA7C',
            },
            backgroundColor: {
                'glass': 'rgba(22, 24, 28, 0.7)',
                'glass-hover': 'rgba(26, 26, 26, 0.8)',
                'glass-card': 'rgba(22, 24, 28, 0.6)',
            },
            backdropBlur: {
                'xs': '2px',
                'glass': '12px',
                'glass-strong': '24px',
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
