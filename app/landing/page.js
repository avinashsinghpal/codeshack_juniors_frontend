import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-x-black flex flex-col md:flex-row">
            {/* Left side - Logo */}
            <div className="flex-1 flex items-center justify-center py-12 md:py-0">
                <div className="text-7xl sm:text-9xl md:text-[200px] lg:text-[300px] font-bold text-x-text">
                    CS
                </div>
            </div>

            {/* Right side - Auth options */}
            <div className="flex-1 flex items-center justify-center px-6 md:px-8 pb-8 md:pb-0">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-x-text mb-6 md:mb-8">Get answers now</h1>

                    <h2 className="text-2xl sm:text-3xl font-bold text-x-text mb-6 md:mb-8">Join today.</h2>

                    <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                        <Link
                            href="/signup?role=mentor"
                            className="block w-full py-3 px-6 rounded-full bg-x-blue text-white font-semibold text-center hover:bg-x-blue/90 transition-colors tap-target"
                        >
                            Sign up as Mentor
                        </Link>

                        <Link
                            href="/signup?role=junior"
                            className="block w-full py-3 px-6 rounded-full border border-x-border text-x-text font-semibold text-center hover:bg-x-hover transition-colors tap-target"
                        >
                            Sign up as Junior
                        </Link>

                        <Link
                            href="/signup?role=admin"
                            className="block w-full py-3 px-6 rounded-full border border-red-500/50 text-red-400 font-semibold text-center hover:bg-red-500/10 transition-colors tap-target"
                        >
                            Sign up as Admin
                        </Link>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-x-border"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-x-black text-x-text-secondary">OR</span>
                            </div>
                        </div>

                        <Link
                            href="/login"
                            className="block w-full py-3 px-6 rounded-full border border-x-border text-x-blue font-semibold text-center hover:bg-x-hover transition-colors tap-target"
                        >
                            Log in
                        </Link>
                    </div>

                    <p className="text-xs text-x-text-secondary mb-8">
                        By signing up, you agree to the{' '}
                        <a href="#" className="text-x-blue hover:underline">Terms of Service</a> and{' '}
                        <a href="#" className="text-x-blue hover:underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
