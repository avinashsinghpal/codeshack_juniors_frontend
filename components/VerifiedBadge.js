'use client';

export default function VerifiedBadge() {
    return (
        <div className="relative inline-flex items-center justify-center" title="Verified Mentor">
            {/* Pulsing background */}
            <div className="absolute w-6 h-6 rounded-full bg-green-400 animate-ping opacity-75"></div>

            {/* Badge */}
            <div className="relative inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500">
                <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </div>
    );
}
