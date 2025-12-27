# CodeShack Junior Guidance Platform

A Twitter/X-inspired mentorship platform where juniors can ask doubts and mentors provide guidance.

## Features

- **Role-Based Authentication**: Separate login for Mentors and Juniors
- **Twitter/X-Style UI**: Dark-first design with modern aesthetics
- **Doubt Management**: Post doubts, get answers from mentors
- **Mentor Answers**: Dedicated section for mentor responses with upvotes
- **Junior Comments**: Thread-style discussion section for juniors
- **Junior Space**: Safe space for junior-only discussions
- **Profile Management**: View stats and activity
- **Responsive Design**: Works on all screen sizes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: JavaScript
- **Authentication**: Mock localStorage-based (for demo)
- **Data**: Mock data (no backend required)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Codeshack-junior-guidance
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Credentials

### Mentor Accounts
```
Email: priya@example.com
Password: password123

Email: sneha@example.com
Password: password123
```

### Junior Accounts
```
Email: rahul@example.com
Password: password123

Email: amit@example.com
Password: password123
```

## Project Structure

```
Codeshack-junior-guidance/
├── app/                    # Next.js app directory
│   ├── page.js            # Home page (feed)
│   ├── landing/           # Landing page for non-auth users
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── dashboard/         # Role-based dashboard
│   ├── ask/               # Ask a doubt page
│   ├── doubts/            # Doubts feed
│   │   └── [id]/         # Individual doubt details
│   ├── space/             # Junior-only space
│   ├── profile/           # User profile
│   ├── layout.js          # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── Sidebar.js        # Navigation sidebar
│   ├── RightSidebar.js   # Trending/login sidebar
│   ├── DoubtCard.js      # Doubt card component
│   ├── AnswerCard.js     # Answer card component
│   ├── MentorBadge.js    # Mentor badge
│   ├── Tag.js            # Tag component
│   └── Navbar.js         # Navbar component
├── data/                  # Mock data
│   └── mockData.js       # Users, doubts, answers, comments
├── utils/                 # Utility functions
│   └── auth.js           # Authentication utilities
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind configuration
├── next.config.js        # Next.js configuration
└── README.md             # This file
```

## Key Features Explained

### Authentication System
- Landing page for non-authenticated users
- Role-based signup (Mentor/Junior)
- Mock authentication using localStorage
- Automatic redirects based on auth status

### Doubt Details Page Structure
```
┌─────────────────────────┐
│ DOUBT (Question)        │
├─────────────────────────┤
│ MENTOR ANSWERS          │
│ - Answer 1 [Upvote]     │
│ - Answer 2 [Upvote]     │
│ [Answer Form - Mentors] │
├─────────────────────────┤
│ JUNIOR COMMENTS         │
│ - Comment 1             │
│ - Comment 2             │
│ [Comment Form - Juniors]│
└─────────────────────────┘
```

### Role-Based Permissions

**Mentors Can:**
- Answer doubts (with mentor badge)
- Receive upvotes on answers
- Post doubts (optional)

**Juniors Can:**
- Post doubts
- Comment on doubts
- Cannot answer doubts

### Design System

**Colors (Twitter/X-inspired):**
- Background: `#000000`
- Cards: `#16181C`
- Text: `#E7E9EA`
- Secondary Text: `#71767B`
- Accent Blue: `#1D9BF0`
- Border: `#2F3336`
- Hover: `#1A1A1A`
- Success: `#00BA7C`

**Typography:**
- System fonts for optimal performance
- Clear hierarchy with font sizes and weights

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## User Flows

### For Non-Authenticated Users
1. Visit any page → Redirected to landing page
2. Choose signup option (Mentor/Junior)
3. Complete signup
4. Redirected to dashboard

### For Mentors
1. Login with mentor credentials
2. Browse doubts feed
3. Click on a doubt
4. View question, answers, and comments
5. Write answer in "Answer Form"
6. Answer appears with mentor badge

### For Juniors
1. Login with junior credentials
2. Post new doubts or browse existing ones
3. Click on a doubt
4. View question, mentor answers, and comments
5. Write comment in "Comment Form"
6. Comment appears in thread

## Future Enhancements

- Real backend integration
- Database for persistent storage
- Real-time notifications
- Search functionality
- Advanced filtering
- User reputation system
- Email notifications
- Mobile app

## Contributing

This is a demo project. Feel free to fork and modify as needed.

## License

MIT License - feel free to use this project for learning purposes.

## Support

For questions or issues, please open an issue in the repository.

---

Built with ❤️ using Next.js and Tailwind CSS
