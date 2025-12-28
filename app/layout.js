import './globals.css'
import MobileNav from '@/components/MobileNav';

export const metadata = {
    title: 'CodeShack - Junior Guidance Platform',
    description: 'A mentorship platform where juniors can ask doubts and mentors provide guidance',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-x-black text-x-text antialiased">
                {children}
                <MobileNav />
            </body>
        </html>
    )
}
