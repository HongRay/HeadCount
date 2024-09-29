# **HeadCount**

This project is a web-based application for managing and monitoring occupancy in real-time. It uses a combination of **React (Next.js)** for the frontend and **FastAPI** for the backend to provide real-time occupancy data, live video feed monitoring, and access control. It includes user authentication and settings customization for the system.

## **Table of Contents**
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Running the Project](#running-the-project)
- [Endpoints Overview](#endpoints-overview)
- [Frontend Pages](#frontend-pages)
  - [Login Page](#login-page)
  - [Settings Page](#settings-page)
  - [Dashboard](#dashboard)
- [Backend (FastAPI) Overview](#backend-fastapi-overview)
- [API Endpoints](#api-endpoints)
- [Future Improvements](#future-improvements)

## **Features**

- **Real-time Occupancy Tracking**: Monitors and updates the current occupancy with an alert when capacity is exceeded.
- **Live Video Feed**: Displays a live video feed from a connected webcam or video stream.
- **User Authentication**: Users need to log in to access the dashboard and settings.
- **Settings Customization**: Administrators can set occupancy limits and configure the local webcam from the settings page.
- **Responsive UI**: The frontend is fully responsive, ensuring it works seamlessly across devices.

## **Technologies Used**

### Frontend:
- **React (Next.js)**: Framework for building the user interface.
- **TypeScript**: Strongly typed JavaScript used for frontend logic.
- **Axios**: HTTP client for making API requests.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Webcam / Video Feed Integration**: Uses `iframe` to stream the live feed from the FastAPI backend.

### Backend:
- **FastAPI**: Python web framework to handle API requests and serve the live video feed.
- **OpenCV**: For real-time computer vision tasks such as object detection and live video feed processing.
- **CORS Middleware**: To handle Cross-Origin Resource Sharing between frontend and backend.

## **Setup Instructions**

### Prerequisites:
- **Node.js** (for running the Next.js frontend)
- **Python 3.7+** (for running the FastAPI backend)
- **Virtual environment** (optional but recommended)

### Clone the Repository:
```bash
git clone https://github.com/yourusername/occupancy-dashboard.git
cd occupancy-dashboard
```

## Setup (Next.js):
### Frontend
1. Navigate to the frontend directory (if applicable):
   ```bash
   cd frontend
   ```
2. Install dependencies:
```bash
    npm install
```
3. Start run the front end:
```bash
npm run dev
```

The front end will now run at `http://localhost:3000`

## Backend
1. Navigate to the backend
