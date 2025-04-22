# ArtisansConnect

A comprehensive MERN stack platform connecting skilled artisans with customers, featuring advanced mission management, portfolio tracking, and real-time communication.

## 🚀 Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Styling**: Tailwind CSS
- **Real-time Features**: WebSocket integration

## 📁 Project Structure

```
mern-artisans/
├── backend/
│   ├── config/          # Database and environment configuration
│   ├── controllers/     # Business logic
│   │   ├── authController.js    # Authentication and user management
│   │   ├── bookingController.js # Booking and appointment handling
│   │   ├── missionController.js # Mission tracking and management
│   │   ├── serviceController.js # Service catalog management
│   │   ├── portfolioController.js # Artisan portfolio management
│   │   ├── messageController.js # Real-time messaging
│   │   └── adminController.js   # Administrative functions
│   ├── middleware/      # Authentication and other middleware
│   ├── models/          # Database models
│   │   ├── User.js      # User profiles and authentication
│   │   ├── Mission.js   # Mission tracking
│   │   ├── Booking.js   # Appointment scheduling
│   │   ├── Service.js   # Service offerings
│   │   ├── Portfolio.js # Artisan portfolios
│   │   ├── Message.js   # Communication
│   │   ├── Analytics.js # Platform analytics
│   │   └── Report.js    # Reporting system
│   ├── routes/          # API routes
│   └── server.js        # Main server file
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── api/         # API integration
│   │   ├── style/       # Styling components
│   │   ├── assets/      # Static assets
│   │   ├── App.js       # Main application component
│   │   └── index.js     # Entry point
│   └── tailwind.config.js
└── README.md
```

## ✨ Current Features

### User Management
- Multi-role system (Secretary, Artisan, Admin)
- Profile management with verification system
- Document verification workflow
- Revenue tracking for artisans
- User status management (active/suspended/pending)
- Last login tracking
- Profile picture support

### Mission Management
- Detailed mission tracking
- Material inventory management
- Work progress documentation
- Photo documentation system
- Time tracking
- Problem and solution documentation
- Client information management
- Status tracking (pending/in_progress/completed)

### Booking System
- Appointment scheduling
- Client information management
- Service selection
- Availability management
- Booking status tracking
- Automated notifications

### Portfolio Management
- Service portfolio display
- Work history documentation
- Photo gallery
- Service descriptions
- Pricing management
- Specialization tracking

### Communication System
- Real-time messaging
- File sharing
- Comment system
- Automated notifications
- Client-artisan communication
- Admin notifications

### Analytics & Reporting
- Revenue tracking
- Performance metrics
- User activity monitoring
- Service popularity tracking
- Platform usage statistics
- Custom report generation

### Admin Features
- User verification management
- Content moderation
- Platform analytics
- Report generation
- User management
- System configuration

## 🎯 Proposed Enhancements

### 1. Advanced Payment System
- [ ] Integration with multiple payment gateways
- [ ] Automated invoicing
- [ ] Payment scheduling
- [ ] Refund processing
- [ ] Revenue analytics
- [ ] Tax calculation and reporting

### 2. Enhanced Mission Management
- [ ] GPS tracking for field missions
- [ ] Material cost estimation
- [ ] Automated time tracking
- [ ] Digital signature collection
- [ ] Work order generation
- [ ] Quality control checklists

### 3. Communication Enhancements
- [ ] Video call integration
- [ ] Voice messaging
- [ ] Automated status updates
- [ ] Multi-language support
- [ ] Template messages
- [ ] Priority messaging

### 4. Advanced Analytics
- [ ] Predictive analytics
- [ ] Custom dashboard creation
- [ ] Export functionality
- [ ] Real-time monitoring
- [ ] Performance benchmarking
- [ ] Trend analysis

### 5. Mobile Optimization
- [ ] Progressive Web App
- [ ] Offline functionality
- [ ] Push notifications
- [ ] Camera integration
- [ ] Location services
- [ ] Mobile payments

### 6. Quality Assurance
- [ ] Automated verification
- [ ] Background check integration
- [ ] Insurance verification
- [ ] Skills assessment
- [ ] Customer feedback system
- [ ] Performance metrics

### 7. Business Tools
- [ ] Inventory management
- [ ] Supply chain integration
- [ ] Cost estimation tools
- [ ] Project management
- [ ] Resource allocation
- [ ] Financial reporting

### 8. AI Integration
- [ ] Smart scheduling
- [ ] Price optimization
- [ ] Customer behavior analysis
- [ ] Automated support
- [ ] Fraud detection
- [ ] Work estimation

## 🛠️ Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
- Create `.env` files in both frontend and backend directories
- Configure necessary environment variables:
  - MongoDB connection string
  - JWT secret
  - Email service credentials
  - File storage configuration
  - Payment gateway credentials

5. Start the development servers
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.
