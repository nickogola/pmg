# PropertyPulse React Frontend

## Overview

This is the React frontend for PropertyPulse, a comprehensive property management system designed to streamline operations for property managers, landlords, and tenants. It provides a user-friendly interface for managing properties, leases, maintenance requests, payments, and communications.

## Features

- **Tenant Portal**:
  - Submit and track maintenance requests
  - Make online payments
  - View announcements and messages
  - Access lease documents

- **Admin/Landlord Portal**:
  - Manage properties and units
  - Process maintenance tickets
  - Track rent payments and generate reports
  - Send announcements to tenants

## Technology Stack

- React 18.2.0
- React Router v6 for navigation
- Zustand for state management
- Axios for API requests
- Tailwind CSS for styling
- React Hook Form for form handling

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/property-pulse.git
```

2. Install dependencies:
```
cd property-pulse/project-mgt-react
npm install
```

3. Start the development server:
```
npm start
```

## Project Structure

- `/src`: Source code for the React application
  - `/components`: React components organized by feature
    - `/admin`: Components for admin/landlord dashboard
    - `/auth`: Authentication components
    - `/landing`: Landing page components
    - `/shared`: Shared components used across the app
    - `/tenant`: Components for tenant dashboard
  - `/store`: Zustand store files
  - `/services`: API service layer
  - `/utils`: Utility functions

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Runs the test suite
- `npm eject`: Ejects from Create React App

## API Integration

This frontend connects to an ASP.NET Core backend API. The API endpoints are defined in the service layer files.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
