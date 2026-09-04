# ThreatLens

Real-time cyber incident feed tool that integrates multiple security APIs for threat intelligence, incident detection, and monitoring.

## Description

ThreatLens is a full-stack cybersecurity dashboard that aggregates threat data from multiple security APIs and displays real-time incidents. It helps security teams quickly identify, analyze, and respond to threats through an intuitive web interface.

## Features

* Real-time threat intelligence feed
* Interactive cybersecurity dashboard
* Integration with multiple security APIs
* Incident detection and monitoring
* Data visualization and analytics
* Responsive web interface

## Tech Stack

**Frontend:**

* HTML5 / CSS3
* JavaScript
* HTTP Server

**Backend:**

* Node.js
* Express.js

## Project Structure

```text
ThreatLens/
├── frontend/
│   └── dashboard.html
├── backend/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
└── index.js
```

## Prerequisites

Before you begin, ensure you have installed:

* [Node.js](https://nodejs.org/) (v14 or higher)
* npm (comes with Node.js)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Shruti-Shakya/Threatlens.git
```

### 2. Navigate to the project

```bash
cd ThreatLens
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

## Configuration

Create a `.env` file in the `backend/` folder with your configuration:

```env
PORT=5000
```

The backend server runs on:

```text
http://localhost:5000
```

## Running the Project

### Start Backend Server

From the `backend/` directory:

```bash
node index.js
```

The backend server runs on:

```text
http://localhost:5000
```

### Start Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npx http-server -p 8082
```

Access the dashboard at:

```text
http://localhost:8082/dashboard.html
```

## Usage

1. Start the backend server on port 5000.
2. Start the frontend using `http-server` on port 8082.
3. Open your browser and navigate to `http://localhost:8082/dashboard.html`.
4. View real-time threat incidents on the dashboard.
5. Analyze security data through the dashboard.

## How It Works

* The backend, built with Node.js and Express.js, runs on port 5000 and handles API requests.
* The frontend is served using `http-server` on port 8082.
* The frontend fetches and displays threat data from the backend.
* The dashboard updates to display cybersecurity incidents and threat intelligence data.

## Future Enhancements

* [ ] Database integration for data persistence
* [ ] User authentication and roles
* [ ] Advanced filtering and search
* [ ] Automated alert notifications
* [ ] Enhanced API integration
* [ ] Export reports functionality

## Contributors

* **Darshita Saraswat** – Core development and project structure
* **Shruti Shakya** – Setup, debugging, integration, testing, and AI-assisted development

This is a collaborative group project. Contributions are described individually above.

## My Contributions (Shruti Shakya)

* Set up and ran the full-stack project locally
* Fixed errors related to npm and server startup
* Tested the application and verified dashboard functionality
* Used AI tools to assist with understanding, debugging, and development workflows

## AI Assistance

This project was developed with the help of AI tools for code generation and guidance. All generated code was reviewed, tested, and modified as needed to ensure correct functionality and integration.

## Contact

For questions or collaboration:

**Shruti Shakya**
[shruti.shakya411@gmail.com](mailto:shruti.shakya411@gmail.com)

For questions or collaboration: shruti.shakya411@gmail.com






