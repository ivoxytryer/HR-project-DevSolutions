# HR Management System - Frontend

Modern React TypeScript frontend application for personnel management.

## Features

-  **Employee Management** - Add, edit, and manage employee profiles
-  **Departments** - Organize employees by departments
-  **Attendance Tracking** - Track employee attendance and working hours
-  **Leave Management** - Handle leave requests and approvals
-  **Dashboard** - Overview of company statistics

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS** - Styling

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open automatically at `http://localhost:3000`.

## Project Structure

```
src/
├── pages/           # Page components (Dashboard, Employees, etc.)
├── services/        # API services
├── types/           # TypeScript types
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## API Integration

The app is configured to connect to a backend API. Set the API base URL using the `REACT_APP_API_URL` environment variable:

```bash
export REACT_APP_API_URL=http://your-api.com/api
```

## Component Overview

- **Dashboard** - Statistics and recent activity overview
- **Employees** - Employee list with CRUD operations
- **Departments** - Department management
- **Attendance** - Daily attendance tracking and statistics
- **Leave** - Leave request management

## Development

Add new pages in `src/pages/` and new types in `src/types/index.ts`.

API calls are centralized in `src/services/api.ts`.

