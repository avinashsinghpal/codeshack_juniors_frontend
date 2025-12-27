# Frontend Environment Setup

**IMPORTANT:** Create a file named `.env.local` in the root directory with the following content:

## For Production (Deployed Backend):
```env
NEXT_PUBLIC_API_URL=https://codeshack-backend.onrender.com/api
```

## For Local Development:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## How to Create:

1. Navigate to the project root folder
2. Create a new file called `.env.local`
3. Add the appropriate line based on your environment (production or local)
4. Save the file
5. Restart your development server if it's running

This tells the frontend where to find the backend API.
