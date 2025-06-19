# Vue.js 3 Grafana Faro Application

A modern Vue.js 3 application built with TypeScript, Tailwind CSS, and integrated with Grafana Faro for real-time monitoring and observability.

## Features

- ✅ **Vue.js 3** with Composition API and TypeScript
- ✅ **Tailwind CSS** for modern, responsive UI design
- ✅ **Grafana Faro Integration** for real-time monitoring and error tracking
- ✅ **CRUD Operations** for Users, Products, and Orders
- ✅ **Mock API** with simulated backend calls
- ✅ **Error Handling** with intentional error scenarios
- ✅ **Environment Configuration** for API and monitoring endpoints
- ✅ **Docker Support** for easy containerization
- ✅ **Responsive Design** with mobile-friendly interface

## Tech Stack

- **Frontend**: Vue.js 3, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Monitoring**: Grafana Faro Web SDK
- **Containerization**: Docker, Nginx
- **Development**: ESLint, Hot Module Replacement

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker (optional, for containerization)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vue-grafana-faro-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   # API Configuration
   VITE_API_BASE_URL=http://localhost:8080/api
   
   # Grafana Faro Configuration
   VITE_FARO_COLLECTOR_URL=http://localhost:12347/collect
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Environment Variables

The application supports the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for API calls | `http://localhost:8080/api` |
| `VITE_FARO_COLLECTOR_URL` | Grafana Faro collector endpoint | `http://localhost:12347/collect` |

## Application Structure

```
src/
├── components/          # Reusable Vue components
├── views/              # Page components
│   ├── Home.vue        # Dashboard with overview
│   ├── Users.vue       # User management (CRUD)
│   ├── Products.vue    # Product management (CRUD)
│   └── Orders.vue      # Order management (CRUD)
├── services/           # API service layer
│   └── api.ts          # Mock API implementation
├── types/              # TypeScript type definitions
├── plugins/            # Plugin configurations
│   └── faro.ts         # Grafana Faro setup
├── config/             # Configuration files
│   └── env.ts          # Environment configuration
└── style.css           # Global styles with Tailwind
```

## Features Overview

### CRUD Operations

1. **Users Management**
   - Create, read, update, delete users
   - Role-based user types (admin/user)
   - Form validation and error handling

2. **Products Management**
   - Product catalog with inventory tracking
   - Category-based organization
   - Stock level indicators

3. **Orders Management**
   - Order creation and status tracking
   - Order item details
   - Status workflow (pending → processing → shipped → delivered)

### Error Handling

- **Intentional Errors**: User deletion has a 30% failure rate for demonstration
- **Global Error Handling**: Centralized error display with toast notifications
- **Faro Integration**: All errors are automatically logged to Grafana Faro

### Monitoring Integration

The application integrates with Grafana Faro for:
- **Error Tracking**: Automatic error reporting
- **Performance Monitoring**: Page load times and user interactions
- **Custom Logging**: Business logic events and user actions
- **Real-time Alerts**: Configurable alerting based on error rates

## Mock API

The application includes a comprehensive mock API that simulates:
- **Realistic Delays**: 500-1500ms response times
- **Error Scenarios**: Configurable failure rates
- **Data Persistence**: In-memory data storage during session
- **RESTful Endpoints**: Standard CRUD operations

### API Endpoints

- `GET /users` - List all users
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (30% failure rate)
- Similar endpoints for products and orders

## Containerization

### Docker Build

1. **Build the Docker image**
   ```bash
   docker build -t vue-grafana-faro-app \
     --build-arg VITE_API_BASE_URL=http://your-api-url \
     --build-arg VITE_FARO_COLLECTOR_URL=http://your-faro-collector \
     .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:80 vue-grafana-faro-app
   ```

### Docker Compose

1. **Using Docker Compose**
   ```bash
   # Set environment variables
   export VITE_API_BASE_URL=http://your-api-url
   export VITE_FARO_COLLECTOR_URL=http://your-faro-collector
   
   # Start the application
   docker-compose up -d
   ```

2. **Access the application**
   - Application: `http://localhost:3000`
   - Health check: `http://localhost:3000/health`

### Production Deployment

The Docker setup includes:
- **Multi-stage Build**: Optimized for production
- **Nginx Server**: High-performance static file serving
- **Security Headers**: XSS protection, CSRF prevention
- **Gzip Compression**: Reduced bandwidth usage
- **Health Checks**: Container health monitoring
- **Caching**: Optimized static asset caching

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Vue.js and TypeScript linting rules
- **Prettier**: Code formatting (configure as needed)

## Grafana Faro Setup

To set up Grafana Faro monitoring:

1. **Install Grafana Faro**
   - Set up a Grafana instance
   - Configure the Faro collector
   - Obtain the collector URL

2. **Configure the Application**
   ```bash
   # Set the Faro collector URL
   VITE_FARO_COLLECTOR_URL=https://your-faro-collector-url
   ```

3. **Monitor Your Application**
   - View real-time errors and logs
   - Set up alerts for critical issues
   - Analyze user behavior and performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details 