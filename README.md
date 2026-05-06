# ThreatLens

Real-time cyber incident feed tool that integrates multiple security APIs for threat intelligence, incident detection, and monitoring.

## Description

ThreatLens is a full-stack cybersecurity dashboard that aggregates threat data from multiple security APIs and displays real-time incidents. It helps security teams quickly identify, analyze, and respond to threats through an intuitive web interface.

## Features

- 🔴 Real-time threat intelligence feed
- 📊 Interactive cybersecurity dashboard
- 🔗 Multiple security API integrations
- 🎯 Incident detection and monitoring
- 📈 Data visualization and analytics
- 🔒 Responsive web-based interface

## Tech Stack

**Frontend:**
- HTML5 / CSS3
- JavaScript
- HTTP Server

**Backend:**
- Node.js
- Express.js

## Project Structure
Threatlens/
├── frontend/
│ └── dashboard.html
├── backend/
│ ├── index.js
│ ├── package.json
│ └── package-lock.json
└── index.js


## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

## Installation

1. **Clone the repository:**
git clone https://github.com/Darshita-Saraswat/Threatlens.git
cd Threatlens
2. **Install backend dependencies:**
cd backend
npm install


## Configuration

Create a `.env` file in the `backend/` folder with your configuration:
PORT=3000


## Running the Project-

### Start Backend Server
cd backend
npm start
Server runs on `http://localhost:3000`

### Start Frontend

Open a new terminal:
cd frontend
npx http-server -p 8082
Access dashboard at `http://localhost:8082/dashboard.html`

## Usage

1. Start the backend server (runs on port 3000)
2. Start the frontend with http-server (runs on port 8082)
3. Open your browser and navigate to `http://localhost:8082/dashboard.html`
4. View real-time threat incidents on the dashboard
5. Analyze security data in real-time

## Future Enhancements

- [ ] Database integration for data persistence
- [ ] User authentication and roles
- [ ] Advanced filtering and search
- [ ] Automated alert notifications
- [ ] Enhanced API integration
- [ ] Export reports functionality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Darshita Saraswat**  
GitHub: [@Darshita-Saraswat](https://github.com/Darshita-Saraswat)

## Contact

For questions or collaboration: darshitas.26@gmail.com






