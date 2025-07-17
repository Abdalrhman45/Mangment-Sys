# Employee Management Frontend

Angular 17 application for managing employees with a modern, responsive interface.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Access the application
# Navigate to http://localhost:4200
```

## Features

- **Employee List**: View all employees with search functionality
- **Add Employee**: Create new employee records with validation
- **Edit Employee**: Update existing employee information
- **Delete Employee**: Remove employees (with confirmation)
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Components

### EmployeeListComponent
- Displays employees in a responsive table
- Search functionality across multiple fields
- Navigation to add/edit forms
- Delete confirmation dialogs

### EmployeeFormComponent
- Reactive form with comprehensive validation
- Handles both create and update operations
- Department dropdown with predefined options
- Form validation with error messages

## Services

### EmployeeService
- HTTP client wrapper for API communication
- CRUD operations for employee management
- Search functionality
- Error handling

## Routing

- `/` - Redirects to employee list
- `/employees` - Employee list view
- `/employees/add` - Add new employee form
- `/employees/edit/:id` - Edit existing employee form

## Styling

- Bootstrap 5 for responsive design
- Custom CSS for enhanced user experience
- Form validation styling
- Consistent color scheme and typography

## Build

```bash
# Development build
ng build

# Production build
ng build --configuration production
```

## Dependencies

- Angular 17
- Bootstrap 5
- RxJS for reactive programming
- Angular Forms for form handling
- Angular Router for navigation