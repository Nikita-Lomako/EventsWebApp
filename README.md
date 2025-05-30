# Events Web Application

A modern web application for managing events and participants, built with .NET Core and Entity Framework Core.

## Features

- Event management (create, read, update, delete)
- Participant registration and management
- User authentication and authorization
- Role-based access control
- RESTful API endpoints
- Swagger documentation
- Data validation
- AutoMapper for object mapping
- Repository pattern implementation

## Project Structure

The solution is organized into multiple projects following clean architecture principles:

- **EventsWebApp.Core**: Contains domain models, DTOs, interfaces, and validation rules
- **EventsWebApp.Infrastructure**: Implements data access, repositories, and external services
- **EventsWebApp.MinimalAPI**: Contains the API endpoints and application configuration
- **EventsWebApp.Tests**: Contains unit tests and integration tests

## Prerequisites

- .NET 7.0 SDK or later
- SQL Server (local or remote)
- Visual Studio 2022 or Visual Studio Code

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/EventsWebApp.git
   cd EventsWebApp
   ```

2. Update the connection string in `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=EventsWebApp;Trusted_Connection=True;MultipleActiveResultSets=true"
     }
   }
   ```

3. Update JWT settings in `appsettings.json`:
   ```json
   {
     "Jwt": {
       "Key": "your-secret-key-here",
       "Issuer": "your-issuer",
       "Audience": "your-audience"
     }
   }
   ```

4. Install dependencies and run migrations:
   ```bash
   dotnet restore
   dotnet ef database update
   ```

5. Run the application:
   ```bash
   dotnet run --project EventsWebApp.MinimalAPI
   ```

6. Access the Swagger UI at `https://localhost:5001/swagger`

## API Endpoints

### Events

- `GET /api/events` - Get all events
- `GET /api/events/{id}` - Get event by ID
- `GET /api/events/search` - Search events by criteria
- `POST /api/events` - Create new event (Admin only)
- `PUT /api/events/{id}` - Update event (Admin only)
- `DELETE /api/events/{id}` - Delete event (Admin only)

### Participants

- `GET /api/participants` - Get all participants (Admin only)
- `GET /api/participants/{id}` - Get participant by ID
- `GET /api/participants/event/{eventId}` - Get participants by event
- `GET /api/participants/user` - Get current user's participants
- `POST /api/participants` - Register for an event
- `DELETE /api/participants/{id}` - Cancel registration

## Authentication

The API uses JWT (JSON Web Token) for authentication. To access protected endpoints:

1. Register a new user or login to get a JWT token
2. Include the token in the Authorization header:
   ```
   Authorization: Bearer your-jwt-token
   ```

## Testing

Run the tests using:
```bash
dotnet test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 